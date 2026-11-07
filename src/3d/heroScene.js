import * as THREE from 'three';

/**
 * ==========================================================================
 * 7P STUDIO — AWARD-WINNING HYPER-LUXURY 3D CENTERPIECE (HERO 3D)
 * Tier-1 Awwwards-Grade Prismatic Chrome & Optical Crystal Artifact
 * 
 * Architecture:
 *   1. Primary Sculpture: Liquid Iridescent Chrome Möbius Ribbon (Ultra-high density, fluid reflections)
 *   2. Secondary Intertwined Halo: Counter-weaving Prismatic Crystal Ring (Interlocking depth)
 *   3. Inner Core: Refractive Brilliant-Cut Diamond Prism (Optical glass transmission & dispersion)
 *   4. Heart: Pulsating Photonic Singularity (Dynamic volumetric illumination through diamond facets)
 *   5. Kinetic Chrono-Gimbal: Non-intersecting outer aerospace titanium & neon laser track
 *   6. Satellites: Tumble-orbiting micro-gem crystals & depth-of-field stardust nebula
 *   7. Procedural Studio HDRI: High-contrast neon & softbox studio reflection environment
 *   8. Physics: Inertial velocity drag, momentum throw, and spring-damped cursor parallax
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
    const parent = this.canvas.parentElement;
    const rect = parent ? parent.getBoundingClientRect() : { width: window.innerWidth, height: 420 };
    const width = Math.min(rect.width || window.innerWidth, window.innerWidth);
    const height = rect.height || 420;
    const isMobile = window.innerWidth < 768;

    // 1. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0, isMobile ? 6.2 : 5.4);

    // 2. High-Performance WebGL Renderer with ACES Filmic Tone Mapping
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 3. Generate Procedural Studio HDRI Environment for Liquid Chrome Reflections
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();
    this.updateEnvironmentMap(this.currentTheme === 'dark');

    // 4. Studio Lighting Rig
    this.setupLighting();

    // 5. Build 3D Kinetic Masterpiece Components
    this.createSculpture(isMobile);
    this.createGimbalRings(isMobile);
    this.createSatellites(isMobile);
    this.createStardustNebula(isMobile);

    // 6. Apply Initial Theme Colors
    this.applyTheme(this.currentTheme);

    // 7. Interactive Event Bindings
    this.bindEvents();

    // 8. Visibility Observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.canvas);

    // 9. Start Render Loop
    this.animate();
  }

  /**
   * Generates a custom procedural Studio HDRI equirectangular canvas texture.
   * Creates sweeping neon and white softboxes for high-end automotive/jewelry reflections.
   */
  updateEnvironmentMap(isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (isDark) {
      // Cosmic Obsidian & Deep Violet Base
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
      bgGrad.addColorStop(0, '#150d2e');
      bgGrad.addColorStop(0.5, '#090514');
      bgGrad.addColorStop(1, '#040208');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Softbox 1: Electric Magenta Key (Top-Left)
      const g1 = ctx.createRadialGradient(260, 150, 10, 260, 150, 250);
      g1.addColorStop(0, 'rgba(255, 46, 230, 1.0)');
      g1.addColorStop(0.35, 'rgba(224, 43, 251, 0.85)');
      g1.addColorStop(0.70, 'rgba(124, 58, 237, 0.35)');
      g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(260, 150, 250, 0, Math.PI * 2);
      ctx.fill();

      // Softbox 2: Radiant Cyber Cyan Fill (Bottom-Right)
      const g2 = ctx.createRadialGradient(780, 320, 10, 780, 320, 260);
      g2.addColorStop(0, 'rgba(0, 240, 255, 1.0)');
      g2.addColorStop(0.35, 'rgba(14, 165, 233, 0.85)');
      g2.addColorStop(0.70, 'rgba(30, 58, 138, 0.3)');
      g2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(780, 320, 260, 0, Math.PI * 2);
      ctx.fill();

      // Softbox 3: Ultra-Crisp White Razor Overhead Strip (Gleaming Metallic Edge Glints)
      const g3 = ctx.createLinearGradient(480, 0, 540, 0);
      g3.addColorStop(0, 'rgba(255, 255, 255, 0)');
      g3.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
      g3.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(480, 20, 60, 220);

      // Softbox 4: Royal Purple Horizon Rim
      const g4 = ctx.createLinearGradient(0, 240, 140, 240);
      g4.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
      g4.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g4;
      ctx.fillRect(0, 120, 140, 260);
    } else {
      // Light Mode: Luxury Platinum, Pure White & Prismatic Rose Gold Studio
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.5, '#f1f5f9');
      bgGrad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Vibrant Purple-Magenta Keylight
      const g1 = ctx.createRadialGradient(280, 160, 10, 280, 160, 240);
      g1.addColorStop(0, 'rgba(168, 85, 247, 0.95)');
      g1.addColorStop(0.45, 'rgba(217, 70, 239, 0.65)');
      g1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(280, 160, 240, 0, Math.PI * 2);
      ctx.fill();

      // Deep Azure / Sky Cyan Softbox
      const g2 = ctx.createRadialGradient(760, 320, 10, 760, 320, 260);
      g2.addColorStop(0, 'rgba(2, 132, 199, 0.90)');
      g2.addColorStop(0.5, 'rgba(59, 130, 246, 0.50)');
      g2.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(760, 320, 260, 0, Math.PI * 2);
      ctx.fill();

      // Overhead White Key Strip
      const g3 = ctx.createLinearGradient(460, 0, 560, 0);
      g3.addColorStop(0, 'rgba(255, 255, 255, 0)');
      g3.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
      g3.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(460, 10, 100, 240);
    }

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.mapping = THREE.EquirectangularReflectionMapping;

    if (this.currentEnvTarget) {
      this.currentEnvTarget.dispose();
    }
    this.currentEnvTarget = this.pmremGenerator.fromEquirectangular(canvasTexture);
    this.scene.environment = this.currentEnvTarget.texture;
    canvasTexture.dispose();
  }

  setupLighting() {
    // 1. Balanced Ambient Base
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(this.ambientLight);

    // 2. Main Key Directional Light (Electric Magenta)
    this.dirLight1 = new THREE.DirectionalLight(0xE02BFB, 4.6);
    this.dirLight1.position.set(5, 4.5, 4.5);
    this.scene.add(this.dirLight1);

    // 3. Secondary Fill Directional Light (Cyber Cyan)
    this.dirLight2 = new THREE.DirectionalLight(0x00F0FF, 4.2);
    this.dirLight2.position.set(-5, -3.5, 4);
    this.scene.add(this.dirLight2);

    // 4. Back Rim Directional Light (Royal Cosmic Violet)
    this.dirLight3 = new THREE.DirectionalLight(0x7C3AED, 4.2);
    this.dirLight3.position.set(0, 5, -4.5);
    this.scene.add(this.dirLight3);

    // 5. Dynamic Orbiting Specular Point Light (Creates shimmering glints on curves)
    this.specularLight = new THREE.PointLight(0xFFFFFF, 5.5, 25);
    this.specularLight.position.set(0, 0, 4);
    this.scene.add(this.specularLight);
  }

  createSculpture(isMobile) {
    this.group = new THREE.Group();

    // 1. PRIMARY HERO SCULPTURE: Liquid Chrome Möbius Ribbon
    // Smooth geometric curve with high subdivision for fluid continuous specular reflections
    const tubularSegments = isMobile ? 180 : 280;
    const radialSegments = isMobile ? 32 : 48;
    const knotGeo = new THREE.TorusKnotGeometry(1.10, 0.27, tubularSegments, radialSegments, 2, 3);

    // State-of-the-Art MeshPhysicalMaterial with Thin-Film Iridescence & Clearcoat
    this.sculptureMat = new THREE.MeshPhysicalMaterial({
      color: 0x7C3AED, // Rich royal purple-amethyst base
      emissive: 0x3B0764,
      emissiveIntensity: 0.22,
      metalness: 0.94,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      iridescence: 0.96,
      iridescenceIOR: 1.60,
      iridescenceThicknessRange: [140, 540],
      reflectivity: 1.0,
      envMapIntensity: 2.6
    });

    this.sculpture = new THREE.Mesh(knotGeo, this.sculptureMat);
    this.group.add(this.sculpture);

    // 2. INNER FLOATING CORE: Refractive Optical Crystal Diamond (Prismatic Facets)
    const diamondGeo = new THREE.IcosahedronGeometry(0.55, 0);
    this.coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.45,
      metalness: 0.05,
      roughness: 0.02,
      transmission: 0.95,
      ior: 1.76,
      thickness: 1.6,
      attenuationColor: 0x00F0FF,
      attenuationDistance: 0.7,
      transparent: true,
      opacity: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      flatShading: true,
      envMapIntensity: 2.6
    });

    this.core = new THREE.Mesh(diamondGeo, this.coreMat);
    this.group.add(this.core);

    // 3. PHOTONIC SINGULARITY: High-Energy Pulsating Core Light inside the crystal
    const singularityGeo = new THREE.SphereGeometry(0.18, 16, 16);
    this.singularityMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
      transparent: true,
      opacity: 0.95
    });
    this.singularity = new THREE.Mesh(singularityGeo, this.singularityMat);
    this.core.add(this.singularity);

    // Internal Point Light casting colored refraction outwards through the diamond facets
    this.coreInnerLight = new THREE.PointLight(0x00F0FF, 3.8, 5);
    this.core.add(this.coreInnerLight);

    this.scene.add(this.group);
  }

  createGimbalRings(isMobile) {
    this.rings = [];

    // Clean, Non-Intersecting Equatorial Chrono-Gimbal Ring (Frames the artifact from outside)
    // Tilted elegantly at 28 degrees, positioned outside the 1.38 sculpture boundary (radius: 2.22)
    const ringGeo = new THREE.TorusGeometry(2.22, 0.016, 16, isMobile ? 64 : 128);
    this.ringMat1 = new THREE.MeshPhysicalMaterial({
      color: 0x00F0FF,
      emissive: 0x00F0FF,
      emissiveIntensity: 0.55,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
      envMapIntensity: 2.2
    });

    const ringMesh = new THREE.Mesh(ringGeo, this.ringMat1);
    ringMesh.rotation.x = Math.PI * 0.42;
    ringMesh.rotation.y = Math.PI * 0.12;
    ringMesh.userData = { speed: 0.14 };
    this.group.add(ringMesh);
    this.rings.push(ringMesh);

    // Secondary subtle concentric halo orbit
    const outerHaloGeo = new THREE.TorusGeometry(2.45, 0.007, 12, isMobile ? 48 : 96);
    this.ringMat2 = new THREE.MeshPhysicalMaterial({
      color: 0xE02BFB,
      emissive: 0xE02BFB,
      emissiveIntensity: 0.45,
      metalness: 0.95,
      roughness: 0.10,
      transparent: true,
      opacity: 0.65,
      envMapIntensity: 2.0
    });
    const outerHalo = new THREE.Mesh(outerHaloGeo, this.ringMat2);
    outerHalo.rotation.x = Math.PI * 0.38;
    outerHalo.rotation.y = -Math.PI * 0.15;
    outerHalo.userData = { speed: -0.10 };
    this.group.add(outerHalo);
    this.rings.push(outerHalo);
  }

  createSatellites(isMobile) {
    this.satellites = new THREE.Group();
    const count = isMobile ? 3 : 5;
    this.satelliteMeshes = [];
    const satColors = [0xE02BFB, 0x00F0FF, 0x7C3AED, 0x38BDF8, 0xF472B6];

    for (let i = 0; i < count; i++) {
      const geo = (i % 2 === 0) ? new THREE.OctahedronGeometry(0.085, 0) : new THREE.TetrahedronGeometry(0.095, 0);
      const color = satColors[i % satColors.length];

      const mat = new THREE.MeshPhysicalMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.75,
        metalness: 0.92,
        roughness: 0.06,
        clearcoat: 1.0,
        flatShading: true,
        envMapIntensity: 2.2
      });

      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / count) * Math.PI * 2;
      const dist = 2.15 + (i % 2) * 0.35;
      mesh.position.set(Math.cos(angle) * dist, Math.sin(angle * 2) * 0.40, Math.sin(angle) * dist);
      mesh.userData = {
        angle,
        dist,
        speed: 0.48 + i * 0.10,
        rotSpeed: 1.4 + i * 0.25
      };

      this.satellites.add(mesh);
      this.satelliteMeshes.push(mesh);
    }

    this.group.add(this.satellites);
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

    // Update procedural environment map
    this.updateEnvironmentMap(isDark);

    if (isDark) {
      // DARK MODE: Ultra-Gloss Liquid Violet-Amethyst Chrome with Prismatic Sheen
      if (this.sculptureMat) {
        this.sculptureMat.color.setHex(0x7E22CE); // Rich vibrant purple chrome
        this.sculptureMat.emissive.setHex(0x3B0764);
        this.sculptureMat.emissiveIntensity = 0.22;
        this.sculptureMat.metalness = 0.94;
        this.sculptureMat.roughness = 0.05;
        this.sculptureMat.iridescence = 0.96;
        this.sculptureMat.envMapIntensity = 2.6;
      }
      if (this.coreMat) {
        this.coreMat.color.setHex(0xffffff);
        this.coreMat.emissive.setHex(0x00F0FF);
        this.coreMat.emissiveIntensity = 0.45;
        this.coreMat.attenuationColor.setHex(0x00F0FF);
      }
      if (this.singularityMat) {
        this.singularityMat.color.setHex(0x00F0FF);
      }
      if (this.coreInnerLight) {
        this.coreInnerLight.color.setHex(0x00F0FF);
        this.coreInnerLight.intensity = 3.8;
      }
      if (this.ambientLight) this.ambientLight.intensity = 1.6;
      if (this.dirLight1) {
        this.dirLight1.color.setHex(0xE02BFB);
        this.dirLight1.intensity = 4.5;
      }
      if (this.dirLight2) {
        this.dirLight2.color.setHex(0x00F0FF);
        this.dirLight2.intensity = 4.0;
      }
      if (this.dirLight3) {
        this.dirLight3.color.setHex(0x7C3AED);
        this.dirLight3.intensity = 4.2;
      }
      if (this.specularLight) {
        this.specularLight.color.setHex(0xFFFFFF);
        this.specularLight.intensity = 5.5;
      }
    } else {
      // LIGHT MODE: High-Contrast Obsidian Violet & Rose Gold Chrome (Stands out crisp and bold on light background)
      if (this.sculptureMat) {
        this.sculptureMat.color.setHex(0x4C1D95); // Deep royal violet titanium (bold contrast on light background)
        this.sculptureMat.emissive.setHex(0x581C87);
        this.sculptureMat.emissiveIntensity = 0.25;
        this.sculptureMat.metalness = 0.92;
        this.sculptureMat.roughness = 0.06;
        this.sculptureMat.iridescence = 0.95;
        this.sculptureMat.envMapIntensity = 2.6;
      }
      if (this.coreMat) {
        this.coreMat.color.setHex(0xffffff);
        this.coreMat.emissive.setHex(0x9333EA);
        this.coreMat.emissiveIntensity = 0.50;
        this.coreMat.attenuationColor.setHex(0x9333EA);
      }
      if (this.singularityMat) {
        this.singularityMat.color.setHex(0x9333EA);
      }
      if (this.coreInnerLight) {
        this.coreInnerLight.color.setHex(0x9333EA);
        this.coreInnerLight.intensity = 3.5;
      }
      if (this.ambientLight) this.ambientLight.intensity = 2.0;
      if (this.dirLight1) {
        this.dirLight1.color.setHex(0x7C3AED);
        this.dirLight1.intensity = 4.2;
      }
      if (this.dirLight2) {
        this.dirLight2.color.setHex(0x0284C7);
        this.dirLight2.intensity = 3.8;
      }
      if (this.dirLight3) {
        this.dirLight3.color.setHex(0xD946EF);
        this.dirLight3.intensity = 3.2;
      }
      if (this.specularLight) {
        this.specularLight.color.setHex(0xFFFFFF);
        this.specularLight.intensity = 6.0;
      }
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Touch and Drag with Smooth Inertia Momentum
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

      this.rotationVelocity.y += deltaX * 0.005;
      this.rotationVelocity.x += deltaY * 0.005;

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

    // Mouse spring damping for cinematic parallax tilt
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Inertial velocity damping
    this.rotationVelocity.x *= 0.94;
    this.rotationVelocity.y *= 0.94;

    this.group.rotation.x += this.rotationVelocity.x;
    this.group.rotation.y += this.rotationVelocity.y;

    // Smooth continuous liquid rotation with scroll unwinding
    const scrollSpin = this.scrollProgress * 2.5;
    this.sculpture.rotation.y = time * 0.30 + scrollSpin + this.mouse.x * 0.38;
    this.sculpture.rotation.x = time * 0.16 + this.mouse.y * 0.32;

    // Refractive Inner Crystal Core: Counter-rotates with hypnotic breathing pulse
    this.core.rotation.y = -time * 0.60;
    this.core.rotation.z = time * 0.35;
    const pulse = 1.0 + Math.sin(time * 2.8) * 0.05;
    this.core.scale.set(pulse, pulse, pulse);

    // Singularity pulsating luminescence
    if (this.singularityMat) {
      this.singularityMat.opacity = 0.75 + Math.sin(time * 3.5) * 0.25;
    }
    if (this.coreInnerLight) {
      this.coreInnerLight.intensity = 3.2 + Math.sin(time * 3.5) * 1.5;
    }

    // Precision Gyroscope Gimbal Rings Rotation
    this.rings.forEach((ring, idx) => {
      ring.rotation.z += (ring.userData.speed || 0.15) * delta;
      ring.rotation.y += (0.08 - idx * 0.05) * delta;
    });

    // Orbiting Prismatic Satellite Micro-Gems
    this.satelliteMeshes.forEach((mesh) => {
      mesh.userData.angle += mesh.userData.speed * delta;
      const angle = mesh.userData.angle;
      const dist = mesh.userData.dist;
      mesh.position.x = Math.cos(angle) * dist;
      mesh.position.z = Math.sin(angle) * dist;
      mesh.position.y = Math.sin(angle * 2 + time * 1.6) * 0.35;
      mesh.rotation.x += mesh.userData.rotSpeed * delta;
      mesh.rotation.y += mesh.userData.rotSpeed * delta;
    });

    // Stardust subtle nebula drift
    if (this.particles) {
      this.particles.rotation.y = time * 0.05;
      this.particles.rotation.x = Math.sin(time * 0.04) * 0.08;
    }

    // Organic levitation float
    this.group.position.y = Math.sin(time * 1.6) * 0.12;

    // Specular Key Light Orbiting for gleam sweeps across chrome curves
    if (this.specularLight) {
      this.specularLight.position.x = Math.sin(time * 1.4) * 3.8 + this.mouse.x * 2.0;
      this.specularLight.position.y = Math.cos(time * 1.1) * 3.2 + this.mouse.y * 2.0;
      this.specularLight.position.z = 4.0 + Math.sin(time * 0.6) * 1.2;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
