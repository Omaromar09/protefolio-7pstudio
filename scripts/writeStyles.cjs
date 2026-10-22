const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, '../src/styles');
if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true });

// 1. variables.css
const variablesCss = `/* ==========================================================================
   OMAR YAHIA — PERSONAL PORTFOLIO DESIGN TOKENS
   Visual Identity:
   - Warm off-white background #FBF8F4
   - Soft peach blurred shapes drifting at top and bottom
   - Text near-black #14110F, secondary text #8A817A
   - ONE accent color only: orange #E8552B
   - Typeface: Geist (EN) and IBM Plex Sans Arabic (AR), bold and tightly spaced
   - 28px card radius, soft white pills/cards with subtle shadows
   ========================================================================== */

:root {
  /* Surfaces */
  --bg-primary: #FBF8F4;
  --bg-surface: #FFFFFF;
  --bg-surface-subtle: #F6F1EA;
  --bg-card: #FFFFFF;
  --bg-pill: #FFFFFF;

  /* Peach drifting blobs */
  --blob-color-1: rgba(254, 218, 196, 0.65);
  --blob-color-2: rgba(255, 225, 205, 0.55);
  --blob-color-3: rgba(253, 235, 224, 0.5);

  /* Typography Colors */
  --text-primary: #14110F;
  --text-secondary: #8A817A;
  --text-muted: #B5ACA4;
  --text-inverted: #FFFFFF;

  /* THE ONE ACCENT COLOR */
  --accent-orange: #E8552B;
  --accent-orange-rgb: 232, 85, 43;
  --accent-orange-soft: rgba(232, 85, 43, 0.12);

  /* Borders & Shadows */
  --border-subtle: rgba(20, 17, 15, 0.08);
  --border-card: rgba(20, 17, 15, 0.06);
  --border-active: #E8552B;

  --shadow-sm: 0 4px 12px rgba(20, 17, 15, 0.04);
  --shadow-pill: 0 10px 28px -4px rgba(20, 17, 15, 0.06), 0 2px 6px rgba(20, 17, 15, 0.02);
  --shadow-card: 0 20px 48px -12px rgba(20, 17, 15, 0.08), 0 2px 8px rgba(20, 17, 15, 0.03);
  --shadow-card-hover: 0 28px 60px -12px rgba(20, 17, 15, 0.12), 0 4px 12px rgba(20, 17, 15, 0.04);
  --shadow-wheel: 0 24px 64px -12px rgba(20, 17, 15, 0.12);

  /* Radii */
  --radius-card: 28px;
  --radius-pill: 9999px;
  --radius-sm: 14px;
  --radius-xs: 8px;

  /* Typography */
  --font-ar: 'IBM Plex Sans Arabic', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-en: 'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Transitions & Springs */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.08);
  --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
`;
fs.writeFileSync(path.join(stylesDir, 'variables.css'), variablesCss, 'utf8');

// 2. base.css
const baseCss = `/* ==========================================================================
   OMAR YAHIA — BASE STYLES & FLUID TYPOGRAPHY
   ========================================================================== */

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

html[lang="ar"],
html[dir="rtl"] {
  font-family: var(--font-ar);
  direction: rtl;
  text-align: right;
}

html[lang="en"],
html[dir="ltr"] {
  font-family: var(--font-en);
  direction: ltr;
  text-align: left;
}

body {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
  position: relative;
}

/* Background Peach Drifting Shapes */
.peach-blobs-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.peach-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.85;
  will-change: transform;
}

.blob-top {
  top: -120px;
  inset-inline-start: -80px;
  width: 580px;
  height: 480px;
  background: radial-gradient(circle, var(--blob-color-1) 0%, transparent 70%);
  animation: driftTop 22s ease-in-out infinite alternate;
}

.blob-bottom {
  bottom: -150px;
  inset-inline-end: -100px;
  width: 650px;
  height: 520px;
  background: radial-gradient(circle, var(--blob-color-2) 0%, transparent 70%);
  animation: driftBottom 26s ease-in-out infinite alternate;
}

.blob-mid {
  top: 55%;
  inset-inline-start: 15%;
  width: 440px;
  height: 380px;
  background: radial-gradient(circle, var(--blob-color-3) 0%, transparent 70%);
  animation: driftMid 28s ease-in-out infinite alternate;
}

@keyframes driftTop {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(45px, 35px) scale(1.06); }
  100% { transform: translate(-25px, 50px) scale(0.96); }
}

@keyframes driftBottom {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, -30px) scale(1.05); }
  100% { transform: translate(30px, -45px) scale(0.95); }
}

@keyframes driftMid {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.08); }
  100% { transform: translate(-20px, 30px) scale(0.94); }
}

/* Fluid Typography */
h1, h2, h3, h4, h5, h6 {
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

h1 {
  font-size: clamp(2.5rem, 6vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.035em;
}

h2 {
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
}

h3 {
  font-size: clamp(1.35rem, 2.8vw, 1.85rem);
  font-weight: 600;
}

p {
  color: var(--text-secondary);
  font-size: clamp(1rem, 1.2vw, 1.125rem);
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
}

img {
  max-width: 100%;
  display: block;
}

::selection {
  background-color: var(--accent-orange-soft);
  color: var(--accent-orange);
}

.accent-word {
  color: var(--accent-orange);
  display: inline;
}

.container {
  width: 100%;
  max-width: 1240px;
  margin-inline: auto;
  padding-inline: clamp(1.25rem, 4vw, 2.5rem);
}

.site-wrapper {
  position: relative;
  z-index: 1;
}

.force-ltr {
  direction: ltr !important;
  unicode-bidi: isolate;
  display: inline-block;
}
`;
fs.writeFileSync(path.join(stylesDir, 'base.css'), baseCss, 'utf8');

