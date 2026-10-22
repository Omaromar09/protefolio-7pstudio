import confetti from 'canvas-confetti';

export function fireSuccessConfetti(originX = 0.5, originY = 0.7) {
  const count = 180;
  const defaults = {
    origin: { x: originX, y: originY },
    zIndex: 99999
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // 7P Brand Spectrum: Electric Magenta, Pure Cyber Cyan, Royal Violet, Starlight White
  fire(0.28, {
    spread: 30,
    startVelocity: 55,
    colors: ['#E02BFB', '#7C3AED', '#00F0FF']
  });
  fire(0.22, {
    spread: 60,
    colors: ['#00F0FF', '#38BDF8', '#E02BFB']
  });
  fire(0.32, {
    spread: 100,
    decay: 0.91,
    scalar: 0.85,
    colors: ['#7C3AED', '#FFFFFF', '#E02BFB']
  });
  fire(0.18, {
    spread: 120,
    startVelocity: 28,
    decay: 0.92,
    scalar: 1.15,
    colors: ['#E02BFB', '#00F0FF', '#6366F1']
  });
}
