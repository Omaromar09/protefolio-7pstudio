import * as THREE from 'three';

/**
 * ==========================================================================
 * 7P STUDIO — LUXURY LIQUID CHROME & PRISMATIC CRYSTAL (HERO 3D)
 * Dynamic, fluid, high-end metallic iridescent centerpiece
 * Radiant & gorgeous in both Dark Mode (Cosmic Neon Chrome) & Light Mode (Platinum Crystal)
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

    // Cinematic perspective camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.z = isMobile ? 6.2 : 5.4;

    // WebGL Renderer with High-DPI and ACES Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Rich 4-Point Studio Lighting
    this.setupLighting();

    // 3D Objects Setup
    this.createSculpture(isMobile);
    this.createGyroRings(isMobile);
    this.createStardustNebula(isMobile);

    // Apply colors for initial theme
    this.applyTheme(this.currentTheme);

    // Bind event handlers
    this.bindEvents();

    // Intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.canvas);

    this.animate();
  }

  setupLighting() {
    // 1. Balanced Ambient Base
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(this.ambientLight);

    // 2. Main Key Directional Light (Electric Magenta)
    this.dirLight1 = new THREE.DirectionalLight(0xE02BFB, 3.8);
    this.dirLight1.position.set(5, 4, 4);
    this.scene.add(this.dirLight1);

    // 3. Secondary Fill Directional Light (Cyber Cyan)
    this.dirLight2 = new THREE.DirectionalLight(0x00F0FF, 3.2);
    this.dirLight2.position.set(-5, -3, 4);
    this.scene.add(this.dirLight2);

    // 4. Back Rim Directional Light (Royal Cosmic Violet)
    this.dirLight3 = new THREE.DirectionalLight(0x7C3AED, 3.5);
    this.dirLight3.position.set(0, 5, -4);
    this.scene.add(this.dirLight3);

    // 5. Dynamic Orbiting Specular Point Light (Creates shimmering glints on curves)
    this.specularLight = new THREE.PointLight(0xFFFFFF, 4.0, 20);
    this.specularLight.position.set(0, 0, 4);
    this.scene.add(this.specularLight);
  }

  createSculpture(isMobile) {
    this.group = new THREE.Group();

    // 1. Primary Hero: Ultra-Smooth Liquid Chrome Möbius Knot (NO WIREFRAME CAGE)
    const tubularSegments = isMobile ? 96 : 160;
    const radialSegments = isMobile ? 24 : 36;
    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.32, tubularSegments, radialSegments, 2, 3);

    // High-End Liquid Metallic Material with deep reflections
    this.sculptureMat = new THREE.MeshStandardMaterial({
      color: 0x4C1D95, // Rich royal violet
      emissive: 0x2E1065,
      emissiveIntensity: 0.25,
      roughness: 0.12,
      metalness: 0.88
    });

    this.sculpture = new THREE.Mesh(knotGeo, this.sculptureMat);
    this.group.add(this.sculpture);

    // 2. Inner Floating Core: Luminous Faceted Diamond Octahedron
    const coreGeo = new THREE.OctahedronGeometry(0.65, 0);
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x00F0FF,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.85,
      flatShading: true
    });

    this.core = new THREE.Mesh(coreGeo, this.coreMat);
    this.group.add(this.core);

    // 3. Floating Orbiting Micro-Diamonds
    this.orbiters = new THREE.Group();
    const orbiterCount = isMobile ? 3 : 5;
    this.orbiterMeshes = [];
    const orbGeo = new THREE.OctahedronGeometry(0.11, 0);
    const orbColors = [0xE02BFB, 0x00F0FF, 0x7C3AED, 0x38BDF8, 0xF472B6];

    for (let i = 0; i < orbiterCount; i++) {
      const orbMat = new THREE.MeshStandardMaterial({
        color: orbColors[i % orbColors.length],
        emissive: orbColors[i % orbColors.length],
        emissiveIntensity: 0.75,
        roughness: 0.1,
        metalness: 0.9,
        flatShading: true
      });
      const mesh = new THREE.Mesh(orbGeo, orbMat);
      const angle = (i / orbiterCount) * Math.PI * 2;
      const dist = 2.15 + (i % 2) * 0.3;
      mesh.position.set(Math.cos(angle) * dist, Math.sin(angle * 2) * 0.4, Math.sin(angle) * dist);
      mesh.userData = { angle, dist, speed: 0.6 + i * 0.15 };
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
      // Razor-thin, glowing precision halo ring
      const ringGeo = new THREE.TorusGeometry(rad, 0.007, 12, isMobile ? 48 : 84);
      const ringMat = new THREE.MeshStandardMaterial({
        color: idx === 0 ? 0xE02BFB : 0x00F0FF,
        emissive: idx === 0 ? 0xE02BFB : 0x00F0FF,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.95,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = (Math.PI / 3) * (idx + 1);
      ringMesh.rotation.y = (Math.PI / 4) * (idx + 1);
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

  applyTheme(theme) {
    this.currentTheme = theme;
    const isDark = theme === 'dark';

    if (isDark) {
      // DARK MODE: Deep Cosmic Chrome with vibrant Violet/Magenta sheen & Cyan reflections
      if (this.sculptureMat) {
        this.sculptureMat.color.setHex(0x581C87); // Deep royal violet
        this.sculptureMat.emissive.setHex(0x3B0764);
        this.sculptureMat.emissiveIntensity = 0.28;
        this.sculptureMat.roughness = 0.12;
        this.sculptureMat.metalness = 0.88;
      }
      if (this.coreMat) {
        this.coreMat.color.setHex(0x00F0FF);
        this.coreMat.emissive.setHex(0x00F0FF);
        this.coreMat.emissiveIntensity = 0.85;
      }
      if (this.ambientLight) this.ambientLight.intensity = 1.3;
      if (this.dirLight1) {
        this.dirLight1.color.setHex(0xE02BFB);
        this.dirLight1.intensity = 4.2;
      }
      if (this.dirLight2) {
        this.dirLight2.color.setHex(0x00F0FF);
        this.dirLight2.intensity = 3.6;
      }
      if (this.dirLight3) {
        this.dirLight3.color.setHex(0x7C3AED);
        this.dirLight3.intensity = 3.8;
      }
      if (this.specularLight) {
        this.specularLight.color.setHex(0xFFFFFF);
        this.specularLight.intensity = 4.0;
      }
    } else {
      // LIGHT MODE: Crisp Platinum & Rose Gold Chrome (Luminous, Prestigious, Bright)
      if (this.sculptureMat) {
        this.sculptureMat.color.setHex(0xE0E7FF); // Bright platinum silver-violet
        this.sculptureMat.emissive.setHex(0x6366F1);
        this.sculptureMat.emissiveIntensity = 0.18;
        this.sculptureMat.roughness = 0.15;
        this.sculptureMat.metalness = 0.82;
      }
      if (this.coreMat) {
        this.coreMat.color.setHex(0x7C3AED);
        this.coreMat.emissive.setHex(0x7C3AED);
        this.coreMat.emissiveIntensity = 0.70;
      }
      if (this.ambientLight) this.ambientLight.intensity = 2.0;
      if (this.dirLight1) {
        this.dirLight1.color.setHex(0x7C3AED);
        this.dirLight1.intensity = 3.5;
      }
      if (this.dirLight2) {
        this.dirLight2.color.setHex(0x0EA5E9);
        this.dirLight2.intensity = 3.0;
      }
      if (this.dirLight3) {
        this.dirLight3.color.setHex(0xE02BFB);
        this.dirLight3.intensity = 2.6;
      }
      if (this.specularLight) {
        this.specularLight.color.setHex(0xFFFFFF);
        this.specularLight.intensity = 5.0;
      }
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Touch and drag support with smooth inertia
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
        this.applyTheme(e.detail.theme);
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

    // Mouse follow with spring damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.rotationVelocity.x *= 0.94;
    this.rotationVelocity.y *= 0.94;

    this.group.rotation.x += this.rotationVelocity.x;
    this.group.rotation.y += this.rotationVelocity.y;

    // Smooth continuous liquid rotation
    const scrollSpin = this.scrollProgress * 2.2;
    this.sculpture.rotation.y = time * 0.28 + scrollSpin + this.mouse.x * 0.35;
    this.sculpture.rotation.x = time * 0.16 + this.mouse.y * 0.35;

    // Counter-rotating Inner Core with subtle pulse
    this.core.rotation.y = -time * 0.55;
    this.core.rotation.z = time * 0.35;
    const pulse = 1 + Math.sin(time * 2.4) * 0.04;
    this.core.scale.set(pulse, pulse, pulse);

    // Gyroscope rings rotation
    this.rings.forEach((ring, idx) => {
      ring.rotation.z += (0.16 + idx * 0.12) * delta;
      ring.rotation.y += (0.12 - idx * 0.08) * delta;
    });

    // Orbiting micro-diamonds
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

    // Stardust subtle nebula drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.05;
      this.particles.rotation.x = Math.sin(time * 0.04) * 0.08;
    }

    // Natural breathing float
    this.group.position.y = Math.sin(time * 1.5) * 0.10;

    // Orbital specular light movement around the knot for gleaming liquid highlights
    if (this.specularLight) {
      this.specularLight.position.x = Math.sin(time * 1.2) * 3.5;
      this.specularLight.position.y = Math.cos(time * 0.9) * 3.0;
      this.specularLight.position.z = 3.5 + Math.sin(time * 0.5) * 1.0;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
