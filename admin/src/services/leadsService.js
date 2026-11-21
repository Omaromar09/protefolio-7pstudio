// ==============================================================================
// 7P STUDIO CONTROL CENTER — LEADS & INQUIRIES SERVICE (leadsService.js)
// Real messages inbox: Zero fake/mock entries. Displays real incoming inquiries.
// ==============================================================================

import { supabase, isSupabaseConfigured, getLocalData, setLocalData } from './db.js';
import { ActivityService } from './activityService.js';
import { NotificationsService } from './notificationsService.js';

const LEADS_STORAGE_KEY = 'leads_list';

// Empty by default - No mock or fabricated customer messages!
const INITIAL_LEADS = [];

// Filter out any legacy dummy names
function filterRealLeads(list) {
  if (!Array.isArray(list)) return [];
  const dummyNames = ['tarek mansour', 'sarah el-sayed', 'ahmed yassin', 'karim mostafa', 'youssef el-shennawy'];
  return list.filter(l => {
    const n = (l.name || '').toLowerCase();
    return !dummyNames.some(d => n.includes(d));
  });
}

export const LeadsService = {
  async getLeads() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data) return filterRealLeads(data);
      } catch (e) {
        console.warn('[LeadsService] Supabase fetch error, fallback to local:', e);
      }
    }
    const local = getLocalData(LEADS_STORAGE_KEY, null);
    if (!local) {
      setLocalData(LEADS_STORAGE_KEY, INITIAL_LEADS);
      return INITIAL_LEADS;
    }
    const cleaned = filterRealLeads(local);
    if (cleaned.length !== local.length) {
      setLocalData(LEADS_STORAGE_KEY, cleaned);
    }
    return cleaned;
  },

  async addLead(leadData) {
    const newLead = {
      id: 'lead_' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'new',
      priority: 'normal',
      is_read: false,
      is_starred: false,
      is_archived: false,
      notes: [],
      ...leadData
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('leads').insert([newLead]).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('[LeadsService] Supabase insert error:', e);
      }
    }

    const leads = await this.getLeads();
    leads.unshift(newLead);
    setLocalData(LEADS_STORAGE_KEY, leads);

    NotificationsService.addNotification({
      type: 'lead',
      title: 'New lead from website',
      message: `${newLead.name} submitted an inquiry for ${newLead.project_type || 'Website'}`,
      link: '/admin/#leads',
      severity: 'info'
    });

    ActivityService.logAction({
      action: 'new_lead',
      category: 'lead',
      details: `New lead received: ${newLead.name} (${newLead.project_type})`
    });

    return newLead;
  },

  async updateLeadStatus(id, newStatus) {
    const validStatuses = ['new', 'contacted', 'discussion', 'proposal_sent', 'in_progress', 'completed', 'rejected'];
    if (!validStatuses.includes(newStatus)) return;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (e) {
        console.warn('[LeadsService] Supabase update status error:', e);
      }
    }

    const leads = await this.getLeads();
    const target = leads.find(l => String(l.id) === String(id));
    if (target) {
      target.status = newStatus;
      target.updated_at = new Date().toISOString();
      setLocalData(LEADS_STORAGE_KEY, leads);

      ActivityService.logAction({
        action: 'lead_status_changed',
        category: 'lead',
        details: `Updated status of ${target.name} to "${newStatus}"`
      });
    }
  },

  async toggleRead(id, isRead) {
    const leads = await this.getLeads();
    const target = leads.find(l => String(l.id) === String(id));
    if (target) {
      target.is_read = isRead;
      setLocalData(LEADS_STORAGE_KEY, leads);
    }
  },

  async addNote(id, noteText, author = 'Omar') {
    const leads = await this.getLeads();
    const target = leads.find(l => String(l.id) === String(id));
    if (target) {
      if (!target.notes) target.notes = [];
      const note = {
        id: 'note_' + Date.now(),
        author,
        text: noteText,
        created_at: new Date().toISOString()
      };
      target.notes.push(note);
      setLocalData(LEADS_STORAGE_KEY, leads);
      return note;
    }
  },

  async deleteLead(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').delete().eq('id', id);
      } catch (e) {}
    }
    const leads = await this.getLeads();
    const updated = leads.filter(l => String(l.id) !== String(id));
    setLocalData(LEADS_STORAGE_KEY, updated);

    ActivityService.logAction({
      action: 'lead_deleted',
      category: 'lead',
      details: `Lead #${id} deleted`
    });
  },

  async getUnreadCount() {
    const leads = await this.getLeads();
    return leads.filter(l => !l.is_read && !l.is_archived).length;
  },

  exportToCSV(leads) {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Status', 'Message', 'Date', 'Source'];
    const rows = leads.map(l => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.project_type || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      l.status,
      `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      l.created_at,
      l.source_url || '7pstudio.tech'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `7p_studio_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
