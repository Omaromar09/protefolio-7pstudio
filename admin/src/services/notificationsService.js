// ==============================================================================
// 7P STUDIO CONTROL CENTER — NOTIFICATIONS SERVICE (notificationsService.js)
// Central notification bus with deduplication and unread counters
// ==============================================================================

import { getLocalData, setLocalData } from './db.js';

const NOTIFICATIONS_STORAGE_KEY = 'notifications_list';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    type: 'system',
    title: 'لوحة التحكم متصلة بالسحابة 🚀',
    message: 'تم تفعيل قاعدة البيانات السحابية والمزامنة اللحظية بنجاح.',
    link: '#leads',
    is_read: false,
    severity: 'success',
    created_at: new Date().toISOString()
  }
];

export const NotificationsService = {
  getNotifications() {
    let local = getLocalData(NOTIFICATIONS_STORAGE_KEY, null);
    // If someone has more than 50 spam notifications from the loop, clean up
    if (!local || (Array.isArray(local) && local.length > 30)) {
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
    
    // Deduplicate by title + message
    const isDuplicate = list.some(n => n.title === notif.title && n.message === notif.message && (Date.now() - new Date(n.created_at).getTime() < 60000));
    if (isDuplicate) return null;

    const item = {
      id: 'notif_' + Date.now(),
      created_at: new Date().toISOString(),
      is_read: false,
      ...notif
    };
    list.unshift(item);
    if (list.length > 50) list.pop();
    setLocalData(NOTIFICATIONS_STORAGE_KEY, list);
    window.dispatchEvent(new CustomEvent('7p-notifications-updated'));
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
  },

  clearAll() {
    setLocalData(NOTIFICATIONS_STORAGE_KEY, []);
    window.dispatchEvent(new CustomEvent('7p-notifications-updated'));
  }
};
