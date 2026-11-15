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

  // 7P Brand Spectrum: Luxury Amber Gold, Terracotta, Ivory & Champagne
  fire(0.28, {
    spread: 30,
    startVelocity: 55,
    colors: ['#E8A33D', '#C8431F', '#F5BA5B']
  });
  fire(0.22, {
    spread: 60,
    colors: ['#E8A33D', '#ECE7DD', '#C8431F']
  });
  fire(0.32, {
    spread: 100,
    decay: 0.91,
    scalar: 0.85,
    colors: ['#C8431F', '#FFFFFF', '#E8A33D']
  });
  fire(0.18, {
    spread: 120,
    startVelocity: 28,
    decay: 0.92,
    scalar: 1.15,
    colors: ['#E8A33D', '#F5BA5B', '#C8431F']
  });
}
