// ==============================================================================
// 7P STUDIO CONTROL CENTER — LEADS & INQUIRIES SERVICE (leadsService.js)
// Critical Module: Ingestion, Pipeline Transitions, Notes, Search, CSV Export
// ==============================================================================

import { supabase, isSupabaseConfigured, getLocalData, setLocalData } from './db.js';
import { ActivityService } from './activityService.js';
import { NotificationsService } from './notificationsService.js';

const LEADS_STORAGE_KEY = 'leads_list';

// Realistic initial leads matching dashboard reference metrics
const INITIAL_LEADS = [
  {
    id: 'lead_1',
    name: 'Tarek Mansour',
    email: 'tarek@mansourgroup.com',
    phone: '+201098765432',
    project_type: 'E-Commerce Store',
    budget: '$1,500 - $3,000',
    message: 'We need a high-end luxury fashion store with WhatsApp checkout and 3D product showcase.',
    status: 'new',
    priority: 'urgent',
    is_read: false,
    is_starred: true,
    form_name: 'portfolio-contact',
    source_url: 'https://7pstudio.tech/',
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    notes: [
      { id: 'n1', author: 'Admin', text: 'Spoke on WhatsApp, interested in the ÉLARA style template.', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'lead_2',
    name: 'Sarah El-Sayed',
    email: 'sarah.design@gmail.com',
    phone: '+201123456789',
    project_type: 'Creative Portfolio',
    budget: '$800 - $1,500',
    message: 'Architect looking for an editorial interactive portfolio with subtle 3D models of architectural projects.',
    status: 'discussion',
    priority: 'high',
    is_read: true,
    is_starred: false,
    form_name: 'estimator',
    quote_id: '#7P-Q9412',
    source_url: 'https://7pstudio.tech/#estimator',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    notes: []
  },
  {
    id: 'lead_3',
    name: 'Ahmed Yassin',
    email: 'ayassin@fintech-eg.com',
    phone: '+201200001122',
    project_type: 'Corporate Web Platform',
    budget: '$3,000+',
    message: 'Redesigning our fintech services website with high security, bilingual Arabic/English, and fast speed.',
    status: 'proposal_sent',
    priority: 'normal',
    is_read: true,
    is_starred: true,
    form_name: 'portfolio-contact',
    source_url: 'https://7pstudio.tech/',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    notes: [
      { id: 'n2', author: 'Admin', text: 'Sent formal proposal PDF with 10 business day timeline.', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'lead_4',
    name: 'Karim Mostafa',
    email: 'k.mostafa@cairocoffee.co',
    phone: '+201011223344',
    project_type: 'Restaurant / Cafe Menu',
    budget: '$600 - $1,000',
    message: 'Specialty coffee shop needing digital QR menu + branches map.',
    status: 'contacted',
    priority: 'normal',
    is_read: true,
    is_starred: false,
    form_name: 'estimator',
    quote_id: '#7P-Q3051',
    source_url: 'https://7pstudio.tech/#estimator',
    created_at: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    notes: []
  },
  {
    id: 'lead_5',
    name: 'Youssef El-Shennawy',
    email: 'youssef@gaminghub.net',
    phone: '+201550998877',
    project_type: 'Gaming Lounge Platform',
    budget: '$1,200 - $2,000',
    message: 'Saw your XO PS Lounge project. We want a similar room reservation system for our Alexandria branch.',
    status: 'in_progress',
    priority: 'high',
    is_read: true,
    is_starred: false,
    form_name: 'portfolio-contact',
    source_url: 'https://7pstudio.tech/',
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    notes: []
  }
];

export const LeadsService = {
  async getLeads() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('[LeadsService] Supabase fetch error, fallback to local:', e);
      }
    }
    const local = getLocalData(LEADS_STORAGE_KEY, null);
    if (!local) {
      setLocalData(LEADS_STORAGE_KEY, INITIAL_LEADS);
      return INITIAL_LEADS;
    }
    return local;
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
      title: 'New lead from contact form',
      message: `${newLead.name} submitted an inquiry for ${newLead.project_type || 'Website'}`,
      link: '/admin/#leads',
      severity: 'info'
    });

    ActivityService.logAction({
      action: 'new_lead',
      category: 'lead',
      details: `New lead: ${newLead.name} (${newLead.project_type})`
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

  async addNote(id, noteText, author = 'Admin') {
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