// 3. intro.css
const introCss = `/* ==========================================================================
   OMAR YAHIA — INTRO & TIMELINE STYLES
   Visual Identity: Warm off-white #FBF8F4, Orange #E8552B, Near-Black #14110F
   Driven by ONE master GSAP timeline (0.00s to 5.00s -> 6.00s handoff)
   ========================================================================== */

#intro-stage {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background-color: transparent;
  overflow: hidden;
}

#intro-stage.is-hidden {
  display: none !important;
}

.skip-intro-btn {
  position: fixed;
  top: 1.5rem;
  inset-inline-end: 1.5rem;
  z-index: 1050;
  background: var(--bg-surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  padding: 0.55rem 1.15rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s var(--ease-smooth);
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skip-intro-btn:hover {
  color: var(--text-primary);
  border-color: var(--accent-orange);
  box-shadow: var(--shadow-pill);
  transform: translateY(-1px);
}

.skip-intro-btn:active {
  transform: translateY(0);
}

.intro-center-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.intro-dot {
  width: 14px;
  height: 14px;
  background-color: var(--accent-orange);
  border-radius: 50%;
  position: absolute;
  z-index: 10;
  transform: scale(0);
}

.intro-ring {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--accent-orange);
  opacity: 0;
  transform: scale(1);
  pointer-events: none;
}

.intro-pill {
  position: absolute;
  background-color: var(--bg-surface);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-pill);
  border: 1px solid rgba(20, 17, 15, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  width: 14px;
  height: 14px;
  opacity: 0;
  overflow: hidden;
  z-index: 8;
}

.intro-avatars-group {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 12;
}

.intro-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-surface);
  box-shadow: 0 2px 6px rgba(20, 17, 15, 0.08);
  margin-inline-end: -10px;
  transform: scale(0);
  background-color: #E6DFD5;
}

.intro-avatar:last-child {
  margin-inline-end: 0;
}

.intro-headline-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 90vw;
  max-width: 920px;
  opacity: 0;
  filter: blur(14px);
  z-index: 20;
  pointer-events: none;
}

.intro-headline-line1,
.intro-headline-line2 {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.25;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4em;
}

.intro-inline-avatars {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-inline: 0.25rem;
}

.intro-inline-avatar {
  width: clamp(34px, 4.5vw, 44px);
  height: clamp(34px, 4.5vw, 44px);
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--bg-surface);
  box-shadow: 0 2px 6px rgba(20, 17, 15, 0.1);
  margin-inline-end: -10px;
}

.intro-inline-avatar:last-child {
  margin-inline-end: 0;
}

.intro-word-roller {
  display: inline-block;
  height: 1.25em;
  line-height: 1.25;
  overflow: hidden;
  vertical-align: middle;
  position: relative;
  min-width: 3.5ch;
  text-align: center;
}

.intro-word-roller-inner {
  display: flex;
  flex-direction: column;
  position: relative;
  will-change: transform, filter;
}

.intro-roll-word {
  height: 1.25em;
  line-height: 1.25;
  color: var(--text-secondary);
  font-weight: 800;
  white-space: nowrap;
}

.intro-meet-container {
  position: absolute;
  top: 50%;
  inset-inline-start: clamp(2rem, 8vw, 10rem);
  transform: translateY(-50%);
  opacity: 0;
  filter: blur(10px);
  z-index: 25;
  pointer-events: none;
}

.intro-meet-text {
  font-size: clamp(3.2rem, 7.5vw, 6rem);
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.intro-wheel-container {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-end: clamp(2rem, 8vw, 8rem);
  width: clamp(280px, 28vw, 380px);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 30;
  opacity: 0;
  pointer-events: none;
}

.intro-wheel-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(0);
  will-change: transform, filter;
}

.intro-wheel-card {
  width: clamp(270px, 26vw, 360px);
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-card);
  overflow: hidden;
  position: relative;
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-card);
  flex-shrink: 0;
  border: 3px solid transparent;
  transition: border-color 0.25s var(--ease-smooth);
}

.intro-wheel-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.intro-wheel-card.is-selected {
  border-color: var(--accent-orange) !important;
}

.intro-check-badge {
  position: absolute;
  top: 18px;
  inset-inline-end: 18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--accent-orange);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(232, 85, 43, 0.4);
  transform: scale(0);
  z-index: 10;
}

.intro-check-badge svg {
  width: 18px;
  height: 18px;
  stroke: #FFFFFF;
  stroke-width: 2.6;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 900px) {
  .intro-meet-container {
    top: 22%;
    inset-inline-start: 50%;
    transform: translate(-50%, 0);
    text-align: center;
    width: 100%;
  }

  .intro-meet-text {
    font-size: clamp(2.5rem, 8vw, 3.8rem);
  }

  .intro-wheel-container {
    top: 42%;
    bottom: auto;
    height: 52vh;
    inset-inline-end: 50%;
    transform: translateX(50%);
    width: clamp(240px, 75vw, 300px);
  }

  .intro-wheel-card {
    width: clamp(230px, 72vw, 290px);
  }
}
`;
fs.writeFileSync(path.join(stylesDir, 'intro.css'), introCss, 'utf8');

