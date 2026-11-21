// ==============================================================================
// 7P STUDIO CONTROL CENTER — DATABASE & DATA STORAGE LAYER (db.js)
// Supabase PostgreSQL Client with Reactive Resilient Local Fallback Engine
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

// Environment variables with active cloud fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fvsvlajnngwdptosvfat.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_37c7ysGfzAC7pPYbtHMVCA_xrebnczT';

let supabase = null;
let isSupabaseConfigured = false;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseConfigured = true;
  } catch (err) {
    console.warn('[7P DB] Supabase initialization failed, falling back to local store:', err);
  }
}

// Local Storage Helper with prefix
const STORAGE_PREFIX = '7p_studio_';

export function getLocalData(key, fallback = null) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
}

export function setLocalData(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[7P DB] Failed to save ${key} locally:`, e);
  }
}

export { supabase, isSupabaseConfigured };
