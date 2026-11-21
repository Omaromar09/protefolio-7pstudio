// ==============================================================================
// 7P STUDIO CONTROL CENTER — ACTIVITY & AUDIT LOG SERVICE (activityService.js)
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';

const ACTIVITY_STORAGE_KEY = 'activity_logs';

const INITIAL_LOGS = [
  {
    id: 'act_1',
    action: 'new_lead',
    user_name: 'Visitor Tarek M.',
    user_role: 'public',
    category: 'lead',
    details: 'New lead from contact form',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 mins ago
  },
  {
    id: 'act_2',
    action: 'project_updated',
    user_name: 'Admin (7P Studio)',
    user_role: 'owner',
    category: 'project',
    details: 'Project "E-Commerce Store" updated',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString() // 12 mins ago
  },
  {
    id: 'act_3',
    action: 'visitor_geo',
    user_name: 'Visitor EG-Cairo',
    user_role: 'public',
    category: 'analytics',
    details: 'New visitor from Egypt',
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString() // 18 mins ago
  },
  {
    id: 'act_4',
    action: 'deployment_success',
    user_name: 'Vercel Bot',
    user_role: 'system',
    category: 'deployment',
    details: 'Website deployed successfully',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
  }
];

export const ActivityService = {
  getLogs() {
    const local = getLocalData(ACTIVITY_STORAGE_KEY, null);
    if (!local) {
      setLocalData(ACTIVITY_STORAGE_KEY, INITIAL_LOGS);
      return INITIAL_LOGS;
    }
    return local;
  },

  logAction({ action, category, details, user_name = 'Admin', user_role = 'owner' }) {
    const logs = this.getLogs();
    const newLog = {
      id: 'act_' + Date.now(),
      action,
      category,
      details,
      user_name,
      user_role,
      created_at: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    setLocalData(ACTIVITY_STORAGE_KEY, logs);
    return newLog;
  }
};