// 4. hero.css
const heroCss = `/* ==========================================================================
   OMAR YAHIA — HERO SECTION & INTERACTIVE 3D PHOTO WHEEL
   ========================================================================== */

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding-block: clamp(6rem, 12vh, 8rem) clamp(3rem, 6vh, 4rem);
  z-index: 5;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
  width: 100%;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  will-change: clip-path, transform;
}

html[dir="rtl"] .hero-content {
  align-items: flex-start;
}

.hero-reveal-mask {
  clip-path: inset(0 0 0% 0);
  transition: none;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-card);
}

.hero-label-dot {
  width: 8px;
  height: 8px;
  background-color: var(--accent-orange);
  border-radius: 50%;
}

.hero-title {
  font-size: clamp(3rem, 7vw, 5.5rem);
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.05;
  letter-spacing: -0.04em;
  margin: 0;
}

.hero-subline {
  font-size: clamp(1.25rem, 2.5vw, 1.85rem);
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.85rem 1.85rem;
  border-radius: var(--radius-pill);
  transition: all 0.25s var(--ease-smooth);
  cursor: pointer;
  position: relative;
  text-decoration: none;
  touch-action: manipulation;
  min-height: 48px;
}

.btn-primary {
  background-color: var(--text-primary);
  color: var(--bg-surface);
  box-shadow: 0 10px 24px -4px rgba(20, 17, 15, 0.18);
  border: 1px solid transparent;
}

.btn-primary:hover {
  background-color: var(--accent-orange);
  color: #FFFFFF;
  box-shadow: 0 12px 28px -4px rgba(232, 85, 43, 0.32);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  border-color: var(--accent-orange);
  color: var(--accent-orange);
  box-shadow: var(--shadow-pill);
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.hero-centerpiece {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 1200px;
}

.hero-wheel-wrapper {
  position: relative;
  width: clamp(280px, 28vw, 380px);
  aspect-ratio: 3 / 4;
}

.hero-3d-card-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: var(--radius-card);
  border: 3px solid var(--accent-orange);
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-wheel);
  overflow: hidden;
  cursor: grab;
  user-select: none;
  transform-style: preserve-3d;
  will-change: transform;
}

.hero-3d-card-container:active {
  cursor: grabbing;
}

#hero-3d-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
}

.hero-card-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  border-radius: calc(var(--radius-card) - 3px);
  will-change: transform, filter;
}

.hero-check-badge {
  position: absolute;
  top: 18px;
  inset-inline-end: 18px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--accent-orange);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(232, 85, 43, 0.45);
  z-index: 10;
  pointer-events: none;
  transform: scale(1);
  transition: transform 0.25s var(--ease-spring);
}

.hero-check-badge svg {
  width: 19px;
  height: 19px;
  stroke: #FFFFFF;
  stroke-width: 2.8;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-wheel-controls {
  position: absolute;
  bottom: -22px;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: var(--bg-surface);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-pill);
  border: 1px solid var(--border-card);
  z-index: 20;
}

html[dir="rtl"] .hero-wheel-controls {
  transform: translateX(50%);
}

.wheel-counter {
  font-family: var(--font-en);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.05em;
  padding-inline: 0.5rem;
  user-select: none;
}

.wheel-nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: all 0.2s var(--ease-smooth);
}

.wheel-nav-btn:hover {
  background-color: var(--accent-orange);
  color: #FFFFFF;
  border-color: var(--accent-orange);
  transform: scale(1.08);
}

.wheel-nav-btn:active {
  transform: scale(0.95);
}

.wheel-nav-btn svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 2.4;
  fill: none;
}

@media (max-width: 900px) {
  .hero-section {
    padding-block: 5.5rem 3rem;
  }

  .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2.5rem;
  }

  .hero-content {
    align-items: center;
    text-align: center;
  }

  html[dir="rtl"] .hero-content {
    align-items: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-wheel-wrapper {
    width: clamp(240px, 75vw, 320px);
  }
}
`;
fs.writeFileSync(path.join(stylesDir, 'hero.css'), heroCss, 'utf8');

