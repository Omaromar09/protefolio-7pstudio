import * as THREE from 'three';

/**
 * ==========================================================================
 * 7P STUDIO — LUXURY INTERACTIVE 3D CENTERPIECE (HERO SECTION)
 * Crystalline Iridescent Quantum Prism & Gyroscope
 * Adapts dynamically between Dark Mode (Obsidian Crystal) & Light Mode (Diamond Glass)
 * ==========================================================================
 */
export class HeroScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0, y: 0 };
    this.isVisible = true;

    this.currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

    this.init();
  }

  init() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = Math.min(rect.width || window.innerWidth, window.innerWidth);
    const height = rect.height || 420;
    const isMobile = window.innerWidth < 768;

    // Camera with cinematic field of view
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.z = isMobile ? 6.5 : 5.8;

    // High precision WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // Dynamic Multi-Point Cinematic Lighting
    this.setupLighting();

    // 3D Objects Setup
    this.createSculpture(isMobile);
    this.createGyroRings(isMobile);
    this.createStardustNebula(isMobile);

    // Apply initial theme colors
    this.applyThemeStyles(this.currentTheme);

    // Event listeners
    this.bindEvents();

    // Intersection observer for zero CPU/GPU overhead when offscreen
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.canvas);

    this.animate();
  }

  setupLighting() {
    // Soft ambient illumination
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(this.ambientLight);

    // Key Light (Electric Neon Magenta)
    this.keyLight = new THREE.PointLight(0xE02BFB, 5.0, 30);
    this.keyLight.position.set(4, 3, 3);
    this.scene.add(this.keyLight);

    // Fill Light (Radiant Cyber Cyan)
    this.fillLight = new THREE.PointLight(0x00F0FF, 4.5, 30);
    this.fillLight.position.set(-4, -2, 3);
    this.scene.add(this.fillLight);

    // Rim Light (Cosmic Royal Violet)
    this.rimLight = new THREE.PointLight(0x7C3AED, 4.0, 25);
    this.rimLight.position.set(0, 4, -3);
    this.scene.add(this.rimLight);

    // Bottom Specular Accent Light
    this.accentLight = new THREE.PointLight(0xFFFFFF, 2.5, 20);
    this.accentLight.position.set(0, -4, 2);
    this.scene.add(this.accentLight);
  }

  createSculpture(isMobile) {
    this.group = new THREE.Group();

    // 1. Primary Outer Element: Smooth Fluid Infinity Torus Knot (Silky smooth, NO wireframe)
    const tubularSegments = isMobile ? 80 : 140;
    const radialSegments = isMobile ? 22 : 32;
    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.30, tubularSegments, radialSegments, 2, 3);

    // Luxury Optical Material with Refraction, Clearcoat & Iridescence
    this.knotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1A142E,
      emissive: 0x2A1248,
      emissiveIntensity: 0.28,
      roughness: 0.08,
      metalness: 0.22,
      transmission: 0.62,
      thickness: 1.4,
      ior: 1.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      iridescence: 0.88,
      iridescenceIOR: 1.55,
      transparent: true,
      opacity: 0.95
    });

    this.knot = new THREE.Mesh(knotGeo, this.knotMaterial);
    this.group.add(this.knot);

    // 2. Inner Floating Core: Faceted Brilliant-Cut Diamond Gem
    const gemGeo = new THREE.OctahedronGeometry(0.72, 0);
    this.gemMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x070B1E,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.65,
      roughness: 0.05,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      flatShading: true
    });

    this.gem = new THREE.Mesh(gemGeo, this.gemMaterial);
    this.group.add(this.gem);

    // 3. Floating Micro-Gem Orbiters
    this.orbiters = new THREE.Group();
    const orbiterCount = isMobile ? 3 : 5;
    this.orbiterMeshes = [];
    const orbiterGeo = new THREE.OctahedronGeometry(0.09, 0);

    const orbiterColors = [0xE02BFB, 0x00F0FF, 0x7C3AED, 0x38BDF8, 0xF472B6];

    for (let i = 0; i < orbiterCount; i++) {
      const orbiterMat = new THREE.MeshPhysicalMaterial({
        color: orbiterColors[i % orbiterColors.length],
        emissive: orbiterColors[i % orbiterColors.length],
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
        flatShading: true
      });
      const mesh = new THREE.Mesh(orbiterGeo, orbiterMat);
      const angle = (i / orbiterCount) * Math.PI * 2;
      const dist = 2.0 + (i % 2) * 0.35;
      mesh.position.set(Math.cos(angle) * dist, Math.sin(angle * 2) * 0.4, Math.sin(angle) * dist);
      mesh.userData = { angle, dist, speed: 0.6 + i * 0.18 };
      this.orbiters.add(mesh);
      this.orbiterMeshes.push(mesh);
    }
    this.group.add(this.orbiters);

    this.scene.add(this.group);
  }

  createGyroRings(isMobile) {
    this.rings = [];
    const ringRadii = [1.95, 2.35];

    ringRadii.forEach((rad, idx) => {
      // Ultra-thin, razor-sharp precision ring
      const ringGeo = new THREE.TorusGeometry(rad, 0.007, 12, isMobile ? 48 : 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color: idx === 0 ? 0xE02BFB : 0x00F0FF,
        emissive: idx === 0 ? 0xE02BFB : 0x00F0FF,
        emissiveIntensity: 0.55,
        roughness: 0.15,
        metalness: 0.92,
        transparent: true,
        opacity: 0.75
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3 * (idx + 1);
      ringMesh.rotation.y = Math.PI / 4 * (idx + 1);
      this.group.add(ringMesh);
      this.rings.push(ringMesh);
    });
  }

  createStardustNebula(isMobile) {
    const count = isMobile ? 35 : 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cMagenta = new THREE.Color(0xE02BFB);
    const cViolet = new THREE.Color(0x7C3AED);
    const cCyan = new THREE.Color(0x00F0FF);
    const cWhite = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < count; i++) {
      const radius = 1.7 + Math.random() * 2.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const rnd = Math.random();
      const chosenColor = rnd > 0.7 ? cMagenta : (rnd > 0.4 ? cCyan : (rnd > 0.2 ? cViolet : cWhite));
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.045 : 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  applyThemeStyles(theme) {
    this.currentTheme = theme;
    const isDark = theme === 'dark';

    if (isDark) {
      // Dark Mode: Rich Cosmic Obsidian Chrome with Vibrant Neon Iridescence
      if (this.knotMaterial) {
        this.knotMaterial.color.setHex(0x24143D);
        this.knotMaterial.emissive.setHex(0x4C1D95);
        this.knotMaterial.emissiveIntensity = 0.24;
        this.knotMaterial.roughness = 0.10;
        this.knotMaterial.metalness = 0.42;
        this.knotMaterial.transmission = 0.40;
        this.knotMaterial.clearcoat = 1.0;
        this.knotMaterial.clearcoatRoughness = 0.04;
        this.knotMaterial.iridescence = 0.95;
        this.knotMaterial.iridescenceIOR = 1.65;
        this.knotMaterial.opacity = 0.96;
      }
      if (this.gemMaterial) {
        this.gemMaterial.color.setHex(0x0F172A);
        this.gemMaterial.emissive.setHex(0x00F0FF);
        this.gemMaterial.emissiveIntensity = 0.75;
        this.gemMaterial.metalness = 0.85;
      }
      if (this.ambientLight) this.ambientLight.intensity = 1.4;
      if (this.keyLight) {
        this.keyLight.color.setHex(0xE02BFB);
        this.keyLight.intensity = 6.2;
      }
      if (this.fillLight) {
        this.fillLight.color.setHex(0x00F0FF);
        this.fillLight.intensity = 5.5;
      }
      if (this.rimLight) {
        this.rimLight.color.setHex(0x8B5CF6);
        this.rimLight.intensity = 4.8;
      }
    } else {
      // Light Mode: Pure Optical Prismatic Diamond Glass (Clean, Prestigious, Bright)
      if (this.knotMaterial) {
        this.knotMaterial.color.setHex(0xFFFFFF);
        this.knotMaterial.emissive.setHex(0x7C3AED);
        this.knotMaterial.emissiveIntensity = 0.12;
        this.knotMaterial.roughness = 0.05;
        this.knotMaterial.metalness = 0.08;
        this.knotMaterial.transmission = 0.84;
        this.knotMaterial.iridescence = 0.65;
        this.knotMaterial.opacity = 0.98;
      }
      if (this.gemMaterial) {
        this.gemMaterial.color.setHex(0xEDE9FE);
        this.gemMaterial.emissive.setHex(0x6366F1);
        this.gemMaterial.emissiveIntensity = 0.45;
        this.gemMaterial.metalness = 0.35;
      }
      if (this.ambientLight) this.ambientLight.intensity = 2.0;
      if (this.keyLight) {
        this.keyLight.color.setHex(0x7C3AED);
        this.keyLight.intensity = 3.6;
      }
      if (this.fillLight) {
        this.fillLight.color.setHex(0x0EA5E9);
        this.fillLight.intensity = 3.2;
      }
      if (this.rimLight) {
        this.rimLight.color.setHex(0xE02BFB);
        this.rimLight.intensity = 2.5;
      }
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Touch and drag support for the 3D canvas with spring physics
    const onPointerDown = (e) => {
      this.isDragging = true;
      this.previousMousePosition = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0
      };
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.rotationVelocity.y += deltaX * 0.004;
      this.rotationVelocity.x += deltaY * 0.004;

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Dynamic Theme Listener
    window.addEventListener('themechange', (e) => {
      if (e.detail && e.detail.theme) {
        this.applyThemeStyles(e.detail.theme);
      }
    });

    window.addEventListener('resize', () => this.onResize());
  }

  setScroll(progress) {
    this.scrollProgress = progress;
  }

  onResize() {
    if (!this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = Math.min(rect.width || window.innerWidth, window.innerWidth);
    const height = rect.height || 420;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isVisible || document.hidden) return;

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth inertia interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.rotationVelocity.x *= 0.94;
    this.rotationVelocity.y *= 0.94;

    this.group.rotation.x += this.rotationVelocity.x;
    this.group.rotation.y += this.rotationVelocity.y;

    // Elegant continuous rotations
    const scrollSpin = this.scrollProgress * 2.2;
    this.knot.rotation.y = time * 0.28 + scrollSpin + this.mouse.x * 0.35;
    this.knot.rotation.x = time * 0.16 + this.mouse.y * 0.35;

    // Inner Gem counter-rotation with gentle pulse
    this.gem.rotation.y = -time * 0.55;
    this.gem.rotation.z = time * 0.35;
    const pulse = 1 + Math.sin(time * 2.5) * 0.04;
    this.gem.scale.set(pulse, pulse, pulse);

    // Gyroscope rings rotation
    this.rings.forEach((ring, idx) => {
      ring.rotation.z += (0.16 + idx * 0.12) * delta;
      ring.rotation.y += (0.12 - idx * 0.08) * delta;
    });

    // Orbiting micro-gems
    this.orbiterMeshes.forEach((mesh) => {
      mesh.userData.angle += mesh.userData.speed * delta;
      const angle = mesh.userData.angle;
      const dist = mesh.userData.dist;
      mesh.position.x = Math.cos(angle) * dist;
      mesh.position.z = Math.sin(angle) * dist;
      mesh.position.y = Math.sin(angle * 2 + time * 1.5) * 0.35;
      mesh.rotation.x += 1.8 * delta;
      mesh.rotation.y += 1.8 * delta;
    });

    // Stardust subtle celestial drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.05;
      this.particles.rotation.x = Math.sin(time * 0.04) * 0.08;
    }

    // Natural breathing levitation
    this.group.position.y = Math.sin(time * 1.6) * 0.10;

    // Dynamic orbital lights movement for rich specular highlights
    if (this.keyLight) {
      this.keyLight.position.x = Math.sin(time * 0.8) * 4.2;
      this.keyLight.position.y = Math.cos(time * 0.6) * 3.2;
    }
    if (this.fillLight) {
      this.fillLight.position.x = -Math.sin(time * 0.7) * 4.2;
      this.fillLight.position.z = Math.cos(time * 0.7) * 4.2;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
