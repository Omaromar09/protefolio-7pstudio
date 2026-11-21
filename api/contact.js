// ==============================================================================
// 7P STUDIO — SERVERLESS CONTACT & LEAD INGESTION API
// Endpoint: POST /api/contact
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

// Simple in-memory rate limiting for serverless cold-starts
const rateLimitMap = new Map();

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const userRecord = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > userRecord.resetAt) {
    userRecord.count = 1;
    userRecord.resetAt = now + windowMs;
  } else {
    userRecord.count += 1;
  }
  rateLimitMap.set(ip, userRecord);

  return userRecord.count > maxRequests;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
      return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
    }

    const {
      name,
      contact,
      email,
      phone,
      message,
      projectType,
      budget,
      features,
      turnaround,
      quoteId,
      sourceUrl,
      formName = 'portfolio-contact'
    } = req.body || {};

    if (!name || (!contact && !phone && !email) || (!message && formName !== 'estimator')) {
      return res.status(400).json({ error: 'Please provide your name, contact information, and details.' });
    }

    // Auto-detect email vs phone in the contact string
    let resolvedEmail = email || null;
    let resolvedPhone = phone || null;
    if (contact) {
      if (contact.includes('@')) {
        resolvedEmail = contact.trim();
      } else {
        resolvedPhone = contact.trim();
      }
    }

    const leadPayload = {
      name: String(name).trim().slice(0, 150),
      email: resolvedEmail ? String(resolvedEmail).trim().slice(0, 150) : null,
      phone: resolvedPhone ? String(resolvedPhone).trim().slice(0, 50) : null,
      project_type: projectType ? String(projectType).slice(0, 100) : 'General Inquiry',
      budget: budget ? String(budget).slice(0, 50) : null,
      message: message ? String(message).trim().slice(0, 2000) : (quoteId ? `Configured Quote ${quoteId}` : 'Quote Request'),
      features: Array.isArray(features) ? features : [],
      turnaround: turnaround ? String(turnaround).slice(0, 100) : null,
      quote_id: quoteId ? String(quoteId).slice(0, 50) : null,
      source_url: sourceUrl ? String(sourceUrl).slice(0, 255) : 'https://7pstudio.tech/',
      form_name: String(formName).slice(0, 50),
      status: 'new',
      priority: 'normal',
      is_read: false,
      ip_address: typeof ip === 'string' ? ip.split(',')[0].trim() : 'unknown',
      user_agent: req.headers['user-agent'] || 'unknown',
      created_at: new Date().toISOString()
    };

    // Attempt to persist to Supabase if configured
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    let savedLead = null;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.from('leads').insert([leadPayload]).select().single();
        if (!error && data) {
          savedLead = data;
        } else if (error) {
          console.error('[Supabase Save Error]:', error);
        }
      } catch (dbErr) {
        console.error('[Supabase Client Exception]:', dbErr);
      }
    }

    // Optional Email Notification via Resend if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@7pstudio.tech';
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: '7P Studio Leads <leads@7pstudio.tech>',
            to: [adminEmail],
            subject: `[New Lead] ${leadPayload.name} (${leadPayload.project_type})`,
            html: `
              <div style="font-family: sans-serif; background: #080808; color: #fff; padding: 24px; border-radius: 8px;">
                <h2 style="color: #FF8500; margin-top: 0;">7P STUDIO — New Lead Received</h2>
                <p><strong>Name:</strong> ${leadPayload.name}</p>
                <p><strong>Phone / WhatsApp:</strong> ${leadPayload.phone || 'N/A'}</p>
                <p><strong>Email:</strong> ${leadPayload.email || 'N/A'}</p>
                <p><strong>Project:</strong> ${leadPayload.project_type}</p>
                <p><strong>Details:</strong></p>
                <blockquote style="background: #171717; padding: 12px; border-left: 3px solid #FF8500;">
                  ${leadPayload.message}
                </blockquote>
                <p style="color: #888; font-size: 12px;">Submitted at ${new Date().toLocaleString()} from ${leadPayload.source_url}</p>
                <a href="https://7pstudio.tech/admin/#leads" style="display: inline-block; background: #FF8500; color: #000; font-weight: bold; padding: 10px 18px; border-radius: 6px; text-decoration: none; margin-top: 12px;">Open in Control Center</a>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.warn('[Email Notification Error (Skipping)]:', emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry successfully registered',
      lead: savedLead || leadPayload
    });
  } catch (error) {
    console.error('[API Contact Fatal Error]:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
