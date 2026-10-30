import { showToast } from './toast.js';
import { getLanguage } from './i18n.js';

/**
 * ==========================================================================
 * 7P STUDIO — THEME SWITCHER MODULE
 * Dark Mode is the DEFAULT and primary mode for everyone on first visit.
 * Switches to Light Mode on user toggle.
 * Persists in localStorage (with try/catch) and updates meta theme-color.
 * ==========================================================================
 */

let currentTheme = 'dark';

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme, silent = false) {
  if (theme !== 'light' && theme !== 'dark') return;
  currentTheme = theme;

  try {
    localStorage.setItem('omar_theme', theme);
  } catch (e) {
    console.warn('localStorage not accessible for theme persistence:', e);
  }

  document.documentElement.setAttribute('data-theme', theme);

  // Update meta theme-color per mode
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#07060C' : '#F4F2FA');
  }

  updateThemeIcons(theme);

  // Dispatch themechange event for Three.js 3D scenes & canvas
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

  if (!silent) {
    const isAr = getLanguage() === 'ar';
    const message = theme === 'dark' 
      ? (isAr ? 'تم تفعيل الوضع الليلي 🌙' : 'Dark Mode Enabled 🌙')
      : (isAr ? 'تم تفعيل الوضع الفاتح ☀️' : 'Light Mode Enabled ☀️');
    showToast(message);
  }
}

export function toggleTheme() {
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  return nextTheme;
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('#theme-icon, #mobile-theme-icon');
  const desktopBtn = document.getElementById('theme-toggle');
  const mobileBtn = document.getElementById('mobile-theme-toggle');
  const isAr = getLanguage() === 'ar';

  icons.forEach((icon) => {
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#FBBF24'; // Luminous warm amber sun
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = '#8B3DFF'; // Vivid royal violet moon
    }
  });

  const label = theme === 'dark'
    ? (isAr ? 'تفعيل الوضع الفاتح' : 'Switch to Light Mode')
    : (isAr ? 'تفعيل الوضع الليلي' : 'Switch to Dark Mode');

  if (desktopBtn) {
    desktopBtn.setAttribute('title', label);
    desktopBtn.setAttribute('aria-label', label);
  }
  if (mobileBtn) {
    mobileBtn.setAttribute('title', label);
    mobileBtn.setAttribute('aria-label', label);
  }
}

export function initTheme() {
  let savedTheme = 'dark';
  try {
    const stored = localStorage.getItem('omar_theme');
    if (stored === 'light' || stored === 'dark') {
      savedTheme = stored;
    } else {
      savedTheme = 'dark'; // Strict Default
    }
  } catch (e) {
    savedTheme = 'dark';
  }

  setTheme(savedTheme, true);

  const desktopBtn = document.getElementById('theme-toggle');
  const mobileBtn = document.getElementById('mobile-theme-toggle');

  if (desktopBtn) {
    desktopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  window.addEventListener('languagechange', () => {
    updateThemeIcons(currentTheme);
  });
}
