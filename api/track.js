// ==============================================================================
// 7P STUDIO — LIGHTWEIGHT ANALYTICS EVENT INGESTION
// Endpoint: POST /api/track
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      eventName = 'page_view',
      pagePath = '/',
      referrer = '',
      device = 'desktop',
      browser = 'Unknown',
      sessionId = ''
    } = req.body || {};

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('analytics_events').insert([
        {
          event_name: eventName,
          page_path: pagePath,
          referrer: referrer,
          device: device,
          browser: browser,
          session_id: sessionId,
          country: 'EG',
          created_at: new Date().toISOString()
        }
      ]);
    }

    return res.status(200).json({ tracked: true });
  } catch (err) {
    return res.status(200).json({ tracked: false, error: err.message });
  }
}
