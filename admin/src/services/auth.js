// ==============================================================================
// 7P STUDIO CONTROL CENTER — AUTHENTICATION & RBAC (auth.js)
// Roles: 'owner' | 'admin' | 'editor'
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';

const AUTH_STORAGE_KEY = 'admin_session';

// Master default studio owner credentials
const DEFAULT_USER = {
  id: 'usr_7p_owner',
  name: '7P Studio Admin',
  email: 'admin@7pstudio.tech',
  role: 'owner',
  avatar: '/src/assets/logo-7p.png'
};

export const AuthService = {
  getCurrentUser() {
    const session = getLocalData(AUTH_STORAGE_KEY);
    if (session && session.user) {
      return session.user;
    }
    // Default logged in session for initial ease of administration
    return DEFAULT_USER;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  login(email, password) {
    // In a full Supabase environment, this can call supabase.auth.signInWithPassword
    // Here we support studio owner credentials
    if (email === 'admin@7pstudio.tech' || email.includes('7pstudio.tech') || email === 'owner@7pstudio.tech') {
      const user = {
        ...DEFAULT_USER,
        email
      };
      setLocalData(AUTH_STORAGE_KEY, { user, token: 'token_' + Date.now() });
      return { success: true, user };
    }
    
    // Allow any demo login if password provided
    if (password && password.length >= 4) {
      const user = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        role: email.includes('editor') ? 'editor' : (email.includes('admin') ? 'admin' : 'owner'),
        avatar: '/src/assets/logo-7p.png'
      };
      setLocalData(AUTH_STORAGE_KEY, { user, token: 'token_' + Date.now() });
      return { success: true, user };
    }

    return { success: false, error: 'Invalid credentials. Password must be at least 4 characters.' };
  },

  logout() {
    localStorage.removeItem('7p_studio_' + AUTH_STORAGE_KEY);
    window.location.reload();
  },

  hasRole(allowedRoles = []) {
    const user = this.getCurrentUser();
    if (!user) return false;
    if (user.role === 'owner') return true; // Owner has all permissions
    return allowedRoles.includes(user.role);
  },

  canEditSettings() {
    return this.hasRole(['owner', 'admin']);
  },

  canManageProjects() {
    return this.hasRole(['owner', 'admin', 'editor']);
  },

  canManageLeads() {
    return this.hasRole(['owner', 'admin']);
  },

  canManageUsers() {
    return this.hasRole(['owner']);
  }
};
