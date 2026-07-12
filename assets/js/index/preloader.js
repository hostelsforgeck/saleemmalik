/**
 * MacBook-style preloader.
 *
 * Shows a full-name mark over a bordered progress bar, then reveals the site
 * once BOTH conditions are met:
 *   1. all above-the-fold assets have loaded (gated on `window.load`), and
 *   2. a minimum display time has elapsed.
 *
 * The minimum time matters on fast/local loads: without it, `window.load`
 * fires almost instantly and the bar snaps to 100% with no animation, which
 * reads as a glitch. Instead the bar fills smoothly to ~90% across the minimum
 * window, then completes to 100% and fades away.
 *
 * Shown once per browser session: on completion we set a sessionStorage flag,
 * and an inline <head> script skips the whole thing on subsequent loads.
 */
(function () {
    "use strict";

    // Already shown this session — the inline head script hid the overlay; do nothing.
    if (document.documentElement.classList.contains("preloaded")) return;

    const preloader = document.getElementById("preloader");
    if (!preloader) return;

    const fill = preloader.querySelector(".preloader-bar-fill");
    const grid = document.querySelector(".grid-container");

    document.body.classList.add("preloading");

    // Arm the bento cards up front (hidden) so they can stagger in on hand-off
    // instead of quietly fading in behind the overlay while it's still opaque.
    if (grid) grid.classList.add("bento-armed");

    // Align the boot frame exactly over the site's .grid-container border.
    // The grid is a fixed-height box centered in the viewport, so a plain
    // 16px-inset frame won't match top/bottom — we measure the real box instead.
    function positionFrame() {
        if (!grid) return;
        const r = grid.getBoundingClientRect();
        preloader.style.setProperty("--frame-top", r.top + "px");
        preloader.style.setProperty("--frame-left", r.left + "px");
        preloader.style.setProperty("--frame-width", r.width + "px");
        preloader.style.setProperty("--frame-height", r.height + "px");
    }
    positionFrame();
    preloader.classList.add("frame-ready");
    window.addEventListener("resize", positionFrame);

    // Diagonal bento reveal: each card's delay scales with its distance from
    // the top-left corner (x + y), so the grid assembles from top-left toward
    // bottom-right as the boot screen dissolves.
    function revealBento() {
        if (!grid) return;
        const items = grid.children;
        const gridRect = grid.getBoundingClientRect();
        let maxSum = 1;
        const sums = [];
        for (let i = 0; i < items.length; i++) {
            const r = items[i].getBoundingClientRect();
            const sum = (r.left - gridRect.left) + (r.top - gridRect.top);
            sums.push(sum);
            if (sum > maxSum) maxSum = sum;
        }
        for (let i = 0; i < items.length; i++) {
            items[i].style.transitionDelay = Math.round((sums[i] / maxSum) * 460) + "ms";
        }
        // Flip to the revealed state on the next frame so the delays are in
        // effect when the transition kicks off.
        requestAnimationFrame(function () {
            grid.classList.add("bento-reveal");
        });
    }

    const MIN_DURATION = 2200;  // ms — always show the boot screen at least this long
    const MAX_DURATION = 9000;  // ms — safety net so a hung resource can't trap the user
    const startTime = performance.now();

    let loaded = false;
    let finished = false;
    let hideStarted = false;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    let displayed = 0;

    function frame() {
        let target;
        if (finished) {
            target = 100;
        } else {
            const t = Math.min(1, (performance.now() - startTime) / MIN_DURATION);
            target = easeOutCubic(t) * 90;
        }

        displayed += (target - displayed) * 0.09;
        if (target - displayed < 0.05) displayed = target;

        if (fill) fill.style.transform = "scaleX(" + (displayed / 100) + ")";

        if (finished && displayed >= 100) {
            startHide();
            return;
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function startHide() {
        if (hideStarted) return;
        hideStarted = true;

        preloader.classList.add("hide");
        document.body.classList.remove("preloading");
        revealBento();
        try {
            sessionStorage.setItem("preloaded", "1");
        } catch (e) {
            /* private mode / storage disabled — just skip persistence */
        }

        setTimeout(function () {
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 700);
    }

    function finish() {
        finished = true;
    }

    function maybeFinish() {
        if (!loaded) return;
        const remaining = MIN_DURATION - (performance.now() - startTime);
        setTimeout(finish, Math.max(0, remaining));
    }

    function onLoaded() {
        loaded = true;
        maybeFinish();
    }

    if (document.readyState === "complete") {
        onLoaded();
    } else {
        window.addEventListener("load", onLoaded);
    }

    // Absolute safety net: reveal no matter what.
    setTimeout(finish, MAX_DURATION);
})();
