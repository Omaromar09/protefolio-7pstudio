// ==============================================================================
// 7P STUDIO CONTROL CENTER — LEADS & INQUIRIES SERVICE (leadsService.js)
// Real messages inbox: Zero fake/mock entries. Displays real incoming inquiries.
// Real-time synchronization across tabs and Supabase WebSocket channels
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
    let cloudLeads = [];

    // 1. If Supabase is configured client-side
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          cloudLeads = filterRealLeads(data);
        }
      } catch (e) {
        console.warn('[LeadsService] Supabase fetch error, fallback to local:', e);
      }
    }

    // 2. Fetch from Serverless /api/leads
    if (cloudLeads.length === 0) {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const json = await res.json();
          if (json.configured && Array.isArray(json.leads) && json.leads.length > 0) {
            cloudLeads = filterRealLeads(json.leads);
          }
        }
      } catch (apiErr) {}
    }

    // 3. Local Storage leads (direct from browser)
    const local = getLocalData(LEADS_STORAGE_KEY, null) || [];
    const cleanedLocal = filterRealLeads(local);

    // Merge without duplicates by id or timestamp+name
    const mergedMap = new Map();
    cleanedLocal.forEach(l => mergedMap.set(l.id || (l.name + '_' + l.created_at), l));
    cloudLeads.forEach(l => mergedMap.set(l.id || (l.name + '_' + l.created_at), l));

    const result = Array.from(mergedMap.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (result.length > 0) {
      setLocalData(LEADS_STORAGE_KEY, result);
    }

    return result;
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

    ActivityService.logAction({
      action: 'new_lead',
      category: 'lead',
      details: `طلب مشروع جديد من "${newLead.name}" (${newLead.project_type || 'طلب عام'})`
    });

    NotificationsService.addNotification({
      title: 'طلب مشروع جديد 🚀',
      message: `${newLead.name} أرسل تفاصيل مشروع جديد: ${newLead.project_type}`,
      type: 'lead',
      action_url: '#leads'
    });

    return newLead;
  },

  async updateLeadStatus(id, newStatus) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leads').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
      } catch (e) {}
    }

    const leads = await this.getLeads();
    const target = leads.find(l => String(l.id) === String(id));
    if (target) {
      target.status = newStatus;
      target.updated_at = new Date().toISOString();
      setLocalData(LEADS_STORAGE_KEY, leads);
    }
    return target;
  },

  async toggleStar(id) {
    const leads = await this.getLeads();
    const target = leads.find(l => String(l.id) === String(id));
    if (target) {
      target.is_starred = !target.is_starred;
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('leads').update({ is_starred: target.is_starred }).eq('id', id);
        } catch (e) {}
      }
      setLocalData(LEADS_STORAGE_KEY, leads);
    }
    return target;
  },

  async toggleRead(id, status = true) {
    const leads = await this.getLeads();
    const target = leads.find(l => String(l.id) === String(id));
    if (target) {
      target.is_read = status;
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('leads').update({ is_read: status }).eq('id', id);
        } catch (e) {}
      }
      setLocalData(LEADS_STORAGE_KEY, leads);
    }
    return target;
  },

  async addNote(id, noteText, author = 'Admin') {
    const leads = await this.getLeads();
    const target = leads.find(l => String(l.id) === String(id));
    if (target) {
      if (!Array.isArray(target.notes)) target.notes = [];
      const note = {
        id: 'note_' + Date.now(),
        text: noteText,
        author,
        created_at: new Date().toISOString()
      };
      target.notes.push(note);
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('leads').update({ notes: target.notes }).eq('id', id);
        } catch (e) {}
      }
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
  },

  exportToCSV(leads) {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Project Type', 'Status', 'Date', 'Message'];
    const rows = leads.map(l => [
      `"${l.id || ''}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.project_type || ''}"`,
      `"${l.status || ''}"`,
      `"${l.created_at || ''}"`,
      `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `7P_STUDIO_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Setup Realtime WebSocket Listener via Supabase
  setupRealtimeListener(onNewLead) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const channel = supabase
        .channel('realtime:leads')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
          if (payload && payload.new && onNewLead) {
            onNewLead(payload.new);
          }
        })
        .subscribe();
      return channel;
    } catch (err) {
      console.warn('[LeadsService] Realtime channel setup warning:', err);
      return null;
    }
  }
};
