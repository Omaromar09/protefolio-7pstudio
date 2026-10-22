const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/3d/heroCard3D.js');

const code = `import * as THREE from 'three';
import gsap from 'gsap';

export class HeroCard3D {
  constructor(canvasElement, containerElement, options = {}) {
    this.canvas = canvasElement;
    this.container = containerElement;
    this.options = options;

    this.photos = [
      '/photos/photo-1.webp',
      '/photos/photo-2.webp',
      '/photos/photo-3.webp',
      '/photos/photo-4.webp',
      '/photos/photo-5.webp',
      '/photos/photo-6.webp'
    ];

    this.focalPoints = [
      'center 35%',
      'center 22%',
      'center 28%',
      'center 20%',
      'center 42%',
      'center 38%'
    ];

    this.currentIndex = 1;
    this.isTransitioning = false;
    this.isWebGLSupported = this.checkWebGLSupport();

    this.counterEl = document.getElementById('photo-counter');
    this.btnUp = document.getElementById('wheel-btn-up');
    this.btnDown = document.getElementById('wheel-btn-down');
    this.fallbackImg = document.getElementById('hero-card-fallback-img');
    this.checkBadge = document.querySelector('.hero-check-badge');
    this.peachBlobs = document.querySelectorAll('.peach-blob');

    this.targetTiltX = 0;
    this.targetTiltY = 0;
    this.currentTiltX = 0;
    this.currentTiltY = 0;
    this.rafId = null;

    this.touchStartY = 0;
    this.touchStartX = 0;

    this.init();
  }

  checkWebGLSupport() {
    try {
      const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
      return !!(window.WebGLRenderingContext && gl);
    } catch (e) {
      return false;
    }
  }

  init() {
    this.updateCounter();
    this.setupDomesticFallback();

    if (this.isWebGLSupported) {
      this.initThreeScene();
    }

    this.bindEvents();
    this.animate();
  }

  setupDomesticFallback() {
    if (this.fallbackImg) {
      this.fallbackImg.src = this.photos[this.currentIndex];
      this.fallbackImg.style.objectPosition = this.focalPoints[this.currentIndex];
    }
  }

  initThreeScene() {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width || 340;
    const height = rect.height || 453;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.z = 3.6;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(dpr);

    this.textureLoader = new THREE.TextureLoader();
    this.textures = this.photos.map(url => {
      const tex = this.textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    });

    const cardWidth = 1.95;
    const cardHeight = 2.6;
    const radius = 0.15;
    const shape = this.createRoundedRectShape(cardWidth, cardHeight, radius);
    const geometry = new THREE.ShapeGeometry(shape, 24);

    this.adjustShapeGeometryUVs(geometry, cardWidth, cardHeight);

    this.cardMaterial = new THREE.MeshBasicMaterial({
      map: this.textures[this.currentIndex],
      transparent: true,
      side: THREE.DoubleSide
    });

    this.cardMesh = new THREE.Mesh(geometry, this.cardMaterial);
    this.scene.add(this.cardMesh);

    const shadowGeo = new THREE.PlaneGeometry(cardWidth * 1.15, cardHeight * 1.15);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x14110f,
      transparent: true,
      opacity: 0.08
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.position.z = -0.08;
    this.shadowMesh.position.y = -0.06;
    this.scene.add(this.shadowMesh);

    window.addEventListener('resize', () => this.onResize(), { passive: true });
  }

  createRoundedRectShape(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    return shape;
  }

  adjustShapeGeometryUVs(geometry, width, height) {
    const pos = geometry.attributes.position;
    const uvs = [];
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const u = (px + width / 2) / width;
      const v = (py + height / 2) / height;
      uvs.push(u, v);
    }
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }

  onResize() {
    if (!this.renderer || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  bindEvents() {
    if (this.btnUp) {
      this.btnUp.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevPhoto();
      });
    }
    if (this.btnDown) {
      this.btnDown.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextPhoto();
      });
    }

    window.addEventListener('keydown', (e) => {
      const rect = this.container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.prevPhoto();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.nextPhoto();
      }
    });

    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.isTransitioning) return;
      if (e.deltaY > 15) {
        this.nextPhoto();
      } else if (e.deltaY < -15) {
        this.prevPhoto();
      }
    }, { passive: false });

    window.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      const maxTilt = 0.14;
      this.targetTiltY = dx * maxTilt;
      this.targetTiltX = -dy * maxTilt;

      if (this.peachBlobs.length > 0) {
        gsap.to(this.peachBlobs[0], { x: dx * 20, y: dy * 15, duration: 1.5, ease: 'power2.out' });
        if (this.peachBlobs[1]) {
          gsap.to(this.peachBlobs[1], { x: -dx * 25, y: -dy * 20, duration: 1.5, ease: 'power2.out' });
        }
      }
    }, { passive: true });

    this.container.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        const deltaY = e.changedTouches[0].clientY - this.touchStartY;
        const deltaX = e.changedTouches[0].clientX - this.touchStartX;
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
          if (deltaY < 0) {
            this.nextPhoto();
          } else {
            this.prevPhoto();
          }
        }
      }
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.rafId) cancelAnimationFrame(this.rafId);
      } else {
        this.animate();
      }
    });
  }

  nextPhoto() {
    if (this.isTransitioning) return;
    const nextIdx = (this.currentIndex + 1) % this.photos.length;
    this.goToPhoto(nextIdx, 'down');
  }

  prevPhoto() {
    if (this.isTransitioning) return;
    const prevIdx = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.goToPhoto(prevIdx, 'up');
  }

  goToPhoto(newIndex, direction = 'down') {
    if (this.isTransitioning || newIndex === this.currentIndex) return;
    this.isTransitioning = true;
    this.currentIndex = newIndex;

    this.updateCounter();

    if (this.checkBadge) {
      gsap.fromTo(this.checkBadge,
        { scale: 0.7 },
        { scale: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    }

    if (this.cardMesh) {
      const rotDelta = direction === 'down' ? Math.PI : -Math.PI;

      gsap.to(this.cardMesh.rotation, {
        x: this.cardMesh.rotation.x + rotDelta,
        duration: 0.45,
        ease: 'power3.inOut',
        onStart: () => {
          gsap.delayedCall(0.22, () => {
            if (this.textures[this.currentIndex]) {
              this.cardMaterial.map = this.textures[this.currentIndex];
              this.cardMaterial.needsUpdate = true;
            }
          });
        },
        onComplete: () => {
          this.isTransitioning = false;
        }
      });
    }

    if (this.fallbackImg) {
      const yShift = direction === 'down' ? -40 : 40;
      gsap.to(this.fallbackImg, {
        y: yShift,
        filter: 'blur(8px)',
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          this.fallbackImg.src = this.photos[this.currentIndex];
          this.fallbackImg.style.objectPosition = this.focalPoints[this.currentIndex];
          gsap.fromTo(this.fallbackImg,
            { y: -yShift, filter: 'blur(8px)' },
            {
              y: 0,
              filter: 'blur(0px)',
              duration: 0.25,
              ease: 'power2.out',
              onComplete: () => {
                this.isTransitioning = false;
              }
            }
          );
        }
      });
    }
  }

  updateCounter() {
    if (this.counterEl) {
      const current = String(this.currentIndex + 1).padStart(2, '0');
      const total = String(this.photos.length).padStart(2, '0');
      this.counterEl.textContent = \`\${current} / \${total}\`;
    }
  }

  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());

    this.currentTiltX += (this.targetTiltX - this.currentTiltX) * 0.08;
    this.currentTiltY += (this.targetTiltY - this.currentTiltY) * 0.08;

    if (this.cardMesh && this.renderer) {
      this.cardMesh.rotation.y = this.currentTiltY;
      const baseRotX = Math.round(this.cardMesh.rotation.x / Math.PI) * Math.PI;
      this.cardMesh.rotation.x = baseRotX + this.currentTiltX;

      if (this.shadowMesh) {
        this.shadowMesh.position.x = -this.currentTiltY * 0.3;
        this.shadowMesh.position.y = -0.06 - this.currentTiltX * 0.3;
      }

      this.renderer.render(this.scene, this.camera);
    } else if (this.container) {
      const degX = (this.currentTiltX * 180 / Math.PI).toFixed(2);
      const degY = (this.currentTiltY * 180 / Math.PI).toFixed(2);
      this.container.style.transform = \`perspective(1000px) rotateX(\${degX}deg) rotateY(\${degY}deg)\`;
    }
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
`;

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully written heroCard3D.js!');
