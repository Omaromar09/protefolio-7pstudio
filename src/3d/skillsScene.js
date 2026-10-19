import * as THREE from 'three';

/**
 * Interactive 3D Orbiting Skills Scene for the About Section
 * Renders an orbiting constellation of skill satellites around a luminous pulsating tech sphere
 * Upgraded with Orange (#EF4C24), Teal (#2DD4BF), and Amber palette
 */
export class SkillsScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isVisible = true;
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0, y: 0 };

    this.skills = [
      { name: 'JavaScript', color: '#0284C7', emissive: 0x0369a1, icon: 'JS' },
      { name: 'HTML5', color: '#2563EB', emissive: 0x1d4ed8, icon: '<>' },
      { name: 'CSS3', color: '#0EA5E9', emissive: 0x0284c7, icon: '#' },
      { name: 'Responsive', color: '#38BDF8', emissive: 0x0ea5e9, icon: '📱' },
      { name: 'Animations', color: '#6366F1', emissive: 0x4f46e5, icon: '✦' },
      { name: 'Bug Fixing', color: '#06B6D4', emissive: 0x0891b2, icon: '⚡' },
      { name: 'Customization', color: '#3B82F6', emissive: 0x2563eb, icon: '⚙' }
    ];

    this.nodes = [];
    this.init();
  }

  init() {
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth || 360;
    const height = parent.clientHeight || 250;
    const isMobile = window.innerWidth < 768;

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.z = isMobile ? 5.6 : 5.0;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    this.light1 = new THREE.PointLight(0x2563EB, 4.5, 20);
    this.light1.position.set(3, 2, 3);
    this.scene.add(this.light1);

    this.light2 = new THREE.PointLight(0x0EA5E9, 4.0, 20);
    this.light2.position.set(-3, -2, 2);
    this.scene.add(this.light2);

    // Root Group
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Central Morphing Core
    this.createCore();

    // Satellite Nodes
    this.createSkillSatellites();

    // Ambient Star Dust
    this.createDust(isMobile);

    // Event Listeners
    this.bindEvents();

    // Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        this.isVisible = e.isIntersecting;
      });
    }, { threshold: 0.1 });
    this.observer.observe(this.canvas);

    this.animate();
  }

  createCore() {
    const coreGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1E40AF,
      emissive: 0x0EA5E9,
      emissiveIntensity: 0.65,
      roughness: 0.12,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.group.add(this.coreMesh);

    const wireGeo = new THREE.IcosahedronGeometry(0.92, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.coreWire = new THREE.Mesh(wireGeo, wireMat);
    this.group.add(this.coreWire);
  }

  createSkillSatellites() {
    const total = this.skills.length;
    const baseRadius = 2.15;

    this.skills.forEach((skill, index) => {
      const nodeGroup = new THREE.Group();

      const geom = new THREE.DodecahedronGeometry(0.22);
      const colorNum = new THREE.Color(skill.color);
      const mat = new THREE.MeshStandardMaterial({
        color: colorNum,
        emissive: skill.emissive,
        emissiveIntensity: 0.65,
        roughness: 0.25,
        metalness: 0.75
      });
      const mesh = new THREE.Mesh(geom, mat);
      nodeGroup.add(mesh);

      const glowGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: colorNum,
        transparent: true,
        opacity: 0.2,
        wireframe: true
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      nodeGroup.add(glowMesh);

      const sprite = this.createTextSprite(skill.name, skill.color);
      sprite.position.y = 0.42;
      nodeGroup.add(sprite);

      const phi = (index / total) * Math.PI * 2;
      const tilt = ((index % 3) - 1) * 0.45;

      nodeGroup.position.set(
        Math.cos(phi) * baseRadius,
        Math.sin(phi * 2 + tilt) * 0.55,
        Math.sin(phi) * baseRadius
      );

      nodeGroup.userData = {
        baseAngle: phi,
        speed: 0.45 + (index % 2) * 0.15,
        radius: baseRadius + (index % 2) * 0.2,
        tilt,
        mesh,
        glowMesh,
        sprite,
        skill
      };

      this.group.add(nodeGroup);
      this.nodes.push(nodeGroup);
    });
  }

  createTextSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(11, 10, 13, 0.88)';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3;
    
    const x = 10, y = 10, w = 236, h = 50, r = 25;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 35);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1.4, 0.4, 1);
    return sprite;
  }

  createDust(isMobile) {
    const count = isMobile ? 80 : 180;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0xEF4C24),
      new THREE.Color(0x2DD4BF),
      new THREE.Color(0xFBBF24),
      new THREE.Color(0xFF6B6B)
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    this.dust = new THREE.Points(geo, mat);
    this.scene.add(this.dust);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    const onDown = (e) => {
      this.isDragging = true;
      this.prevMouse = {
        x: e.clientX || (e.touches && e.touches[0].clientX) || 0,
        y: e.clientY || (e.touches && e.touches[0].clientY) || 0
      };
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const curY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = curX - this.prevMouse.x;
      const dy = curY - this.prevMouse.y;
      this.rotationVelocity.y += dx * 0.005;
      this.rotationVelocity.x += dy * 0.005;
      this.prevMouse = { x: curX, y: curY };
    };

    const onUp = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    this.canvas.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  onResize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth || 360;
    const height = parent.clientHeight || 250;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  highlightSkill(skillName) {
    this.nodes.forEach((node) => {
      if (node.userData.skill.name.toLowerCase().includes(skillName.toLowerCase())) {
        node.scale.set(1.4, 1.4, 1.4);
      } else {
        node.scale.set(0.9, 0.9, 0.9);
      }
    });
  }

  resetHighlights() {
    this.nodes.forEach((node) => {
      node.scale.set(1, 1, 1);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (!this.isVisible) return;

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.rotationVelocity.x *= 0.94;
    this.rotationVelocity.y *= 0.94;

    this.group.rotation.x += this.rotationVelocity.x;
    this.group.rotation.y += this.rotationVelocity.y;

    this.group.rotation.y += 0.25 * delta;
    this.group.rotation.x = Math.sin(time * 0.3) * 0.15 + this.mouse.y * 0.3;

    const pulse = 1 + Math.sin(time * 2.2) * 0.05;
    this.coreMesh.scale.set(pulse, pulse, pulse);
    this.coreWire.rotation.y = -time * 0.4;
    this.coreWire.rotation.z = time * 0.2;

    this.nodes.forEach((node) => {
      node.userData.baseAngle += node.userData.speed * delta * 0.7;
      const angle = node.userData.baseAngle;
      const r = node.userData.radius;
      const tilt = node.userData.tilt;

      node.position.x = Math.cos(angle) * r;
      node.position.z = Math.sin(angle) * r;
      node.position.y = Math.sin(angle * 2 + time + tilt) * 0.55;

      node.userData.mesh.rotation.x += 1.2 * delta;
      node.userData.mesh.rotation.y += 1.5 * delta;
    });

    this.renderer.render(this.scene, this.camera);
  }
}
