/**
 * Like-button "attention" pulse.
 *
 * Every so often the idle like-button gives a gentle heartbeat — a small
 * "notice me / like me!" — so the affordance doesn't go unseen. The intent is
 * to *invite*, never to nag, so it deliberately stays quiet whenever a pulse
 * would be unwelcome:
 *
 *   • once the button is already liked (the goal is met — stop asking)
 *   • while the user is hovering or mid-click (don't fight a real interaction)
 *   • when the tab is hidden (no point animating off-screen; saves battery)
 *   • if the user prefers reduced motion (accessibility)
 *
 * Cadence is randomized so it feels alive rather than mechanical.
 */
(function () {
    "use strict";

    const button = document.getElementById("like-button");
    if (!button) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const PULSE_CLASS = "pulsing";
    const PULSE_DURATION = 1300; // keep in sync with the CSS animation (1.3s)
    const MIN_DELAY = 2000; // shortest quiet gap between pulses (ms)
    const MAX_DELAY = 4500; // longest quiet gap between pulses (ms)
    const FIRST_DELAY = 3000; // grace period after load before the first pulse

    let scheduleTimer = null;
    let clearPulseTimer = null;

    const randomDelay = () => MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

    // A pulse is welcome only when the button is idle and asking to be noticed.
    const canPulse = () =>
        !document.hidden &&
        !button.classList.contains("liked") &&
        !button.classList.contains("clicked") &&
        !button.classList.contains(PULSE_CLASS) &&
        !button.matches(":hover");

    function schedule(delay) {
        clearTimeout(scheduleTimer);
        scheduleTimer = setTimeout(pulseOnce, delay == null ? randomDelay() : delay);
    }

    function pulseOnce() {
        if (!canPulse()) return schedule();

        button.classList.add(PULSE_CLASS);

        // Reschedule off a timer rather than `animationend`: a hover can cancel
        // the animation mid-flight (firing `animationcancel`, not `animationend`),
        // which would otherwise stall the loop. This always recovers.
        clearTimeout(clearPulseTimer);
        clearPulseTimer = setTimeout(() => {
            button.classList.remove(PULSE_CLASS);
            schedule();
        }, PULSE_DURATION + 150);
    }

    // A real interaction always wins — drop the pulse the instant it's touched.
    button.addEventListener("mouseenter", () => button.classList.remove(PULSE_CLASS));
    button.addEventListener("pointerdown", () => button.classList.remove(PULSE_CLASS));

    // Go quiet while the tab is hidden; re-sync cadence on return.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearTimeout(scheduleTimer);
        } else {
            schedule();
        }
    });

    // Honor reduced-motion if it's toggled on after load.
    const onMotionChange = (event) => {
        if (event.matches) {
            clearTimeout(scheduleTimer);
            clearTimeout(clearPulseTimer);
            button.classList.remove(PULSE_CLASS);
        } else {
            schedule();
        }
    };
    if (reduceMotion.addEventListener) {
        reduceMotion.addEventListener("change", onMotionChange);
    } else if (reduceMotion.addListener) {
        reduceMotion.addListener(onMotionChange); // Safari < 14 fallback
    }

    schedule(FIRST_DELAY);
})();
