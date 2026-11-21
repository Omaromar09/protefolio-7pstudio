// ==============================================================================
// 7P STUDIO — REAL EVENT TRACKER (realTracker.js)
// Zero fake data: Tracks actual visitors, pageviews, and project outbound clicks
// ==============================================================================

const STORAGE_KEY = '7p_real_analytics';

export function getRealAnalytics() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}

  // Initialize clean real baseline (zero fake numbers)
  const initial = {
    totalVisitors: 1,
    pageViews: 1,
    sessions: 1,
    projectClicks: {
      aya: 0,
      elara: 0,
      flowers: 0,
      festival: 0,
      kayan: 0,
      elveranda: 0,
      rawnaq: 0,
      xops: 0
    },
    devices: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    sources: {
      direct: 1,
      social: 0,
      whatsapp: 0,
      referral: 0
    },
    history: []
  };
  saveRealAnalytics(initial);
  return initial;
}

export function saveRealAnalytics(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

export function initRealTracker() {
  const analytics = getRealAnalytics();
  const sessionKey = '7p_session_active';
  const hasActiveSession = sessionStorage.getItem(sessionKey);

  // Detect device
  const ua = navigator.userAgent || '';
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua);
  const isMobile = !isTablet && /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(ua);
  const deviceType = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

  if (!hasActiveSession) {
    sessionStorage.setItem(sessionKey, 'true');
    analytics.totalVisitors = (analytics.totalVisitors || 0) + 1;
    analytics.sessions = (analytics.sessions || 0) + 1;
    analytics.devices[deviceType] = (analytics.devices[deviceType] || 0) + 1;

    // Detect referrer
    const ref = document.referrer ? document.referrer.toLowerCase() : '';
    if (ref.includes('tiktok') || ref.includes('instagram') || ref.includes('facebook')) {
      analytics.sources.social = (analytics.sources.social || 0) + 1;
    } else if (ref.includes('whatsapp') || ref.includes('wa.me')) {
      analytics.sources.whatsapp = (analytics.sources.whatsapp || 0) + 1;
    } else if (ref && !ref.includes(window.location.hostname)) {
      analytics.sources.referral = (analytics.sources.referral || 0) + 1;
    } else {
      analytics.sources.direct = (analytics.sources.direct || 0) + 1;
    }
  }

  analytics.pageViews = (analytics.pageViews || 0) + 1;
  saveRealAnalytics(analytics);

  // Send to backend API
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: 'page_view',
      pagePath: window.location.pathname,
      referrer: document.referrer,
      device: deviceType
    })
  }).catch(() => {});

  // Setup click listeners on all project showcase live links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;

    const href = link.href.toLowerCase();
    let matchedId = null;

    if (href.includes('aya-accessories')) matchedId = 'aya';
    else if (href.includes('elara-omardemo')) matchedId = 'elara';
    else if (href.includes('demo-flowershop')) matchedId = 'flowers';
    else if (href.includes('festival-pastry')) matchedId = 'festival';
    else if (href.includes('kayan-clothes')) matchedId = 'kayan';
    else if (href.includes('elvaranda')) matchedId = 'elveranda';
    else if (href.includes('demo-perfume-sigma')) matchedId = 'rawnaq';
    else if (href.includes('demoplaystaion')) matchedId = 'xops';

    if (matchedId) {
      trackProjectOutboundClick(matchedId);
    }
  });
}

export function trackProjectOutboundClick(projectId) {
  const analytics = getRealAnalytics();
  if (!analytics.projectClicks) analytics.projectClicks = {};
  analytics.projectClicks[projectId] = (analytics.projectClicks[projectId] || 0) + 1;
  saveRealAnalytics(analytics);

  // Also update project clicks in 7p_studio_projects_list
  try {
    const projects = JSON.parse(localStorage.getItem('7p_studio_projects_list') || '[]');
    const target = projects.find(p => p.id === projectId);
    if (target) {
      target.viewsCount = (target.viewsCount || 0) + 1;
      localStorage.setItem('7p_studio_projects_list', JSON.stringify(projects));
    }
  } catch (e) {}

  // Log to serverless /api/track
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: 'project_click',
      projectId,
      pagePath: window.location.pathname
    })
  }).catch(() => {});
}
