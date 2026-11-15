export function showToast(message, iconType = 'check') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconHtml = '<i class="fa-solid fa-check" style="color: var(--accent-amber);"></i>';
  if (iconType === 'error' || iconType === 'warning') {
    iconHtml = '<i class="fa-solid fa-circle-exclamation" style="color: #DE5E39;"></i>';
  } else if (iconType === 'info') {
    iconHtml = '<i class="fa-solid fa-circle-info" style="color: var(--accent-amber);"></i>';
  }

  toast.innerHTML = `<span class="toast-icon">${iconHtml}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger reflow & show
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 3200);
}
