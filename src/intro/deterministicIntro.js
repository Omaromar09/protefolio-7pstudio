/**
 * 7P STUDIO — Deterministic Canvas 2D Intro Engine
 * Exact 3.2-second timeline faithful to the website brand identity:
 * Palette: Obsidian Background #121110, Warm Amber #E8A33D, Cream Text #ECE7DD, Sand #A39B8E
 * Completely free of blue/cyan/purple.
 * Pure deterministic seek(t) architecture with zero lag and instant skip.
 */

export class DeterministicIntro {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onComplete = options.onComplete || (() => {});
    this.getLang = options.getLang || (() => 'ar');

    this.rafId = null;
    this.startTime = null;
    this.totalDuration = 3.2; // 3.2 seconds snappy deterministic timeline
    this.isRunning = false;

    // Virtual stage size
    this.stageWidth = 1920;
    this.stageHeight = 1080;

    // Ground & trajectory coordinates
    this.groundY = 702; // 65% of 1080
    this.p1 = { x: 620, y: 702 };
    this.p2 = { x: 960, y: 702 };
    this.p3 = { x: 1280, y: 702 };

    this.initCanvasSize();
    this.handleResize = () => this.initCanvasSize();
    window.addEventListener('resize', this.handleResize);
  }

  initCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth || document.documentElement.clientWidth;
    const h = window.innerHeight || document.documentElement.clientHeight;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.dpr = dpr;
    this.viewportWidth = w;
    this.viewportHeight = h;
  }

  start() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.initCanvasSize();

    this.isRunning = true;
    this.startTime = performance.now();

    const loop = (now) => {
      if (!this.isRunning) return;

      const elapsed = (now - this.startTime) / 1000;
      const t = Math.min(elapsed, this.totalDuration);

      this.seek(t);

      if (elapsed >= this.totalDuration) {
        this.isRunning = false;
        this.onComplete();
      } else {
        this.rafId = requestAnimationFrame(loop);
      }
    };

    this.rafId = requestAnimationFrame(loop);
  }

  skip() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.seek(this.totalDuration);
    this.onComplete();
  }

  destroy() {
    this.isRunning = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * Deterministic Evaluation Function seek(t)
   * Computes every element purely from t in seconds [0.0, 3.2]
   */
  seek(t) {
    const ctx = this.ctx;
    const dpr = this.dpr || 1;
    const vw = this.viewportWidth;
    const vh = this.viewportHeight;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Dynamic stage scaling: scale 1920x1080 to cover/fit
    const isPortrait = vh > vw;
    let scale = Math.min(vw / this.stageWidth, vh / this.stageHeight);
    if (isPortrait) {
      scale = (vw / this.stageWidth) * 1.35;
    }

    const offsetX = (vw - this.stageWidth * scale) / 2;
    const offsetY = (vh - this.stageHeight * scale) / 2;

    // -------------------------------------------------------------
    // PHASE 6: WARM AMBER FLOOD & HERO HANDOFF (2.65s to totalDuration)
    // -------------------------------------------------------------
    if (t >= 2.65) {
      ctx.fillStyle = '#E8A33D'; // Warm Amber Flood
      ctx.fillRect(0, 0, vw, vh);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      const floodElapsed = t - 2.65;
      const leftVirtualX = -offsetX / scale;
      const virtualWidth = vw / scale;
      const targetX = isPortrait ? (leftVirtualX + 120) : 140;
      const maxLineWidth = isPortrait ? Math.min(1250, virtualWidth - 240) : 1250;

      // Dark accent bar slides in from left
      const barProgress = Math.min(floodElapsed / 0.18, 1);
      const barEase = 1 - Math.pow(1 - barProgress, 3);
      const barX = (targetX - 300) + barEase * 300;
      ctx.fillStyle = '#121110';
      ctx.fillRect(barX, 420, 160, 10);

      // Studio label
      ctx.font = '700 14px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(18, 17, 16, 0.78)';
      ctx.textAlign = 'left';
      ctx.fillText('7P STUDIO — OMAR & GAD', targetX, 480);

      // Headline
      const slamProgress = Math.min(floodElapsed / 0.22, 1);
      const slamEase = 1 - Math.pow(1 - slamProgress, 3);
      const headlineX = (targetX - 350) + slamEase * 350;
      const headlineText = '7P STUDIO';

      const fontSize = isPortrait ? Math.min(96, Math.floor((virtualWidth - 240) / 6.5)) : 100;
      ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.fillStyle = '#121110';
      ctx.letterSpacing = '-0.03em';

      if (slamProgress < 0.65) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(headlineText, headlineX - 18, 620);
      }

      ctx.fillStyle = '#121110';
      ctx.fillText(headlineText, headlineX, 620);

      // Underline
      const lineProgress = Math.min(floodElapsed / 0.25, 1);
      const lineEase = 1 - Math.pow(1 - lineProgress, 3);
      ctx.fillStyle = '#121110';
      ctx.fillRect(targetX, 650, lineEase * maxLineWidth, 4);

      ctx.restore();
      ctx.restore();
      return;
    }

    // -------------------------------------------------------------
    // BACKGROUND (0.00s to 2.65s) — Deep Obsidian #121110
    // -------------------------------------------------------------
    ctx.fillStyle = '#121110';
    ctx.fillRect(0, 0, vw, vh);

    // Subtle warm amber grain dots
    this.renderGrain(ctx, vw, vh);

    // Transform into virtual 1920x1080 stage
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // -------------------------------------------------------------
    // PHASE 1: TITLE CARD (0.00s to 0.85s)
    // -------------------------------------------------------------
    if (t < 0.95) {
      let titleOpacity = 1;
      let titleScale = 1;
      let titleScaleY = 1;

      if (t < 0.12) {
        const p = t / 0.12;
        titleOpacity = 1 - Math.pow(1 - p, 3);
        titleScale = 0.98 + (1 - Math.pow(1 - p, 3)) * 0.02;
      } else if (t > 0.72 && t < 0.85) {
        titleOpacity = 1 - (t - 0.72) * 2;
      } else if (t >= 0.85) {
        const collapse = (t - 0.85) / 0.1;
        titleScaleY = Math.max(0, 1 - Math.pow(collapse, 3));
        titleOpacity = Math.max(0, 1 - collapse * 0.8);
      }

      ctx.save();
      ctx.translate(960, 500);
      ctx.scale(titleScale, titleScale * titleScaleY);

      ctx.font = '900 86px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillStyle = `rgba(236, 231, 221, ${titleOpacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '-0.02em';
      ctx.fillText('7P STUDIO', 0, -15);

      // Subtitle
      if (titleScaleY > 0.2) {
        ctx.font = '700 22px "Space Mono", monospace';
        ctx.fillStyle = `rgba(232, 163, 61, ${titleOpacity * 0.95})`;
        ctx.letterSpacing = '0.22em';
        ctx.fillText('OMAR & GAD — PARTNERS', 0, 50);

        ctx.font = '700 12px "Space Mono", monospace';
        ctx.fillStyle = `rgba(163, 155, 142, ${titleOpacity * 0.85})`;
        ctx.letterSpacing = '0.12em';
        ctx.fillText('MODERN BUSINESS WEBSITES', 0, 95);
      }

      ctx.restore();
    }

    // -------------------------------------------------------------
    // PHASE 2 & 3: GROUND LINE & TICKS (0.85s to 2.65s)
    // -------------------------------------------------------------
    if (t >= 0.85 && t < 2.65) {
      let lineWidth = 1200;
      if (t < 1.0) {
        const p = (t - 0.85) / 0.15;
        const ease = 1 - Math.pow(1 - p, 4);
        lineWidth = 40 + ease * 1160;
      }

      const halfW = lineWidth / 2;
      const startX = 960 - halfW;
      const endX = 960 + halfW;

      const groundDent = this.calculateGroundDent(t);

      // Draw ground line with spring dent (Warm Amber)
      ctx.beginPath();
      ctx.strokeStyle = '#E8A33D';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([]);

      const segments = 40;
      for (let i = 0; i <= segments; i++) {
        const segX = startX + (lineWidth / segments) * i;
        const dentOffset = groundDent(segX);
        const segY = this.groundY + dentOffset;

        if (i === 0) ctx.moveTo(segX, segY);
        else ctx.lineTo(segX, segY);
      }
      ctx.stroke();

      // Ground ticks underneath
      if (t >= 0.95) {
        const tickAlpha = Math.min((t - 0.95) / 0.1, 1);
        ctx.strokeStyle = `rgba(163, 155, 142, ${tickAlpha * 0.4})`;
        ctx.lineWidth = 1;

        for (let x = 360; x <= 1560; x += 40) {
          if (x >= startX && x <= endX) {
            const isTall = (x - 360) % 200 === 0;
            const tickH = isTall ? 14 : 6;
            const dent = groundDent(x);
            ctx.beginPath();
            ctx.moveTo(x, this.groundY + dent + 2);
            ctx.lineTo(x, this.groundY + dent + 2 + tickH);
            ctx.stroke();
          }
        }
      }

      // Dotted trajectory guides (Warm Amber)
      if (t >= 1.0) {
        const guideAlpha = Math.min((t - 1.0) / 0.2, 1) * 0.6;
        this.renderTrajectoryGuides(ctx, guideAlpha);
      }

      // Landing markers (Warm Amber diamonds)
      this.renderDiamondMarkers(ctx, t);

      // Annotation callout labels
      this.renderCallouts(ctx, t);
    }

    // -------------------------------------------------------------
    // PHASE 4: THE BOUNCING WARM AMBER BALL & GHOST TRAILS
    // -------------------------------------------------------------
    if (t >= 1.05 && t < 2.65) {
      this.renderBall(ctx, t);
    }

    // -------------------------------------------------------------
    // PHASE 5: PERSISTENT HUD (1.00s to 2.50s)
    // -------------------------------------------------------------
    if (t >= 0.95 && t < 2.55) {
      const hudAlpha = t < 1.15
        ? (t - 0.95) / 0.2
        : t > 2.4
          ? 1 - (t - 2.4) / 0.15
          : 1;
      this.renderHUD(ctx, t, hudAlpha);
    }

    ctx.restore();
    ctx.restore();
  }

  calculateGroundDent(t) {
    return (x) => {
      let totalDent = 0;
      if (t >= 1.35 && t < 1.65) {
        const dt = t - 1.35;
        const decay = Math.exp(-14 * dt);
        const osc = Math.cos(32 * dt);
        const dist = Math.abs(x - 620);
        const spread = Math.max(0, 1 - dist / 90);
        totalDent += 18 * decay * osc * spread;
      }
      if (t >= 1.75 && t < 2.05) {
        const dt = t - 1.75;
        const decay = Math.exp(-14 * dt);
        const osc = Math.cos(32 * dt);
        const dist = Math.abs(x - 960);
        const spread = Math.max(0, 1 - dist / 90);
        totalDent += 16 * decay * osc * spread;
      }
      if (t >= 2.15 && t < 2.50) {
        const dt = t - 2.15;
        const decay = Math.exp(-12 * dt);
        const osc = Math.cos(28 * dt);
        const dist = Math.abs(x - 1280);
        const spread = Math.max(0, 1 - dist / 110);
        totalDent += 26 * decay * osc * spread;
      }
      return totalDent;
    };
  }

  renderTrajectoryGuides(ctx, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(232, 163, 61, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);

    ctx.beginPath();
    ctx.moveTo(480, -30);
    ctx.lineTo(620, 702);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(620, 702);
    ctx.quadraticCurveTo(790, 258, 960, 702);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(960, 702);
    ctx.quadraticCurveTo(1120, 418, 1280, 702);
    ctx.stroke();

    ctx.restore();
  }

  getBallStateAt(t) {
    let x = 620;
    let y = 702;
    let radiusX = 48;
    let radiusY = 48;
    let angle = 0;
    let scale = 1;

    if (t < 1.35) {
      const p = (t - 1.05) / (1.35 - 1.05);
      const ease = p * p;
      x = 480 + (620 - 480) * p;
      y = -50 + (702 - (-50)) * ease;
      radiusX = 44;
      radiusY = 70;
      angle = Math.atan2(752 * 2 * p, 140) - Math.PI / 2;
    } else if (t >= 1.35 && t < 1.40) {
      x = 620;
      const dt = (t - 1.35) / 0.05;
      radiusX = 64 - Math.sin(dt * Math.PI) * 5;
      radiusY = 28 + Math.sin(dt * Math.PI) * 10;
      y = 702 - radiusY + 5;
      angle = 0;
    } else if (t < 1.75) {
      const p = (t - 1.40) / (1.75 - 1.40);
      x = 620 + (960 - 620) * p;
      const height = 222;
      y = 702 - 4 * height * p * (1 - p);
      const vx = 340;
      const vy = -4 * height * (1 - 2 * p);
      const speed = Math.hypot(vx, vy);
      const stretch = (speed / 340) * 0.35;
      radiusX = 48 / (1 + stretch);
      radiusY = 48 * (1 + stretch);
      angle = Math.atan2(vy, vx) - Math.PI / 2;
    } else if (t < 1.80) {
      x = 960;
      radiusX = 62;
      radiusY = 30;
      y = 702 - radiusY + 4;
      angle = 0;
    } else if (t < 2.15) {
      const p = (t - 1.80) / (2.15 - 1.80);
      x = 960 + (1280 - 960) * p;
      const height = 142;
      y = 702 - 4 * height * p * (1 - p);
      const vx = 320;
      const vy = -4 * height * (1 - 2 * p);
      const speed = Math.hypot(vx, vy);
      const stretch = (speed / 320) * 0.3;
      radiusX = 48 / (1 + stretch);
      radiusY = 48 * (1 + stretch);
      angle = Math.atan2(vy, vx) - Math.PI / 2;
    } else if (t < 2.22) {
      x = 1280;
      radiusX = 68;
      radiusY = 22;
      y = 702 - radiusY + 2;
      angle = 0;
    } else if (t < 2.35) {
      const p = (t - 2.22) / 0.13;
      x = 1280;
      y = 702 - 45;
      radiusX = 50;
      radiusY = 48;
      angle = -0.4 * Math.sin(p * Math.PI);
    } else {
      const p = (t - 2.35) / (2.65 - 2.35);
      const expoScale = Math.pow(p, 4);
      x = 1280 - p * 320;
      y = (702 - 45) - p * 200;
      scale = 1 + expoScale * 42;
      radiusX = 48;
      radiusY = 48;
      angle = 0;
    }

    return { x, y, radiusX, radiusY, angle, scale };
  }

  renderBall(ctx, t) {
    const ball = this.getBallStateAt(t);

    // Ghost trails
    if (t > 1.1 && t < 2.35) {
      for (let i = 4; i >= 1; i--) {
        const pastT = t - i * 0.024;
        if (pastT >= 1.05) {
          const past = this.getBallStateAt(pastT);
          const ghostAlpha = 0.3 * (1 - i / 5);

          ctx.save();
          ctx.translate(past.x, past.y);
          ctx.rotate(past.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, past.radiusX, past.radiusY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(232, 163, 61, ${ghostAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    this.renderRipples(ctx, t);

    // Main Amber Ball with subtle radial glow
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.angle);
    ctx.scale(ball.scale, ball.scale);

    ctx.beginPath();
    ctx.ellipse(0, 0, ball.radiusX, ball.radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#E8A33D';
    ctx.shadowColor = 'rgba(232, 163, 61, 0.45)';
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.restore();
  }

  renderRipples(ctx, t) {
    const impacts = [
      { t0: 1.35, x: 620 },
      { t0: 1.75, x: 960 },
      { t0: 2.15, x: 1280 }
    ];

    impacts.forEach((imp) => {
      if (t >= imp.t0 && t < imp.t0 + 0.35) {
        const dt = (t - imp.t0) / 0.35;
        const radius = dt * 70;
        const alpha = (1 - dt) * 0.7;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(imp.x, this.groundY, radius, radius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232, 163, 61, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  renderDiamondMarkers(ctx, t) {
    const markers = [
      { t0: 1.35, x: 620 },
      { t0: 1.75, x: 960 },
      { t0: 2.15, x: 1280 }
    ];

    markers.forEach((m) => {
      if (t >= m.t0) {
        ctx.save();
        ctx.fillStyle = '#E8A33D';
        ctx.beginPath();
        const size = 5;
        ctx.moveTo(m.x, this.groundY - size);
        ctx.lineTo(m.x + size, this.groundY);
        ctx.lineTo(m.x, this.groundY + size);
        ctx.lineTo(m.x - size, this.groundY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    });
  }

  renderCallouts(ctx, t) {
    ctx.save();
    ctx.font = '700 11px "Space Mono", monospace';
    ctx.letterSpacing = '0.08em';

    if (t >= 1.35 && t < 1.75) {
      const dt = t - 1.35;
      const alpha = Math.min(dt / 0.1, 1) * (t > 1.65 ? (1.75 - t) / 0.1 : 1);
      ctx.strokeStyle = `rgba(232, 163, 61, ${alpha * 0.85})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(620, 702 - 10);
      ctx.lineTo(620 + 35, 702 - 55);
      ctx.lineTo(620 + 130, 702 - 55);
      ctx.stroke();

      ctx.fillStyle = `rgba(236, 231, 221, ${alpha})`;
      ctx.fillText('HIGH IMPACT', 620 + 40, 702 - 62);
    }

    if (t >= 1.75 && t < 2.15) {
      const dt = t - 1.75;
      const alpha = Math.min(dt / 0.1, 1) * (t > 2.05 ? (2.15 - t) / 0.1 : 1);
      ctx.strokeStyle = `rgba(232, 163, 61, ${alpha * 0.85})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(960, 702 - 10);
      ctx.lineTo(960 + 35, 702 - 55);
      ctx.lineTo(960 + 120, 702 - 55);
      ctx.stroke();

      ctx.fillStyle = `rgba(236, 231, 221, ${alpha})`;
      ctx.fillText('SMOOTH MOTION', 960 + 40, 702 - 62);
    }

    if (t >= 2.15 && t < 2.45) {
      const dt = t - 2.15;
      const alpha = Math.min(dt / 0.08, 1);
      ctx.strokeStyle = `rgba(232, 163, 61, ${alpha * 0.85})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(1280, 702 - 10);
      ctx.lineTo(1280 + 35, 702 - 55);
      ctx.lineTo(1280 + 95, 702 - 55);
      ctx.stroke();

      ctx.fillStyle = `rgba(236, 231, 221, ${alpha})`;
      ctx.fillText('7P DELIVERY', 1280 + 40, 702 - 62);
    }

    ctx.restore();
  }

  renderHUD(ctx, t, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(232, 163, 61, ${alpha * 0.75})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);

    const pad = 42;
    const len = 26;

    const isPortrait = this.viewportHeight > this.viewportWidth;
    let scale = Math.min(this.viewportWidth / this.stageWidth, this.viewportHeight / this.stageHeight);
    if (isPortrait) {
      scale = (this.viewportWidth / this.stageWidth) * 1.35;
    }
    const offsetX = (this.viewportWidth - this.stageWidth * scale) / 2;
    const offsetY = (this.viewportHeight - this.stageHeight * scale) / 2;
    const leftVirtualX = -offsetX / scale;
    const rightVirtualX = (this.viewportWidth - offsetX) / scale;
    const topVirtualY = -offsetY / scale;
    const bottomVirtualY = (this.viewportHeight - offsetY) / scale;

    const hudLeft = isPortrait ? (leftVirtualX + 50) : pad;
    const hudRight = isPortrait ? (rightVirtualX - 50) : (1920 - pad);
    const hudTop = isPortrait ? (topVirtualY + 50) : pad;
    const hudBottom = isPortrait ? (bottomVirtualY - 50) : (1080 - pad);

    // Corner brackets
    ctx.beginPath();
    ctx.moveTo(hudLeft, hudTop + len);
    ctx.lineTo(hudLeft, hudTop);
    ctx.lineTo(hudLeft + len, hudTop);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(hudRight - len, hudTop);
    ctx.lineTo(hudRight, hudTop);
    ctx.lineTo(hudRight, hudTop + len);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(hudLeft, hudBottom - len);
    ctx.lineTo(hudLeft, hudBottom);
    ctx.lineTo(hudLeft + len, hudBottom);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(hudRight - len, hudBottom);
    ctx.lineTo(hudRight, hudBottom);
    ctx.lineTo(hudRight, hudBottom - len);
    ctx.stroke();

    // Typography
    ctx.font = '700 11px "Space Mono", monospace';
    ctx.letterSpacing = '0.08em';

    // Top-Left
    ctx.fillStyle = `rgba(236, 231, 221, ${alpha * 0.85})`;
    ctx.textAlign = 'left';
    ctx.fillText('7P STUDIO   WEB ARCHITECTURE', hudLeft + 15, hudTop + 18);

    // Top-Right
    ctx.fillStyle = `rgba(232, 163, 61, ${alpha * 0.85})`;
    ctx.textAlign = 'right';
    ctx.fillText('128 BPM   60 FPS', hudRight - 15, hudTop + 18);

    // Bottom-Left
    const frames = Math.floor((t * 60) % 60);
    const secs = Math.floor(t % 60);
    const frameStr = String(frames).padStart(2, '0');
    const secStr = String(secs).padStart(2, '0');
    const timecode = `00:00:${secStr}:${frameStr}`;

    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(163, 155, 142, ${alpha * 0.9})`;
    ctx.fillText(timecode, hudLeft + 15, hudBottom - 12);

    // Progress dots
    const sqX = hudLeft + 140;
    const sqY = hudBottom - 20;
    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        ctx.fillStyle = '#E8A33D';
        ctx.fillRect(sqX + i * 14, sqY, 8, 8);
      } else {
        ctx.strokeStyle = `rgba(232, 163, 61, ${alpha * 0.4})`;
        ctx.strokeRect(sqX + i * 14, sqY, 8, 8);
      }
    }

    const barW = isPortrait ? 50 : 80;
    const pW = (t / 3.2) * barW;
    ctx.fillStyle = `rgba(232, 163, 61, ${alpha * 0.25})`;
    ctx.fillRect(sqX + 68, sqY + 3, barW, 2);
    ctx.fillStyle = '#E8A33D';
    ctx.fillRect(sqX + 68, sqY + 3, pW, 2);

    // Bottom-Right: dynamic step label
    let sectionName = '01 — IDEA & SCOPE';
    if (t >= 1.75 && t < 2.15) sectionName = '02 — DESIGN & CODE';
    else if (t >= 2.15) sectionName = '03 — FAST DELIVERY';

    ctx.textAlign = 'right';
    ctx.fillStyle = `rgba(232, 163, 61, ${alpha * 0.85})`;
    ctx.fillText(sectionName, hudRight - 15, hudBottom - 12);

    ctx.restore();
    ctx.restore();
  }

  renderGrain(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(232, 163, 61, 0.04)';
    const step = 48;
    for (let x = 12; x < w; x += step) {
      for (let y = 12; y < h; y += step) {
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }
    ctx.restore();
  }
}
