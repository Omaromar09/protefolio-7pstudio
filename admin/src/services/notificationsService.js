// ==============================================================================
// 7P STUDIO CONTROL CENTER — NOTIFICATIONS SERVICE (notificationsService.js)
// Central notification bus with unread counters, toasts, and alert feeds
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';

const NOTIFICATIONS_STORAGE_KEY = 'notifications_list';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'lead',
    title: 'New lead from contact form',
    message: 'Tarek Mansour submitted inquiry for E-Commerce Store with WhatsApp request.',
    link: '#leads',
    is_read: false,
    severity: 'info',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_2',
    type: 'alert',
    title: 'Contact form delivery needs attention',
    message: 'Some messages are not being delivered to email inbox. Check your webhook or Resend key.',
    link: '#settings',
    is_read: false,
    severity: 'warning',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  },
  {
    id: 'notif_3',
    type: 'deployment',
    title: 'Deployment Successful',
    message: 'Your site is up and running perfectly on Vercel at 7pstudio.tech.',
    link: '#deployment',
    is_read: false,
    severity: 'success',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];

export const NotificationsService = {
  getNotifications() {
    const local = getLocalData(NOTIFICATIONS_STORAGE_KEY, null);
    if (!local) {
      setLocalData(NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return local;
  },

  getUnreadCount() {
    const list = this.getNotifications();
    return list.filter(n => !n.is_read).length;
  },

  addNotification(notif) {
    const list = this.getNotifications();
    const item = {
      id: 'notif_' + Date.now(),
      created_at: new Date().toISOString(),
      is_read: false,
      ...notif
    };
    list.unshift(item);
    setLocalData(NOTIFICATIONS_STORAGE_KEY, list);
    window.dispatchEvent(new CustomEvent('7p-notification', { detail: item }));
    return item;
  },

  markAsRead(id) {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.is_read = true;
      setLocalData(NOTIFICATIONS_STORAGE_KEY, list);
      window.dispatchEvent(new CustomEvent('7p-notifications-updated'));
    }
  },

  markAllAsRead() {
    const list = this.getNotifications();
    list.forEach(n => { n.is_read = true; });
    setLocalData(NOTIFICATIONS_STORAGE_KEY, list);
    window.dispatchEvent(new CustomEvent('7p-notifications-updated'));
  }
};
