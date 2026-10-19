import { playIntroKick, playIntroFloodHit } from './soundSynth.js';

/**
 * Deterministic Canvas 2D Intro Engine
 * Exact 3.0-second timeline faithful to reference clip:
 * 128 BPM grid (beats: 0, 0.469, 0.938, 1.406, 1.875, 2.344, 2.813)
 * Full seek(t) architecture where every element is computed purely from elapsed time t.
 */

export class DeterministicIntro {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onComplete = options.onComplete || (() => {});
    this.getLang = options.getLang || (() => 'ar');

    this.rafId = null;
    this.startTime = null;
    this.totalDuration = 3.8; // Extended hold on OMAR headline before smooth handoff wipe
    this.isRunning = false;

    // Track triggered beats so audio only fires once per beat
    this.triggeredBeats = {
      beat3: false, // 1.406s
      beat4: false, // 1.875s
      beat5: false, // 2.344s
      beat6: false  // 2.813s
    };

    // Virtual stage size
    this.stageWidth = 1920;
    this.stageHeight = 1080;

    // Trajectory coordinates
    // Impact 1: (620, 702), Impact 2: (960, 702), Impact 3: (1280, 702)
    this.groundY = 702; // 65% of 1080
    this.p1 = { x: 620, y: 702 };
    this.p2 = { x: 960, y: 702 };
    this.p3 = { x: 1280, y: 702 };

