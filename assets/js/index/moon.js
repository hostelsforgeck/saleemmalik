// ===== GLOBAL MOON CONTROLS =====
const MOON_CONFIG = {
  rotationSpeed: 0.002,    // Rotation speed (higher = faster)
  autoRotate: true,        // Enable/disable auto rotation
  size: 5,                 // Moon radius
  lightIntensity: 1.2,     // Light brightness
  sphereDetail: 22         // Geometry detail (lower = better performance)
};

// Preload texture immediately (before DOMContentLoaded)
const moonTexture = new Image();
moonTexture.src = 'assets/img/moon/moon.webp';

document.addEventListener("DOMContentLoaded", function() {
  new class {
    constructor(c) {
      this.c = c;
      this.textureLoaded = false;
      this.clock = new THREE.Clock(); // For smooth animation
      this.lastTime = 0;
      
      // Start initialization immediately
      this.init();
      
      // Load texture with cached image
      this.loadTexture();
    }
    
    init() {
      // Setup scene
      this.s = new THREE.Scene();
      
      // Setup light
      this.l = new THREE.PointLight(0xffffff, 0);
      this.l.position.set(-30, 10, 30);
      this.l.castShadow = true;
      this.s.add(this.l);
      
      // Animate light
      TweenMax.to(this.l, 1, {intensity: MOON_CONFIG.lightIntensity, delay: 0.5});
      
      this.initCamera();
      this.initRenderer();
      this.createCanvas();
      
      // Start render loop immediately
      this.render();
      
      // Setup events
      window.addEventListener("resize", () => this.onResize(), false);
      this.c.addEventListener("mousemove", e => this.onMouse(e));
      
      this.auto();
    }
    
    loadTexture() {
      const loader = new THREE.TextureLoader();
      
      // Use preloaded image if available
      if (moonTexture.complete) {
        this.createSphere(loader.load(moonTexture.src));
      } else {
        moonTexture.onload = () => {
          this.createSphere(loader.load(moonTexture.src));
        };
      }
    }
    
    createSphere(texture) {
      // Create geometry (lower poly for faster initial load)
      const g = new THREE.SphereGeometry(
        MOON_CONFIG.size, 
        MOON_CONFIG.sphereDetail, 
        MOON_CONFIG.sphereDetail
      );
      
      // Create material
      const m = new THREE.MeshPhongMaterial({
        color: 0xB2B2B2,
        normalMap: texture,
        shininess: 0
      });
      
      // Create mesh
      this.o = new THREE.Mesh(g, m);
      this.o.rotation.z = 0.5;
      this.s.add(this.o);
      
      this.textureLoaded = true;
    }
    
    auto() {
      // Auto rotation is now handled in render() with delta time
      // This method kept for backwards compatibility
    }
    
    onMouse(e) {
      const r = this.c.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const n = 2 * (x / this.c.offsetWidth) - 1;
      const t = 2 * (y / this.c.offsetHeight) - 1;
      
      this.l.position.x = 30 * n;
      this.l.position.y = -15 * t;
    }
    
    createCanvas() {
      this.c.appendChild(this.r.domElement);
    }
    
    initRenderer() {
      this.r = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance" // GPU optimization
      });
      this.r.setClearColor(0, 0);
      this.r.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit to 2x for performance
      this.r.setSize(this.c.offsetWidth, this.c.offsetHeight);
    }
    
    initCamera() {
      this.m = new THREE.PerspectiveCamera(
        45,
        this.c.offsetWidth / this.c.offsetHeight,
        1,
        1000
      );
      this.m.position.z = 20;
      this.m.position.y = 0;
    }
    
    render() {
      // Get delta time for smooth, frame-rate independent animation
      const delta = this.clock.getDelta();
      
      this.r.render(this.s, this.m);
      
      if (this.o && MOON_CONFIG.autoRotate) {
        // Multiply by delta for consistent speed regardless of FPS
        this.o.rotation.y += MOON_CONFIG.rotationSpeed * delta * 60;
      }
      
      requestAnimationFrame(() => this.render());
    }
    
    onResize() {
      this.m.aspect = this.c.offsetWidth / this.c.offsetHeight;
      this.m.updateProjectionMatrix();
      this.r.setSize(this.c.offsetWidth, this.c.offsetHeight);
    }
  }(document.getElementById("moon-canvas"));
});