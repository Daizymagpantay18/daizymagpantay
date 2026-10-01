// Admin Analytics View Component
const AdminAnalyticsView = {
  name: 'AdminAnalyticsView',
  data() {
    return {
      stats: {
        total_projects: 0,
        published_projects: 0,
        total_skills: 0,
        total_messages: 0,
        unread_messages: 0,
        profile_views: 0
      },
      chartData: [],
      topProjects: [],
      recentVisitors: [],
      isLoading: true
    };
  },
  async mounted() {
    await this.loadAnalytics();
  },
  methods: {
    async loadAnalytics() {
      this.isLoading = true;
      const res = await AppController.getAnalytics();
      if (res && res.success) {
        this.stats = res.stats || this.stats;
        this.chartData = res.chart_data || [];
        this.topProjects = res.top_projects || [];
        this.recentVisitors = res.recent_visitors || [];
      }
      this.isLoading = false;
    },
    formatDate(dateStr) {
      return AppModel.formatDateTime(dateStr);
    }
  },
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <page-header 
        title="Visitor Analytics &amp; Telemetry" 
        subtitle="Minimalist telemetry tracking visitor traffic, case study reads, and transmission metrics."
      />

      <!-- Overview Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-2">
          <span class="text-[10px] font-space tracking-widest text-[#F28C28] uppercase font-bold">TOTAL PORTFOLIO VIEWS</span>
          <div class="text-3xl font-bold font-space text-white">{{ stats.profile_views }}</div>
          <p class="text-xs text-neutral-400 font-inter">Total lifetime impressions</p>
        </div>

        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-2">
          <span class="text-[10px] font-space tracking-widest text-[#F28C28] uppercase font-bold">SHOWCASE PROJECTS</span>
          <div class="text-3xl font-bold font-space text-white">{{ stats.published_projects }}</div>
          <p class="text-xs text-neutral-400 font-inter">Live case studies active</p>
        </div>

        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-2">
          <span class="text-[10px] font-space tracking-widest text-[#F28C28] uppercase font-bold">INQUIRY TRANSMISSIONS</span>
          <div class="text-3xl font-bold font-space text-white">{{ stats.total_messages }}</div>
          <p class="text-xs text-neutral-400 font-inter">{{ stats.unread_messages }} unread transmissions</p>
        </div>

        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] space-y-2">
          <span class="text-[10px] font-space tracking-widest text-emerald-400 uppercase font-bold">SYSTEM UPTIME</span>
          <div class="text-3xl font-bold font-space text-emerald-400">99.9%</div>
          <p class="text-xs text-neutral-400 font-inter">XAMPP Apache / MySQL</p>
        </div>
      </div>

      <!-- Traffic Chart & Top Projects Split -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left: Traffic Chart Simulation (Cols 1-7) -->
        <div class="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <div class="border-b border-white/[0.06] pb-4">
            <h2 class="text-base font-bold font-space text-white">Daily Traffic (Past 7 Days)</h2>
            <p class="text-xs text-neutral-400 font-inter">Visitor sessions by day</p>
          </div>

          <!-- Minimal Bar Visual -->
          <div class="pt-6">
            <div class="flex items-end justify-between gap-3 h-48 border-b border-white/10 pb-2">
              <div 
                v-for="d in chartData" 
                :key="d.date"
                class="flex-1 flex flex-col items-center gap-2 group"
              >
                <div class="text-[10px] font-space text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ d.views }}
                </div>
                <div 
                  class="w-full rounded-t-lg bg-gradient-to-t from-[#F28C28]/40 to-[#FFB347] group-hover:from-[#F28C28] group-hover:to-[#FFB347] transition-all"
                  :style="{ height: Math.max(15, (d.views / 50) * 100) + '%' }"
                ></div>
                <span class="text-[10px] font-space uppercase text-neutral-400">{{ d.day }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Most Viewed Projects (Cols 8-12) -->
        <div class="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <div class="border-b border-white/[0.06] pb-4">
            <h2 class="text-base font-bold font-space text-white">Most Viewed Projects</h2>
            <p class="text-xs text-neutral-400 font-inter">Ranked by case study reader engagement</p>
          </div>

          <div class="space-y-3">
            <div 
              v-for="(p, idx) in topProjects" 
              :key="p.id"
              class="flex items-center justify-between p-3 rounded-xl bg-[#161616] border border-white/[0.04]"
            >
              <div class="flex items-center gap-3">
                <span class="w-6 h-6 rounded-lg bg-[#222] text-[#F28C28] font-space font-bold text-xs flex items-center justify-center">
                  {{ idx + 1 }}
                </span>
                <div>
                  <span class="block font-space font-semibold text-xs text-white">{{ p.title }}</span>
                  <span class="block text-[10px] font-space text-neutral-400">{{ p.category }}</span>
                </div>
              </div>

              <div class="text-right">
                <span class="text-xs font-space font-bold text-[#FFB347]">{{ p.views_count || 0 }}</span>
                <span class="block text-[9px] font-space text-neutral-500 uppercase">Reads</span>
              </div>
            </div>

            <div v-if="topProjects.length === 0" class="text-center py-6 text-xs text-neutral-500 font-space">
              No project reads recorded yet.
            </div>
          </div>
        </div>

      </div>

      <!-- Recent Visitor Telemetry Table -->
      <div class="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
        <div class="border-b border-white/[0.06] pb-4">
          <h2 class="text-base font-bold font-space text-white">Recent Telemetry Ingress</h2>
          <p class="text-xs text-neutral-400 font-inter">Access requests and browser metadata</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-inter">
            <thead>
              <tr class="text-[10px] font-space uppercase tracking-wider text-neutral-400 border-b border-white/5">
                <th class="pb-3 font-semibold">Path</th>
                <th class="pb-3 font-semibold">Visitor IP</th>
                <th class="pb-3 font-semibold">User Agent</th>
                <th class="pb-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="(v, vIdx) in recentVisitors" :key="vIdx" class="hover:bg-white/[0.02]">
                <td class="py-2.5 font-space text-[#FFB347]">{{ v.page_path }}</td>
                <td class="py-2.5 font-space text-neutral-300">{{ v.visitor_ip }}</td>
                <td class="py-2.5 text-neutral-400 truncate max-w-xs">{{ v.user_agent }}</td>
                <td class="py-2.5 text-right font-space text-neutral-500">{{ formatDate(v.viewed_at) }}</td>
              </tr>
              <tr v-if="recentVisitors.length === 0">
                <td colspan="4" class="py-6 text-center text-neutral-500 font-space">No visitor logs recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
};