// 5. sections.css
const sectionsCss = `/* ==========================================================================
   OMAR YAHIA — SECTIONS STYLES
   Visual Identity: Warm off-white #FBF8F4, Orange #E8552B, Near-Black #14110F
   Sections:
   1. About ("عني") - Bio + orbiting/fanning cards
   2. Photo Gallery ("صوري") - 3D stack/carousel
   3. What I Do ("بعمل إيه") - 3 items only
   4. My Work ("شغلي") - Single large 7P Studio link card
   5. Contact ("تواصل") - Selectable copy cards + magnetic buttons
   6. Footer - Back to top
   ========================================================================== */

section {
  position: relative;
  padding-block: clamp(4.5rem, 10vh, 7.5rem);
  z-index: 2;
}

.section-header {
  margin-bottom: clamp(2.5rem, 5vh, 4rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-orange);
}

.section-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.15;
  letter-spacing: -0.03em;
}

.section-subtitle {
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  color: var(--text-secondary);
  max-width: 600px;
}

/* 1. About Me */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(2.5rem, 6vw, 5rem);
}

.about-bio-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: clamp(2rem, 4vw, 3rem);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-card);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-bio-text {
  font-size: clamp(1.1rem, 1.4vw, 1.25rem);
  line-height: 1.7;
  color: var(--text-primary);
  font-weight: 400;
}

.about-bio-placeholder {
  background-color: rgba(232, 85, 43, 0.06);
  border-inline-start: 3px solid var(--accent-orange);
  padding: 1rem 1.25rem;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

html[dir="rtl"] .about-bio-placeholder {
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
}

.about-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.about-caption {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.about-badge {
  background-color: var(--bg-surface-subtle);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-pill);
}

.about-fan-showcase {
  position: relative;
  height: clamp(380px, 45vh, 480px);
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.fan-card {
  position: absolute;
  width: clamp(200px, 22vw, 260px);
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  background-color: var(--bg-surface);
  border: 2px solid #FFFFFF;
  transition: transform 0.5s var(--ease-smooth), box-shadow 0.5s var(--ease-smooth);
  cursor: pointer;
  will-change: transform;
}

.fan-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fan-card-1 { transform: rotate(-14deg) translate(-50px, 10px) scale(0.9); z-index: 1; }
.fan-card-2 { transform: rotate(-7deg) translate(-25px, 5px) scale(0.95); z-index: 2; }
.fan-card-3 { transform: rotate(0deg) translate(0px, 0px) scale(1); z-index: 5; border-color: var(--accent-orange); }
.fan-card-4 { transform: rotate(7deg) translate(25px, 5px) scale(0.95); z-index: 3; }
.fan-card-5 { transform: rotate(14deg) translate(50px, 10px) scale(0.9); z-index: 2; }
.fan-card-6 { transform: rotate(20deg) translate(75px, 20px) scale(0.85); z-index: 1; }

.about-fan-showcase:hover .fan-card-1 { transform: rotate(-22deg) translate(-95px, 20px) scale(0.92); }
.about-fan-showcase:hover .fan-card-2 { transform: rotate(-11deg) translate(-50px, 10px) scale(0.96); }
.about-fan-showcase:hover .fan-card-3 { transform: rotate(0deg) translate(0px, -12px) scale(1.04); box-shadow: var(--shadow-card-hover); }
.about-fan-showcase:hover .fan-card-4 { transform: rotate(11deg) translate(50px, 10px) scale(0.96); }
.about-fan-showcase:hover .fan-card-5 { transform: rotate(22deg) translate(95px, 20px) scale(0.92); }
.about-fan-showcase:hover .fan-card-6 { transform: rotate(32deg) translate(140px, 35px) scale(0.88); }

/* 2. Photo Gallery */
.gallery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: relative;
}

.gallery-stack-wrapper {
  position: relative;
  width: clamp(280px, 32vw, 380px);
  aspect-ratio: 3 / 4;
  perspective: 1200px;
}

.gallery-stack-card {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-card);
  overflow: hidden;
  background-color: var(--bg-surface);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-card);
  transition: transform 0.45s var(--ease-expo), opacity 0.45s var(--ease-expo), filter 0.45s var(--ease-expo);
  cursor: grab;
  user-select: none;
  will-change: transform, opacity;
}

.gallery-stack-card:active {
  cursor: grabbing;
}

.gallery-stack-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-controls {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.gallery-nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s var(--ease-smooth);
}

.gallery-nav-btn:hover {
  border-color: var(--accent-orange);
  color: var(--accent-orange);
  transform: scale(1.08);
}

.gallery-nav-btn:active {
  transform: scale(0.95);
}

.gallery-nav-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2.2;
  fill: none;
}

html[dir="rtl"] .gallery-nav-btn svg {
  transform: scaleX(-1);
}

.gallery-indicators {
  display: flex;
  gap: 0.45rem;
}

.gallery-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--border-subtle);
  transition: all 0.3s var(--ease-smooth);
  cursor: pointer;
}

.gallery-dot.is-active {
  background-color: var(--accent-orange);
  width: 22px;
  border-radius: var(--radius-pill);
}

.gallery-drag-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* 3. What I Do */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.5rem, 3vw, 2.25rem);
}

.service-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: clamp(2rem, 3.5vw, 2.75rem);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-card);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.35s var(--ease-smooth), box-shadow 0.35s var(--ease-smooth), border-color 0.35s var(--ease-smooth);
  position: relative;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: rgba(232, 85, 43, 0.3);
}

.service-number {
  font-family: var(--font-en);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--accent-orange);
  background-color: var(--accent-orange-soft);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-card-title {
  font-size: clamp(1.25rem, 2vw, 1.55rem);
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.25;
}

.service-card-desc {
  font-size: 0.975rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

/* 4. My Work */
.work-single-container {
  display: flex;
  justify-content: center;
}

.work-main-card {
  width: 100%;
  max-width: 880px;
  background-color: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: clamp(2.5rem, 5vw, 4rem);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-card);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.35s var(--ease-smooth), box-shadow 0.35s var(--ease-smooth), border-color 0.35s var(--ease-smooth);
}

.work-main-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--accent-orange);
}

.work-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.work-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--accent-orange-soft);
  color: var(--accent-orange);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-pill);
}

.work-arrow-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s var(--ease-smooth);
}

.work-main-card:hover .work-arrow-circle {
  background-color: var(--accent-orange);
  color: #FFFFFF;
  transform: scale(1.08) translate(2px, -2px);
}

html[dir="rtl"] .work-main-card:hover .work-arrow-circle {
  transform: scale(1.08) translate(-2px, -2px);
}

.work-arrow-circle svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2.2;
  fill: none;
}

html[dir="rtl"] .work-arrow-circle svg {
  transform: scaleX(-1);
}

.work-main-title {
  font-size: clamp(1.8rem, 3.8vw, 2.75rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.work-main-desc {
  font-size: clamp(1rem, 1.25vw, 1.15rem);
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 680px;
}

.work-url-tag {
  font-family: var(--font-en);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--accent-orange);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

/* 5. Contact */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(1.25rem, 2.5vw, 2rem);
}

.contact-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-card);
  padding: clamp(1.75rem, 3vw, 2.25rem);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-card);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  transition: transform 0.25s var(--ease-smooth), box-shadow 0.25s var(--ease-smooth);
}

.contact-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
}

.contact-card-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.contact-card-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  user-select: all;
  -webkit-user-select: all;
}

.contact-card-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--bg-surface-subtle);
  color: var(--text-primary);
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.45rem 0.95rem;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all 0.2s var(--ease-smooth);
}

.copy-btn:hover {
  background-color: var(--accent-orange);
  color: #FFFFFF;
}

.contact-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--accent-orange);
  text-decoration: none;
  padding: 0.45rem 0.95rem;
  border-radius: var(--radius-pill);
  transition: all 0.2s var(--ease-smooth);
}

.contact-link-btn:hover {
  background-color: var(--accent-orange-soft);
}

.toast-notice {
  position: fixed;
  bottom: 2rem;
  inset-inline-start: 50%;
  transform: translateX(-50%) translateY(30px);
  background-color: var(--text-primary);
  color: #FFFFFF;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: var(--shadow-card);
  z-index: 9999;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s var(--ease-spring);
}

html[dir="rtl"] .toast-notice {
  transform: translateX(50%) translateY(30px);
}

.toast-notice.is-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

html[dir="rtl"] .toast-notice.is-visible {
  transform: translateX(50%) translateY(0);
}

/* 6. Footer */
footer {
  border-top: 1px solid var(--border-subtle);
  padding-block: 2.5rem;
  position: relative;
  z-index: 2;
  margin-top: 4rem;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-copy {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.back-to-top-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 0.55rem 1.2rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.25s var(--ease-smooth);
}

.back-to-top-btn:hover {
  border-color: var(--accent-orange);
  color: var(--accent-orange);
  transform: translateY(-2px);
}

@media (max-width: 960px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }
}
`;
fs.writeFileSync(path.join(stylesDir, 'sections.css'), sectionsCss, 'utf8');

