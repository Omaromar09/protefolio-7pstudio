// ==============================================================================
// 7P STUDIO CONTROL CENTER — RECENT ACTIVITY WIDGET (RecentActivity.js)
// Timeline with glowing track & events matching reference design
// ==============================================================================

export class RecentActivity {
  constructor(activities, onNavigate) {
    this.activities = activities || [];
    this.onNavigate = onNavigate;
  }

  render() {
    const list = this.activities.slice(0, 4);

    return `
      <div class="card-panel-header">
        <div class="card-panel-title">
          <i class="fa-solid fa-bolt"></i>
          <span>Recent Activity</span>
        </div>
        <span class="card-header-link" id="view-all-activity-link">View All →</span>
      </div>

      <div class="activity-timeline">
        <!-- Entry 1: New lead from contact form -->
        <div class="timeline-entry">
          <div class="timeline-icon-node lead">
            <i class="fa-regular fa-envelope"></i>
          </div>
          <div class="timeline-content-box">
            <div class="timeline-title-text">New lead from contact form</div>
            <div class="timeline-time-ago">2 minutes ago</div>
          </div>
        </div>

        <!-- Entry 2: Project updated -->
        <div class="timeline-entry">
          <div class="timeline-icon-node">
            <i class="fa-solid fa-pen"></i>
          </div>
          <div class="timeline-content-box">
            <div class="timeline-title-text">Project "E-Commerce Store" updated</div>
            <div class="timeline-time-ago">12 minutes ago</div>
          </div>
        </div>

        <!-- Entry 3: Visitor from Egypt -->
        <div class="timeline-entry">
          <div class="timeline-icon-node">
            <span style="font-size: 0.95rem;">🇪🇬</span>
          </div>
          <div class="timeline-content-box">
            <div class="timeline-title-text">New visitor from Egypt</div>
            <div class="timeline-time-ago">18 minutes ago</div>
          </div>
        </div>

        <!-- Entry 4: Website deployed successfully -->
        <div class="timeline-entry">
          <div class="timeline-icon-node success">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="timeline-content-box">
            <div class="timeline-title-text">Website deployed successfully</div>
            <div class="timeline-time-ago">1 hour ago</div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    const link = container.querySelector('#view-all-activity-link');
    if (link && this.onNavigate) {
      link.addEventListener('click', () => this.onNavigate('activity'));
    }
  }
}
