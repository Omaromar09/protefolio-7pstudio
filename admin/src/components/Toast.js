// ==============================================================================
// 7P STUDIO CONTROL CENTER — TOAST NOTIFICATIONS (Toast.js)
// ==============================================================================

export const AdminToast = {
  show(message, type = 'success', duration = 3500) {
    const root = document.getElementById('toast-root');
    if (!root) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;

    const iconMap = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-exclamation',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };

    const colorMap = {
      success: 'var(--status-green)',
      error: 'var(--status-red)',
      warning: 'var(--status-amber)',
      info: 'var(--accent-orange)'
    };

    toast.innerHTML = `
      <i class="${iconMap[type] || iconMap.info}" style="color: ${colorMap[type] || colorMap.info}; font-size: 1.1rem;"></i>
      <span style="flex: 1; line-height: 1.35;">${message}</span>
    `;

    root.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
};