// 6. components.css
const componentsCss = `/* ==========================================================================
   OMAR YAHIA — NAVIGATION & HEADER COMPONENTS
   ========================================================================== */

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding-block: 1.25rem;
  transition: background-color 0.3s var(--ease-smooth), box-shadow 0.3s var(--ease-smooth);
}

.site-header.is-scrolled {
  background-color: rgba(251, 248, 244, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 4px 20px rgba(20, 17, 15, 0.04);
  padding-block: 0.85rem;
}

.nav-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--text-primary);
  text-decoration: none;
}

.nav-brand-dot {
  width: 9px;
  height: 9px;
  background-color: var(--accent-orange);
  border-radius: 50%;
}

.nav-links-pill {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--bg-surface);
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-pill);
  border: 1px solid var(--border-card);
  list-style: none;
}

.nav-link {
  display: inline-block;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  border-radius: var(--radius-pill);
  transition: all 0.2s var(--ease-smooth);
}

.nav-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-surface-subtle);
}

.nav-link.is-active {
  color: var(--accent-orange);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lang-toggle-btn {
  font-family: var(--font-en);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  padding: 0.45rem 0.95rem;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s var(--ease-smooth);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.lang-toggle-btn:hover {
  border-color: var(--accent-orange);
  color: var(--accent-orange);
}

.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
}

.mobile-menu-btn svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 2.2;
}

.mobile-nav-drawer {
  position: fixed;
  inset: 0;
  background-color: rgba(251, 248, 244, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: transform 0.35s var(--ease-expo), opacity 0.35s var(--ease-expo), visibility 0.35s;
}

.mobile-nav-drawer.is-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-drawer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.mobile-drawer-close {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  list-style: none;
}

.mobile-nav-link {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s var(--ease-smooth);
}

.mobile-nav-link:hover {
  color: var(--accent-orange);
}

.mobile-drawer-bottom {
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 860px) {
  .nav-links-pill {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }
}
`;
fs.writeFileSync(path.join(stylesDir, 'components.css'), componentsCss, 'utf8');

// 7. style.css
const styleCss = `/* ==========================================================================
   OMAR YAHIA — MAIN STYLESHEET
   ========================================================================== */

@import './styles/variables.css';
@import './styles/base.css';
@import './styles/components.css';
@import './styles/intro.css';
@import './styles/hero.css';
@import './styles/sections.css';
`;
fs.writeFileSync(path.join(__dirname, '../src/style.css'), styleCss, 'utf8');

console.log('Successfully written all CSS files!');
