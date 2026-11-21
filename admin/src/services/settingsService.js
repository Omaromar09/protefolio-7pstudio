// ==============================================================================
// 7P STUDIO CONTROL CENTER — SETTINGS SERVICE (settingsService.js)
// Studio configurations, integrations, maintenance mode, SEO defaults
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';
import { ActivityService } from './activityService.js';

const SETTINGS_STORAGE_KEY = 'site_settings';

const INITIAL_SETTINGS = {
  general: {
    studioName: '7P STUDIO',
    tagline: 'Modern Web Development Studio',
    websiteUrl: 'https://7pstudio.tech',
    contactEmail: 'contact@7pstudio.tech',
    whatsappPhone: '+201515047449',
    primaryLocation: 'Egypt / Worldwide'
  },
  website: {
    maintenanceMode: false,
    analyticsEnabled: true,
    soundEffectsEnabled: true,
    cursorEffectsEnabled: true
  },
  seo: {
    metaTitle: '7P STUDIO — Modern Web Development Studio',
    metaDescription: 'استوديو 7P Studio لتصميم وتطوير مواقع الويب التفاعلية 3D، المتاجر الإلكترونية السريعة وسلات الشراء المباشرة.',
    ogImage: '/og-image.jpg',
    canonicalUrl: 'https://7pstudio.tech/'
  },
  integrations: {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    vercelConnected: true,
    vercelDomain: '7pstudio.tech',
    resendConfigured: false
  }
};

export const SettingsService = {
  getSettings() {
    const local = getLocalData(SETTINGS_STORAGE_KEY, null);
    if (!local) {
      setLocalData(SETTINGS_STORAGE_KEY, INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    return local;
  },

  updateSettings(category, updates) {
    const settings = this.getSettings();
    if (settings[category]) {
      settings[category] = { ...settings[category], ...updates };
      setLocalData(SETTINGS_STORAGE_KEY, settings);

      ActivityService.logAction({
        action: 'settings_updated',
        category: 'settings',
        details: `Updated ${category} settings`
      });

      return settings[category];
    }
  }
};
