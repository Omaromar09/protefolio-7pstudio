import * as THREE from 'three';

/**
 * Interactive 3D Centerpiece for Hero Section
 * Midnight Navy Crystalline Artifact with Orange (#EF4C24), Teal (#2DD4BF), and Amber accents
 * Fully optimized with reduced geometry for mobile devices
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

    this.init();
  }

  init() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 480;
    const isMobile = window.innerWidth < 768;

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = isMobile ? 6.8 : 6.0;

    // Renderer (capped DPR for high FPS)
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    this.lightBlue = new THREE.PointLight(0x2563EB, 6.0, 25);
    this.lightBlue.position.set(4, 3, 3);
    this.scene.add(this.lightBlue);

    this.lightCyan = new THREE.PointLight(0x0EA5E9, 5.5, 25);
    this.lightCyan.position.set(-4, -2, 3);
    this.scene.add(this.lightCyan);

    this.lightSky = new THREE.PointLight(0x38BDF8, 4.0, 20);
    this.lightSky.position.set(0, 4, -2);
    this.scene.add(this.lightSky);

    this.lightWhite = new THREE.PointLight(0xFFFFFF, 3.5, 20);
    this.lightWhite.position.set(0, -4, 2);
    this.scene.add(this.lightWhite);

    // Objects
    this.createCenterpiece(isMobile);
    this.createOrbiters(isMobile);
    this.createParticleCloud(isMobile);

    // Event listeners
    this.bindEvents();

    // Intersection observer for performance
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.canvas);

    this.animate();
  }

  createCenterpiece(isMobile) {
    this.group = new THREE.Group();

    // 1. Core Complex Torus Knot (Vibrant Crystalline Royal Blue)
    const tubularSegments = isMobile ? 64 : 128;
    const radialSegments = isMobile ? 18 : 32;
    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.38, tubularSegments, radialSegments, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x1E40AF,
      emissive: 0x0284C7,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      transmission: 0.3,
      thickness: 1.2
    });
    this.knot = new THREE.Mesh(knotGeo, knotMat);
    this.group.add(this.knot);

    // 2. Translucent wireframe cage (Sky Blue / Labany accent)
    const wireGeo = new THREE.TorusKnotGeometry(1.24, 0.40, isMobile ? 32 : 64, 16, 2, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.wireKnot = new THREE.Mesh(wireGeo, wireMat);
    this.group.add(this.wireKnot);

    // 3. Inner glowing gem (Electric Blue Core)
    const gemGeo = new THREE.OctahedronGeometry(0.68, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x2563EB,
      emissive: 0x0EA5E9,
      emissiveIntensity: 0.75,
      roughness: 0.1,
      metalness: 0.4,
      transmission: 0.65,
      thickness: 1.0
    });
    this.gem = new THREE.Mesh(gemGeo, gemMat);
    this.group.add(this.gem);

    // 4. Astrolabe / Orbital Rings
    this.rings = [];
    const ringRadii = [1.9, 2.25, 2.6];
    const ringColors = [0x2563EB, 0x0EA5E9, 0x38BDF8];

    ringRadii.forEach((rad, idx) => {
      const ringGeo = new THREE.TorusGeometry(rad, 0.016, 16, isMobile ? 48 : 96);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColors[idx],
        emissive: ringColors[idx],
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = (Math.PI / 4) * (idx + 1);
      ringMesh.rotation.y = (Math.PI / 6) * (idx + 1);
      this.group.add(ringMesh);
      this.rings.push(ringMesh);
    });

    this.scene.add(this.group);
  }

  createOrbiters(isMobile) {
    this.orbiters = new THREE.Group();
    const orbiterCount = isMobile ? 3 : 6;
    this.orbiterMeshes = [];

    const geom = new THREE.DodecahedronGeometry(0.14);
    const colors = [0x2563EB, 0x0EA5E9, 0x38BDF8, 0x0284C7, 0x60A5FA, 0x06B6D4];

    for (let i = 0; i < orbiterCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(geom, mat);
      const angle = (i / orbiterCount) * Math.PI * 2;
      const dist = 2.4 + (i % 2) * 0.4;
      mesh.position.set(Math.cos(angle) * dist, (Math.sin(angle) * dist) * 0.4, Math.sin(angle) * dist);
      mesh.userData = { angle, dist, speed: 0.5 + (i * 0.15) };

      this.orbiters.add(mesh);
      this.orbiterMeshes.push(mesh);
    }

    this.group.add(this.orbiters);
  }

  createParticleCloud(isMobile) {
    const count = isMobile ? 40 : 85;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0x38BDF8);
    const c2 = new THREE.Color(0x0EA5E9);
    const c3 = new THREE.Color(0x2563EB);

    for (let i = 0; i < count; i++) {
      const radius = 1.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = Math.random() > 0.6 ? c1 : (Math.random() > 0.3 ? c2 : c3);
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.05 : 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Touch and drag support for the 3D canvas
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

    window.addEventListener('resize', () => this.onResize());
  }

  setScroll(progress) {
    this.scrollProgress = progress;
  }

  onResize() {
    if (!this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const width = rect.width || 480;
    const height = rect.height || 480;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isVisible) return;

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    this.rotationVelocity.x *= 0.94;
    this.rotationVelocity.y *= 0.94;

    this.group.rotation.x += this.rotationVelocity.x;
    this.group.rotation.y += this.rotationVelocity.y;

    const scrollSpin = this.scrollProgress * 2.5;
    this.knot.rotation.y = time * 0.35 + scrollSpin + this.mouse.x * 0.4;
    this.knot.rotation.x = time * 0.2 + this.mouse.y * 0.4;

    this.wireKnot.rotation.y = this.knot.rotation.y;
    this.wireKnot.rotation.x = this.knot.rotation.x;

    this.gem.rotation.y = -time * 0.8;
    this.gem.rotation.z = time * 0.5;

    this.rings.forEach((ring, idx) => {
      ring.rotation.z += (0.2 + idx * 0.15) * delta;
      ring.rotation.y += (0.15 - idx * 0.1) * delta;
    });

    this.orbiterMeshes.forEach((mesh) => {
      mesh.userData.angle += mesh.userData.speed * delta;
      const angle = mesh.userData.angle;
      const dist = mesh.userData.dist;
      mesh.position.x = Math.cos(angle) * dist;
      mesh.position.z = Math.sin(angle) * dist;
      mesh.position.y = Math.sin(angle * 2 + time) * 0.45;
      mesh.rotation.x += 1.5 * delta;
      mesh.rotation.y += 1.5 * delta;
    });

    if (this.particles) {
      this.particles.rotation.y = time * 0.08;
      this.particles.rotation.x = Math.sin(time * 0.05) * 0.1;
    }

    this.group.position.y = Math.sin(time * 1.5) * 0.12;

    if (this.lightBlue) {
      this.lightBlue.position.x = Math.sin(time * 0.9) * 4;
      this.lightBlue.position.y = Math.cos(time * 0.7) * 3;
    }
    if (this.lightCyan) {
      this.lightCyan.position.x = -Math.sin(time * 0.8) * 4;
      this.lightCyan.position.z = Math.cos(time * 0.8) * 4;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
