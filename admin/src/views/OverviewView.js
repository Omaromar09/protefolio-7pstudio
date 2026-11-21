// ==============================================================================
// 7P STUDIO CONTROL CENTER — OVERVIEW VIEW (OverviewView.js)
// Exact replication of the reference dashboard with real metrics & bilingual RTL
// ==============================================================================

import { HeaderBanner } from '../components/HeaderBanner.js';
import { KpiCards } from '../components/KpiCards.js';
import { TrafficChart } from '../components/TrafficChart.js';
import { TopPages } from '../components/TopPages.js';
import { DevicesDonut } from '../components/DevicesDonut.js';
import { ProjectsWidget } from '../components/ProjectsWidget.js';
import { RecentActivity } from '../components/RecentActivity.js';
import { AlertsStatus } from '../components/AlertsStatus.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { ProjectsService } from '../services/projectsService.js';
import { ActivityService } from '../services/activityService.js';

export class OverviewView {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.timeRange = 'last30';
  }

  async render() {
    const stats = await AnalyticsService.getStats(this.timeRange);
    const projects = await ProjectsService.getProjects();
    const activities = ActivityService.getLogs();

    this.headerBanner = new HeaderBanner(this.timeRange, (newRange) => {
      this.timeRange = newRange;
      const appMain = document.getElementById('view-mount-point');
      if (appMain) {
        this.render().then(html => {
          appMain.innerHTML = html;
          this.attachEvents(appMain);
        });
      }
    });

    this.kpiCards = new KpiCards(stats);
    this.trafficChart = new TrafficChart(stats.trafficChart);
    this.topPages = new TopPages(stats.topPages, this.onNavigate);
    this.devicesDonut = new DevicesDonut(stats.devices);
    this.projectsWidget = new ProjectsWidget(projects, this.onNavigate);
    this.recentActivity = new RecentActivity(activities, this.onNavigate);
    this.alertsStatus = new AlertsStatus(stats, this.onNavigate);

    return `
      <div class="overview-view-container">
        <!-- Greeting Header Banner -->
        ${this.headerBanner.render()}

        <!-- Row 1: 4 KPI Cards -->
        ${this.kpiCards.render()}

        <!-- Row 2: Analytics Grid (Traffic Chart, Top Pages, Devices Donut) -->
        <div class="row-analytics-grid">
          <div class="glass-panel traffic-chart-panel">
            ${this.trafficChart.render()}
          </div>
          <div class="glass-panel top-pages-panel">
            ${this.topPages.render()}
          </div>
          <div class="glass-panel devices-panel">
            ${this.devicesDonut.render()}
          </div>
        </div>

        <!-- Row 3: Operations Grid (Projects Management, Recent Activity, Alerts & Status) -->
        <div class="row-operations-grid">
          <div class="glass-panel projects-widget-panel">
            ${this.projectsWidget.render()}
          </div>
          <div class="glass-panel activity-widget-panel">
            ${this.recentActivity.render()}
          </div>
          <div class="glass-panel alerts-widget-panel">
            ${this.alertsStatus.render()}
          </div>
        </div>
      </div>
    `;
  }

  attachEvents(container) {
    if (this.headerBanner) this.headerBanner.attachEvents(container);
    if (this.topPages) this.topPages.attachEvents(container);
    if (this.projectsWidget) this.projectsWidget.attachEvents(container);
    if (this.recentActivity) this.recentActivity.attachEvents(container);
    if (this.alertsStatus) this.alertsStatus.attachEvents(container);
  }
}
