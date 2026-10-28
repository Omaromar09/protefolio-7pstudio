import { showToast } from './toast.js';
import { getLanguage } from './i18n.js';

/**
 * Theme Switcher Module (Light / Dark Mode)
 * Persists user preference in localStorage and toggles data-theme attribute
 */

let currentTheme = 'light';

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme, silent = false) {
  if (theme !== 'light' && theme !== 'dark') return;
  currentTheme = theme;
  try {
    localStorage.setItem('omar_theme', theme);
  } catch (e) {}

  document.documentElement.setAttribute('data-theme', theme);

  updateThemeIcons(theme);

  // Dispatch themechange event for 3D scenes & canvas
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
  icons.forEach((icon) => {
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#FBBF24'; // Warm amber sun
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = '#7C3AED'; // Violet moon
    }
  });
}

export function initTheme() {
  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('omar_theme') || 'light';
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
}
