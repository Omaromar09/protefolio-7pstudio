// ==============================================================================
// 7P STUDIO CONTROL CENTER — AUTHENTICATION & ACCESS GATE (auth.js)
// Master Protected Credentials:
// Username: 7pstudio (or 7psudio)
// Password: 010010
// ==============================================================================

const AUTH_KEY = '7p_admin_auth_session';

export const AuthService = {
  isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true' || sessionStorage.getItem(AUTH_KEY) === 'true';
  },

  login(username, password) {
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    // Support both 7pstudio and 7psudio typo + exact password 010010
    if ((cleanUser === '7pstudio' || cleanUser === '7psudio') && cleanPass === '010010') {
      localStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }

    return { 
      success: false, 
      error: 'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات والمحاولة مجدداً.' 
    };
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
  },

  getCurrentUser() {
    return {
      name: '7P STUDIO Master',
      username: '7pstudio',
      role: 'owner',
      avatar: '/src/assets/logo-7p.png'
    };
  }
};
