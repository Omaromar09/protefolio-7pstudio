import * as THREE from 'three';

/**
 * Cinematic 3D Scene for the Welcome Intro
 * Morphing glowing geometric core surrounded by a cosmic dust field
 */
export class IntroScene {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isWarping = false;
    this.rafId = null;

    this.init();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 5.5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    this.pointLightViolet = new THREE.PointLight(0x8b5cf6, 3, 20);
    this.pointLightViolet.position.set(3, 3, 3);
    this.scene.add(this.pointLightViolet);

    this.pointLightCyan = new THREE.PointLight(0x06b6d4, 3, 20);
    this.pointLightCyan.position.set(-3, -2, 2);
    this.scene.add(this.pointLightCyan);

    this.pointLightPink = new THREE.PointLight(0xec4899, 2.5, 15);
    this.pointLightPink.position.set(0, 4, -2);
    this.scene.add(this.pointLightPink);

    // Create 3D Objects
    this.createCoreMesh();
    this.createParticles();
    this.createRings();

    // Event Listeners
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onResize = this.onResize.bind(this);

    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);

    // Start loop
    this.animate();
  }

  createCoreMesh() {
    this.coreGroup = new THREE.Group();

    // Outer faceted wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      emissive: 0x3b0764,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.65
    });
    this.wireMesh = new THREE.Mesh(icoGeo, wireMat);
    this.coreGroup.add(this.wireMesh);

    // Inner glowing sphere
    const sphereGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    this.innerMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.coreGroup.add(this.innerMesh);

    this.scene.add(this.coreGroup);
  }

  createRings() {
    this.ringsGroup = new THREE.Group();

    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.5 });
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI / 3;
    this.ringsGroup.add(this.ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.6, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.45 });
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.y = Math.PI / 4;
    this.ringsGroup.add(this.ring2);

    this.scene.add(this.ringsGroup);
  }

  createParticles() {
    const particleCount = 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x8b5cf6), // violet
      new THREE.Color(0x06b6d4), // cyan
      new THREE.Color(0xec4899), // pink
      new THREE.Color(0xf97316), // warm orange
      new THREE.Color(0xffffff)  // crisp star
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create soft particle dot texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onResize() {
    if (!this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  warpOut(onComplete) {
    this.isWarping = true;
    const startTime = performance.now();
    const duration = 1200; // ms

    const animateWarp = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease in expo
      const ease = Math.pow(progress, 3);

      this.camera.position.z = 5.5 - ease * 7.5;
      this.camera.rotation.z += 0.04;
      this.coreGroup.scale.setScalar(1 + ease * 3);
      this.particles.material.size = 0.12 + ease * 0.35;

      if (progress < 1) {
        requestAnimationFrame(animateWarp);
      } else {
        if (typeof onComplete === 'function') onComplete();
        this.destroy();
      }
    };

    requestAnimationFrame(animateWarp);
  }

  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Lerp mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (!this.isWarping) {
      // Rotation
      this.coreGroup.rotation.y = elapsedTime * 0.35 + this.mouse.x * 0.6;
      this.coreGroup.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2 + this.mouse.y * 0.6;

      this.ringsGroup.rotation.z = -elapsedTime * 0.2;
      this.ringsGroup.rotation.x = Math.PI / 4 + Math.sin(elapsedTime * 0.4) * 0.15;

      this.particles.rotation.y = elapsedTime * 0.08;
      this.particles.rotation.x = elapsedTime * 0.04;

      // Pulsing pulse
      const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      this.innerMesh.scale.set(pulse, pulse, pulse);

      // Light orbit
      this.pointLightViolet.position.x = Math.sin(elapsedTime) * 3.5;
      this.pointLightViolet.position.z = Math.cos(elapsedTime) * 3.5;
      this.pointLightCyan.position.x = Math.sin(elapsedTime + Math.PI) * 3.5;
      this.pointLightCyan.position.z = Math.cos(elapsedTime + Math.PI) * 3.5;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);

    // Clean up Three.js resources
    this.scene.traverse((child) => {
      if (child.isMesh || child.isPoints) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}
