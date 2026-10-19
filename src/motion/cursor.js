import gsap from 'gsap';

export function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');

  if (!cursor || !follower) return;

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Follower smooth lerp loop
  function updateFollower() {
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateFollower);
  }
  requestAnimationFrame(updateFollower);

  // Click pulse
  window.addEventListener('mousedown', () => {
    follower.classList.add('is-clicking');
  });

  window.addEventListener('mouseup', () => {
    follower.classList.remove('is-clicking');
  });

  // Hover states for interactive items
  const interactiveTargets = document.querySelectorAll(
    'a, button, .interactive-hover, .skill-tag, .project-card, input, select, textarea'
  );

  interactiveTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      follower.classList.add('is-hovering');
    });
    target.addEventListener('mouseleave', () => {
      follower.classList.remove('is-hovering');
    });
  });

  // Magnetic elements
  const magneticEls = document.querySelectorAll('.magnetic, .btn, .btn-icon, .filter-btn');

  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: relX * 0.32,
        y: relY * 0.32,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}
