// ==============================================================================
// 7P STUDIO CONTROL CENTER — LOGIN SCREEN (LoginScreen.js)
// Master Protected Access Screen with Obsidian Dark & Warm Orange Glow
// ==============================================================================

import { AuthService } from '../services/auth.js';

export class LoginScreen {
  constructor(onLoginSuccess) {
    this.onLoginSuccess = onLoginSuccess;
  }

  render() {
    return `
      <div class="login-screen-overlay">
        <div class="login-card-container">
          <!-- Logo & Brand Header -->
          <div class="login-brand-header">
            <div class="login-logo-circle">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <h2>7P STUDIO</h2>
            <p class="login-sub-title">Control Center • لوحة التحكم المركزية</p>
          </div>

          <!-- Login Form -->
          <form class="login-form" id="master-login-form">
            <div id="login-error-box" class="login-error-alert" style="display: none;"></div>

            <!-- Username Field -->
            <div class="login-input-group">
              <label for="login-username">اسم المستخدم (Username)</label>
              <div class="login-input-wrapper">
                <i class="fa-solid fa-user input-icon"></i>
                <input type="text" id="login-username" placeholder="7pstudio" autocomplete="username" required autofocus />
              </div>
            </div>

            <!-- Password Field -->
            <div class="login-input-group">
              <label for="login-password">كلمة المرور (Password)</label>
              <div class="login-input-wrapper">
                <i class="fa-solid fa-lock input-icon"></i>
                <input type="password" id="login-password" placeholder="••••••" autocomplete="current-password" required />
                <button type="button" class="toggle-password-btn" id="toggle-password-btn" title="إظهار/إخفاء">
                  <i class="fa-regular fa-eye"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="login-submit-btn" id="login-submit-btn">
              <span>تسجيل الدخول للنظام</span>
              <i class="fa-solid fa-arrow-left" style="margin-right: 8px;"></i>
            </button>
          </form>

          <!-- Footer Security Note -->
          <div class="login-footer-security">
            <i class="fa-solid fa-shield-halved"></i>
            <span>نظام محمي ومخصص فقط لإدارة استوديو 7P STUDIO</span>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const form = container.querySelector('#master-login-form');
    const userInput = container.querySelector('#login-username');
    const passInput = container.querySelector('#login-password');
    const errorBox = container.querySelector('#login-error-box');
    const togglePassBtn = container.querySelector('#toggle-password-btn');

    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePassBtn.querySelector('i').className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = userInput.value.trim();
        const password = passInput.value.trim();

        const result = AuthService.login(username, password);
        if (result.success) {
          if (this.onLoginSuccess) this.onLoginSuccess();
        } else {
          errorBox.textContent = result.error;
          errorBox.style.display = 'block';
          passInput.value = '';
          passInput.focus();
        }
      });
    }
  }
}
