// ==============================================================================
// 7P STUDIO CONTROL CENTER — ANALYTICS SERVICE (analyticsService.js)
// Calibrated with real metrics from the reference design & time range filtering
// ==============================================================================

export const AnalyticsService = {
  getStats(timeRange = 'last30') {
    // Multipliers for realistic filtering
    const multipliers = {
      today: 0.04,
      yesterday: 0.045,
      last7: 0.28,
      last30: 1.0,
      last90: 2.85,
      year: 10.5
    };

    const factor = multipliers[timeRange] || 1.0;

    return {
      kpis: {
        totalVisitors: {
          raw: Math.round(48700 * factor),
          display: factor === 1.0 ? '48.7K' : (factor < 0.1 ? (48.7 * factor).toFixed(1) + 'K' : Math.round(48.7 * factor) + 'K'),
          change: '+12.5%',
          sparkline: [20, 24, 22, 28, 25, 32, 30, 38, 35, 42, 40, 48.7]
        },
        pageViews: {
          raw: Math.round(128400 * factor),
          display: factor === 1.0 ? '128.4K' : (factor < 0.1 ? (128.4 * factor).toFixed(1) + 'K' : Math.round(128.4 * factor) + 'K'),
          change: '+18.3%',
          sparkline: [40, 52, 48, 65, 59, 78, 72, 92, 86, 110, 105, 128.4]
        },
        projects: {
          raw: 24,
          display: '24',
          change: '+0%',
          sparkline: [22, 22, 22, 23, 23, 23, 24, 24, 24, 24, 24, 24]
        },
        newLeads: {
          raw: Math.round(352 * factor),
          display: String(Math.round(352 * factor)),
          change: '+22.7%',
          sparkline: [12, 16, 14, 20, 18, 24, 22, 28, 26, 31, 29, 35.2]
        }
      },
      trafficChart: {
        labels: ['Oct 01', 'Oct 07', 'Oct 14', 'Oct 21', 'Oct 30'],
        visitors: [18000, 26000, 24000, 36000, 31000, 48700],
        pageviews: [28000, 42000, 39000, 58000, 51000, 84000]
      },
      topPages: [
        { rank: 1, name: 'Home', path: '/', views: '42.8K', growth: '+20%' },
        { rank: 2, name: 'Projects', path: '#projects', views: '31.4K', growth: '+17%' },
        { rank: 3, name: 'Services', path: '#services', views: '28.9K', growth: '+15%' },
        { rank: 4, name: 'About Us', path: '#about', views: '12.6K', growth: '+11%' },
        { rank: 5, name: 'Contact', path: '#contact', views: '10.3K', growth: '+9%' }
      ],
      devices: {
        totalSessions: factor === 1.0 ? '68.4K' : Math.round(68.4 * factor) + 'K',
        items: [
          { name: 'Desktop', percentage: 58.5, color: '#FF8500' },
          { name: 'Mobile', percentage: 37.2, color: '#71717A' },
          { name: 'Tablet', percentage: 4.3, color: '#27272A' }
        ]
      },
      trafficSources: [
        { name: 'Direct Traffic (7pstudio.tech)', percentage: '44%', count: '21.4K' },
        { name: 'Social (TikTok @7p.studio6)', percentage: '32%', count: '15.6K' },
        { name: 'WhatsApp Referrals', percentage: '14%', count: '6.8K' },
        { name: 'Instagram & Portfolio Mentions', percentage: '10%', count: '4.9K' }
      ],
      countries: [
        { name: 'Egypt', code: 'EG', flag: '🇪🇬', share: '68%' },
        { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', share: '14%' },
        { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', share: '9%' },
        { name: 'United States & Other', code: 'US', flag: '🌐', share: '9%' }
      ]
    };
  }
};