    this.initCanvasSize();
    window.addEventListener('resize', () => this.initCanvasSize());
  }

  initCanvasSize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || window.innerWidth;
    const h = rect.height || window.innerHeight;

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.dpr = dpr;
    this.viewportWidth = w;
    this.viewportHeight = h;
  }

  start() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.initCanvasSize();
    this.isRunning = true;
    this.startTime = performance.now();
    this.triggeredBeats = { beat3: false, beat4: false, beat5: false, beat6: false };

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

  /**
   * Deterministic Evaluation Function seek(t)
   * Computes every element purely from t in seconds [0.0, 3.0]
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
      scale = vw / this.stageWidth * 1.35;
    }

    const offsetX = (vw - this.stageWidth * scale) / 2;
    const offsetY = (vh - this.stageHeight * scale) / 2;

    // Procedural sound triggers synchronized to 128 BPM bounce impacts & flood hit
    if (t >= 1.406 && !this.triggeredBeats.beat3) {
      this.triggeredBeats.beat3 = true;
      playIntroKick();
    }
    if (t >= 1.875 && !this.triggeredBeats.beat4) {
      this.triggeredBeats.beat4 = true;
      playIntroKick();
    }
    if (t >= 2.344 && !this.triggeredBeats.beat5) {
      this.triggeredBeats.beat5 = true;
      playIntroKick();
    }
    if (t >= 2.813 && !this.triggeredBeats.beat6) {
      this.triggeredBeats.beat6 = true;
      playIntroFloodHit();
    }

    // -------------------------------------------------------------
    // PHASE 6: SKY BLUE / LABANY FLOOD & HANDOFF (2.813s to totalDuration)
    // -------------------------------------------------------------
    if (t >= 2.813) {
      ctx.fillStyle = '#0EA5E9'; // Vivid Sky Blue / Labany Flood
      ctx.fillRect(0, 0, vw, vh);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      const floodElapsed = t - 2.813;

      // Deep Navy accent bar slides in from left in 0.22s
      const barProgress = Math.min(floodElapsed / 0.22, 1);
      const barEase = 1 - Math.pow(1 - barProgress, 3);
      const barX = -200 + barEase * 340; // settles at 140
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(barX, 420, 160, 12);

      // Hero index HUD label above headline
      ctx.font = '700 13px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.textAlign = 'left';
      ctx.fillText('01 — PORTFOLIO 2026', 140, 480);

      // Giant black/navy headline word slams in with horizontal motion blur in 0.26s
      const slamProgress = Math.min(floodElapsed / 0.26, 1);
      const slamEase = 1 - Math.pow(1 - slamProgress, 3);
      const headlineX = -300 + slamEase * 440; // settles at 140
      const headlineText = 'OMAR';

      ctx.font = '900 195px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.letterSpacing = '-0.04em';

      // Horizontal blur sub-frames only during rapid sliding
      if (slamProgress < 0.65) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText(headlineText, headlineX - 35, 620);
        ctx.fillText(headlineText, headlineX - 18, 620);
      }

      ctx.fillStyle = '#0F172A';
      ctx.fillText(headlineText, headlineX, 620);

      // Thin navy underline grows in 0.3s
      const lineProgress = Math.min(floodElapsed / 0.3, 1);
      const lineEase = 1 - Math.pow(1 - lineProgress, 3);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(140, 650, lineEase * 420, 4);

      ctx.restore(); // restores virtual stage
      ctx.restore(); // restores DPR scale
      return;
    }

    // -------------------------------------------------------------
    // BACKGROUND (0.00s to 2.813s) — Soft Light Ice Blue / Slate
    // -------------------------------------------------------------
    const bgT = Math.min(t / 0.1, 1);
    const bgR = Math.round(255 - 15 * bgT); // 255 -> 240
    const bgG = Math.round(255 - 9 * bgT);  // 255 -> 246
    const bgB = Math.round(255);            // 255 -> 255 (#F0F6FF)
    ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
    ctx.fillRect(0, 0, vw, vh);

    // Subtle grain dots (Sky blue tint)
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

      // 0.00 to 0.12s: fade in & slight scale (0.98 to 1, expo-out)
      if (t < 0.12) {
        const p = t / 0.12;
        titleOpacity = 1 - Math.pow(1 - p, 3);
        titleScale = 0.98 + (1 - Math.pow(1 - p, 3)) * 0.02;
      } else if (t > 0.75 && t < 0.85) {
        // Dims slightly around 0.75s
        titleOpacity = 1 - (t - 0.75) * 1.5;
      } else if (t >= 0.85) {
        // 0.85 to 0.95s: collapse vertically into hairline
        const collapse = (t - 0.85) / 0.1;
        titleScaleY = Math.max(0, 1 - Math.pow(collapse, 3));
        titleOpacity = Math.max(0, 1 - collapse * 0.7);
      }

      ctx.save();
      ctx.translate(960, 510);
      ctx.scale(titleScale, titleScale * titleScaleY);

      ctx.font = '900 148px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillStyle = `rgba(15, 23, 42, ${titleOpacity})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '-0.03em';
      ctx.fillText('OMAR', 0, 0);

      // Label "01 / 02" under title
      if (titleScaleY > 0.2) {
        ctx.font = '700 12px "Space Mono", monospace';
        ctx.fillStyle = `rgba(14, 165, 233, ${titleOpacity * 0.85})`;
        ctx.letterSpacing = '0.12em';
        ctx.fillText('01 / 02', 0, 85);
      }

      ctx.restore();
    }

    // -------------------------------------------------------------
    // PHASE 2 & 3: GROUND LINE & TICKS (0.85s to 2.813s)
    // -------------------------------------------------------------
    if (t >= 0.85 && t < 2.813) {
      let lineWidth = 1200;
      if (t < 1.0) {
        const p = (t - 0.85) / 0.15;
        // Expo out growth from 40px to 1200px
        const ease = 1 - Math.pow(1 - p, 4);
        lineWidth = 40 + ease * 1160;
      }

      const halfW = lineWidth / 2;
      const startX = 960 - halfW;
      const endX = 960 + halfW;

      // Calculate ground dent spring deflection
      const groundDent = this.calculateGroundDent(t);

      // Draw ground line with spring dent
      ctx.beginPath();
      ctx.strokeStyle = '#0284C7';
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

      // Ground ticks underneath (every 40px, taller every 200px)
      if (t >= 0.95) {
        const tickAlpha = Math.min((t - 0.95) / 0.1, 1);
        ctx.strokeStyle = `rgba(15, 23, 42, ${tickAlpha * 0.35})`;
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

      // Dotted trajectory guides (drawn in sky blue)
      if (t >= 1.0) {
        const guideAlpha = Math.min((t - 1.0) / 0.2, 1) * 0.55;
        this.renderTrajectoryGuides(ctx, guideAlpha);
      }

      // Landing markers (diamonds at impact points)
      this.renderDiamondMarkers(ctx, t);

      // Annotation callout labels & leader lines
      this.renderCallouts(ctx, t);
    }

    // -------------------------------------------------------------
    // PHASE 4: THE BOUNCING SKY BLUE / LABANY BALL & GHOST TRAILS
    // -------------------------------------------------------------
    if (t >= 1.05 && t < 2.813) {
      this.renderBall(ctx, t);
    }

    // -------------------------------------------------------------
    // PHASE 5: PERSISTENT HUD (1.00s to 2.60s)
    // -------------------------------------------------------------
    if (t >= 0.95 && t < 2.65) {
      const hudAlpha = t < 1.15
        ? (t - 0.95) / 0.2
        : t > 2.5
          ? 1 - (t - 2.5) / 0.15
          : 1;
      this.renderHUD(ctx, t, hudAlpha);
    }

    ctx.restore();
    ctx.restore();
  }

  calculateGroundDent(t) {
    // Check impacts at 1.406s, 1.875s, 2.344s
    return (x) => {
      let totalDent = 0;

      // Impact 1: x = 620, start = 1.406
      if (t >= 1.406 && t < 1.7) {
        const dt = t - 1.406;
        const decay = Math.exp(-14 * dt);
        const osc = Math.cos(32 * dt);
        const dist = Math.abs(x - 620);
        const spread = Math.max(0, 1 - dist / 90);
        totalDent += 18 * decay * osc * spread;
      }

      // Impact 2: x = 960, start = 1.875
      if (t >= 1.875 && t < 2.15) {
        const dt = t - 1.875;
        const decay = Math.exp(-14 * dt);
        const osc = Math.cos(32 * dt);
        const dist = Math.abs(x - 960);
        const spread = Math.max(0, 1 - dist / 90);
        totalDent += 16 * decay * osc * spread;
      }

      // Impact 3: x = 1280, start = 2.344 (deepest impact)
      if (t >= 2.344 && t < 2.65) {
        const dt = t - 2.344;
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
    ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);

    // Incoming steep line: (480, -30) to (620, 702)
    ctx.beginPath();
    ctx.moveTo(480, -30);
    ctx.lineTo(620, 702);
    ctx.stroke();

    // Parabolic arc 1: (620, 702) to (960, 702), peak at (790, 480)
    ctx.beginPath();
    ctx.moveTo(620, 702);
    ctx.quadraticCurveTo(790, 258, 960, 702);
    ctx.stroke();

    // Parabolic arc 2: (960, 702) to (1280, 702), peak at (1120, 560)
    ctx.beginPath();
    ctx.moveTo(960, 702);
    ctx.quadraticCurveTo(1120, 418, 1280, 702);
    ctx.stroke();

    ctx.restore();
  }

  getBallStateAt(t) {
    let x = 620;
    let y = 702;
    let radiusX = 50;
    let radiusY = 50;
    let angle = 0;
    let vx = 0;
    let vy = 0;
    let scale = 1;

    // Segment 0: Falling in from top left (1.05s to 1.406s)
    if (t < 1.406) {
      const p = (t - 1.05) / (1.406 - 1.05); // 0 to 1
      const ease = p * p; // accelerating drop
      x = 480 + (620 - 480) * p;
      y = -50 + (702 - (-50)) * ease;

      vx = 140;
      vy = 752 * 2 * p;

      // Vertical stretch
      radiusX = 45;
      radiusY = 75;
      angle = Math.atan2(vy, vx) - Math.PI / 2;
    }
    // Impact 1 Squash (1.406s to 1.45s)
    else if (t >= 1.406 && t < 1.45) {
      x = 620;
      const dt = (t - 1.406) / 0.044;
      radiusX = 65 - Math.sin(dt * Math.PI) * 5;
      radiusY = 30 + Math.sin(dt * Math.PI) * 10;
      y = 702 - radiusY + 5;
      angle = 0;
    }
    // Arc 1 (1.45s to 1.875s)
    else if (t < 1.875) {
      const p = (t - 1.45) / (1.875 - 1.45); // 0 to 1
      x = 620 + (960 - 620) * p;
      // Parabolic Y: peak at p = 0.5
      const height = 222;
      y = 702 - 4 * height * p * (1 - p);

      vx = 340;
      vy = -4 * height * (1 - 2 * p);

      const speed = Math.hypot(vx, vy);
      const stretch = (speed / 340) * 0.35;
      radiusX = 50 / (1 + stretch);
      radiusY = 50 * (1 + stretch);
      angle = Math.atan2(vy, vx) - Math.PI / 2;
    }
    // Impact 2 Squash (1.875s to 1.92s)
    else if (t < 1.92) {
      x = 960;
      const dt = (t - 1.875) / 0.045;
      radiusX = 62;
      radiusY = 32;
      y = 702 - radiusY + 4;
      angle = 0;
    }
    // Arc 2 (1.92s to 2.344s)
    else if (t < 2.344) {
      const p = (t - 1.92) / (2.344 - 1.92);
      x = 960 + (1280 - 960) * p;
      const height = 142;
      y = 702 - 4 * height * p * (1 - p);

      vx = 320;
      vy = -4 * height * (1 - 2 * p);

      const speed = Math.hypot(vx, vy);
      const stretch = (speed / 320) * 0.3;
      radiusX = 50 / (1 + stretch);
      radiusY = 50 * (1 + stretch);
      angle = Math.atan2(vy, vx) - Math.PI / 2;
    }
    // Impact 3 Deep Squash (2.344s to 2.40s)
    else if (t < 2.40) {
      x = 1280;
      radiusX = 70;
      radiusY = 20;
      y = 702 - radiusY + 2;
      angle = 0;
    }
    // Anticipation Tilt (2.40s to 2.50s)
    else if (t < 2.50) {
      const p = (t - 2.40) / 0.1;
      x = 1280;
      y = 702 - 45;
      radiusX = 52;
      radiusY = 48;
      // Lean backward 25 degrees
      angle = -0.44 * Math.sin(p * Math.PI);
    }
    // Scale Up to Cover Screen (2.50s to 2.813s)
    else {
      const p = (t - 2.50) / (2.813 - 2.50);
      const expoScale = Math.pow(p, 4.2);
      x = 1280 - p * 320;
      y = (702 - 45) - p * 200;
      scale = 1 + expoScale * 40;
      radiusX = 50;
      radiusY = 50;
      angle = 0;
    }

    return { x, y, radiusX, radiusY, angle, vx, vy, scale };
  }

  renderBall(ctx, t) {
    const ball = this.getBallStateAt(t);

    // Render onion-skin ghost trails (5 ghost frames behind)
    if (t > 1.1 && t < 2.48) {
      for (let i = 5; i >= 1; i--) {
        const pastT = t - i * 0.024;
        if (pastT >= 1.05) {
          const past = this.getBallStateAt(pastT);
          const ghostAlpha = (0.35 * (1 - i / 6));

          ctx.save();
          ctx.translate(past.x, past.y);
          ctx.rotate(past.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, past.radiusX, past.radiusY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(14, 165, 233, ${ghostAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // Render Ripple Rings at impacts
    this.renderRipples(ctx, t);

    // Render the Main Sky Blue / Labany Ball
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.rotate(ball.angle);
    ctx.scale(ball.scale, ball.scale);

    ctx.beginPath();
    ctx.ellipse(0, 0, ball.radiusX, ball.radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0EA5E9';
    ctx.fill();

    ctx.restore();
  }

  renderRipples(ctx, t) {
    const impacts = [
      { t0: 1.406, x: 620 },
      { t0: 1.875, x: 960 },
      { t0: 2.344, x: 1280 }
    ];

    impacts.forEach((imp) => {
      if (t >= imp.t0 && t < imp.t0 + 0.35) {
        const dt = (t - imp.t0) / 0.35;
        const radius = dt * 70;
        const alpha = (1 - dt) * 0.7;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(imp.x, this.groundY, radius, radius * 0.35, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }
    });
  }

  renderDiamondMarkers(ctx, t) {
    const markers = [
      { t0: 1.406, x: 620 },
      { t0: 1.875, x: 960 },
      { t0: 2.344, x: 1280 }
    ];

    markers.forEach((m) => {
      if (t >= m.t0) {
        ctx.save();
        ctx.fillStyle = '#0284C7';
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

    // Callout 1: 1.406s to 1.85s "SQUASH & STRETCH"
    if (t >= 1.406 && t < 1.85) {
      const dt = t - 1.406;
      const alpha = Math.min(dt / 0.1, 1) * (t > 1.75 ? (1.85 - t) / 0.1 : 1);
      const text = this.getScrambledText('SQUASH & STRETCH', dt);

      ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(620, 702 - 10);
      ctx.lineTo(620 + 35, 702 - 55);
      ctx.lineTo(620 + 130, 702 - 55);
      ctx.stroke();

      ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.fillText(text, 620 + 40, 702 - 62);
    }

    // Callout 2: 1.875s to 2.30s "ARCS + TIMING"
    if (t >= 1.875 && t < 2.30) {
      const dt = t - 1.875;
      const alpha = Math.min(dt / 0.1, 1) * (t > 2.2 ? (2.30 - t) / 0.1 : 1);
      const text = this.getScrambledText('ARCS + TIMING', dt);

      ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(960, 702 - 10);
      ctx.lineTo(960 + 35, 702 - 55);
      ctx.lineTo(960 + 120, 702 - 55);
      ctx.stroke();

      ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.fillText(text, 960 + 40, 702 - 62);
    }

    // Callout 3: 2.344s to 2.50s "ARRIVAL"
    if (t >= 2.344 && t < 2.52) {
      const dt = t - 2.344;
      const alpha = Math.min(dt / 0.08, 1);
      const text = this.getScrambledText('ARRIVAL', dt);

      ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(1280, 702 - 10);
      ctx.lineTo(1280 + 35, 702 - 55);
      ctx.lineTo(1280 + 95, 702 - 55);
      ctx.stroke();

      ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
      ctx.fillText(text, 1280 + 40, 702 - 62);
    }

    ctx.restore();
  }

  getScrambledText(target, elapsed) {
    if (elapsed > 0.22) return target;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%*+';
    const resolvedCount = Math.floor((elapsed / 0.22) * target.length);
    let result = target.slice(0, resolvedCount);
    for (let i = resolvedCount; i < target.length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  renderHUD(ctx, t, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.75})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);

    const pad = 42;
    const len = 26;

    // Corner brackets
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(pad, pad + len);
    ctx.lineTo(pad, pad);
    ctx.lineTo(pad + len, pad);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(1920 - pad - len, pad);
    ctx.lineTo(1920 - pad, pad);
    ctx.lineTo(1920 - pad, pad + len);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(pad, 1080 - pad - len);
    ctx.lineTo(pad, 1080 - pad);
    ctx.lineTo(pad + len, 1080 - pad);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(1920 - pad - len, 1080 - pad);
    ctx.lineTo(1920 - pad, 1080 - pad);
    ctx.lineTo(1920 - pad, 1080 - pad - len);
    ctx.stroke();

    // Typography
    ctx.font = '700 11px "Space Mono", monospace';
    ctx.letterSpacing = '0.08em';

    // Top-Left: "OMAR   PORTFOLIO 2026"
    ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.85})`;
    ctx.textAlign = 'left';
    ctx.fillText('OMAR   PORTFOLIO 2026', pad + 15, pad + 18);

    // Top-Right: "128 BPM   60 FPS   1920x1080"
    ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.75})`;
    ctx.textAlign = 'right';
    ctx.fillText('128 BPM   60 FPS   1920x1080', 1920 - pad - 15, pad + 18);

    // Bottom-Left: Running timecode "00:00:00:FF"
    const frames = Math.floor((t * 60) % 60);
    const secs = Math.floor(t % 60);
    const frameStr = String(frames).padStart(2, '0');
    const secStr = String(secs).padStart(2, '0');
    const timecode = `00:00:${secStr}:${frameStr}`;

    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.9})`;
    ctx.fillText(timecode, pad + 15, 1080 - pad - 12);

    // 4 step squares (first one filled sky blue)
    const sqX = pad + 140;
    const sqY = 1080 - pad - 20;
    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        ctx.fillStyle = '#0EA5E9';
        ctx.fillRect(sqX + i * 14, sqY, 8, 8);
      } else {
        ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.4})`;
        ctx.strokeRect(sqX + i * 14, sqY, 8, 8);
      }
    }

    // Hairline progress bar
    const barW = 80;
    const pW = (t / 3.0) * barW;
    ctx.fillStyle = `rgba(14, 165, 233, ${alpha * 0.2})`;
    ctx.fillRect(sqX + 68, sqY + 3, barW, 2);
    ctx.fillStyle = '#0EA5E9';
    ctx.fillRect(sqX + 68, sqY + 3, pW, 2);

    // Bottom-Right: dynamic step label
    let sectionName = '01 — SQUASH & STRETCH';
    if (t >= 1.875 && t < 2.344) sectionName = '02 — ARCS + TIMING';
    else if (t >= 2.344) sectionName = '03 — ARRIVAL';

    ctx.textAlign = 'right';
    ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.85})`;
    ctx.fillText(sectionName, 1920 - pad - 15, 1080 - pad - 12);

    ctx.restore(); // restores virtual stage
    ctx.restore(); // restores DPR scale
  }

  renderGrain(ctx, w, h) {
    // Deterministic faint dotted background grain (Sky blue tint)
    ctx.save();
    ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
    const step = 48;
    for (let x = 12; x < w; x += step) {
      for (let y = 12; y < h; y += step) {
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }
    ctx.restore();
  }
}
