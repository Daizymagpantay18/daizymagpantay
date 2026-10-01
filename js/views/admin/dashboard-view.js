// Admin Dashboard Home View Component
const AdminDashboardView = {
  name: 'AdminDashboardView',
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
      recentProjects: [],
      activityLogs: [],
      isLoading: true
    };
  },
  computed: {
    adminName() {
      return (AppStore.auth.admin && AppStore.auth.admin.name) ? AppStore.auth.admin.name : 'ADMIN';
    },
    greeting() {
      const hour = new Date().getHours();
      if (hour < 12) return 'GOOD MORNING';
      if (hour < 18) return 'GOOD AFTERNOON';
      return 'GOOD EVENING';
    }
  },
  async mounted() {
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      this.isLoading = true;
      const [analyticsRes, projectsRes, activityRes] = await Promise.all([
        AppController.getAnalytics(),
        AppController.getProjects({ status: 'all' }),
        AppController.getActivityLogs(8)
      ]);

      if (analyticsRes && analyticsRes.stats) {
        this.stats = analyticsRes.stats;
      }
      if (projectsRes && projectsRes.data) {
        this.recentProjects = projectsRes.data.slice(0, 5);
      }
      if (activityRes && activityRes.data) {
        this.activityLogs = activityRes.data;
      }
      this.isLoading = false;
    },
    formatDate(dateStr) {
      return AppModel.formatDateTime(dateStr);
    }
  },
  template: `
    <div class="space-y-8">
      <!-- Top Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-space text-white tracking-tight">
            {{ greeting }}, {{ adminName.toUpperCase() }}
          </h1>
          <p class="text-sm text-neutral-400 font-inter mt-1">
            Manage your portfolio content, interactive case studies, and live transmissions.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <router-link 
            to="/admin/projects/new" 
            class="px-4 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)]"
          >
            <app-icon name="plus" :size="15" />
            <span>Add Project</span>
          </router-link>
        </div>
      </div>

      <!-- Minimal Elegant Statistics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Stat 1: Total Projects -->
        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-space tracking-widest text-[#F28C28] uppercase font-semibold">TOTAL PROJECTS</span>
            <div class="w-8 h-8 rounded-lg bg-[#181818] border border-white/5 flex items-center justify-center text-[#F28C28]">
              <app-icon name="folder-git-2" :size="16" />
            </div>
          </div>
          <div class="text-3xl font-bold font-space text-white">
            {{ stats.total_projects }}
          </div>
          <div class="text-xs font-inter text-neutral-400">
            <span class="text-emerald-400 font-medium">{{ stats.published_projects }}</span> Published on showcase
          </div>
        </div>

        <!-- Stat 2: Total Skills -->
        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-space tracking-widest text-[#F28C28] uppercase font-semibold">TOTAL SKILLS</span>
            <div class="w-8 h-8 rounded-lg bg-[#181818] border border-white/5 flex items-center justify-center text-[#F28C28]">
              <app-icon name="cpu" :size="16" />
            </div>
          </div>
          <div class="text-3xl font-bold font-space text-white">
            {{ stats.total_skills }}
          </div>
          <div class="text-xs font-inter text-neutral-400">
            Organized in 6 categories
          </div>
        </div>

        <!-- Stat 3: Total Messages -->
        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-space tracking-widest text-[#F28C28] uppercase font-semibold">TOTAL MESSAGES</span>
            <div class="w-8 h-8 rounded-lg bg-[#181818] border border-white/5 flex items-center justify-center text-[#F28C28]">
              <app-icon name="mail" :size="16" />
            </div>
          </div>
          <div class="text-3xl font-bold font-space text-white">
            {{ stats.total_messages }}
          </div>
          <div class="text-xs font-inter text-neutral-400">
            <span class="text-[#FFB347] font-medium">{{ stats.unread_messages }}</span> Unread inquiries
          </div>
        </div>

        <!-- Stat 4: Profile Views -->
        <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-space tracking-widest text-[#F28C28] uppercase font-semibold">PROFILE VIEWS</span>
            <div class="w-8 h-8 rounded-lg bg-[#181818] border border-white/5 flex items-center justify-center text-[#F28C28]">
              <app-icon name="eye" :size="16" />
            </div>
          </div>
          <div class="text-3xl font-bold font-space text-white">
            {{ stats.profile_views }}
          </div>
          <div class="text-xs font-inter text-neutral-400">
            Live visitor engagement
          </div>
        </div>

      </div>

      <!-- Main Two Column Grid: Recent Projects & Activity Stream -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left (Cols 1-8): Recent Projects Table -->
        <div class="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <div class="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <h2 class="text-lg font-bold font-space text-white">Recent Projects</h2>
              <p class="text-xs text-neutral-400 font-inter">Live portfolio showcase entries</p>
            </div>
            <router-link to="/admin/projects" class="text-xs font-space text-[#FFB347] hover:underline flex items-center gap-1">
              <span>View All Projects</span>
              <app-icon name="arrow-right" :size="14" />
            </router-link>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm font-inter">
              <thead>
                <tr class="text-[11px] font-space uppercase tracking-wider text-neutral-400 border-b border-white/5">
                  <th class="pb-3 font-semibold">Project</th>
                  <th class="pb-3 font-semibold">Category</th>
                  <th class="pb-3 font-semibold">Status</th>
                  <th class="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="proj in recentProjects" :key="proj.id" class="group hover:bg-white/[0.02] transition-colors">
                  <td class="py-3.5 pr-4">
                    <div class="flex items-center gap-3">
                      <img :src="proj.cover_image || 'assets/images/project-default.svg'" class="w-10 h-10 rounded-lg object-cover bg-[#181818] border border-white/10 shrink-0" />
                      <div>
                        <span class="block font-space font-semibold text-white group-hover:text-[#FFB347] transition-colors">
                          {{ proj.title }}
                        </span>
                        <span class="block text-xs text-neutral-500 font-space">
                          PROJECT {{ proj.project_number || '01' }} • {{ proj.year }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 pr-4 text-xs text-neutral-300 font-space">
                    {{ proj.category }}
                  </td>
                  <td class="py-3.5 pr-4">
                    <status-badge :status="proj.status" size="sm" />
                  </td>
                  <td class="py-3.5 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <router-link 
                        :to="'/admin/projects/edit/' + proj.id"
                        class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                        title="Edit Project"
                      >
                        <app-icon name="edit-3" :size="14" />
                      </router-link>
                    </div>
                  </td>
                </tr>

                <tr v-if="recentProjects.length === 0">
                  <td colspan="4" class="py-8 text-center text-xs text-neutral-500 font-space">
                    No projects found. Click "Add Project" to create your first showcase!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right (Cols 9-12): Recent Activity Feed -->
        <div class="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <div class="border-b border-white/[0.06] pb-4">
            <h2 class="text-lg font-bold font-space text-white">Recent Activity</h2>
            <p class="text-xs text-neutral-400 font-inter">Audit stream &amp; system actions</p>
          </div>

          <div class="space-y-4">
            <div 
              v-for="log in activityLogs" 
              :key="log.id"
              class="flex items-start gap-3 p-3 rounded-xl bg-[#141414] border border-white/[0.04]"
            >
              <div class="w-7 h-7 rounded-lg bg-[#1a1a1a] border border-white/5 flex items-center justify-center shrink-0 text-[#F28C28] mt-0.5">
                <app-icon name="activity" :size="13" />
              </div>
              <div class="space-y-1">
                <p class="text-xs text-neutral-200 font-inter leading-tight">
                  {{ log.description }}
                </p>
                <span class="block text-[10px] font-space text-neutral-500">
                  {{ formatDate(log.created_at) }}
                </span>
              </div>
            </div>

            <div v-if="activityLogs.length === 0" class="text-center py-6 text-xs text-neutral-500 font-space">
              No recent activity logs recorded yet.
            </div>
          </div>
        </div>

      </div>
    </div>
  `
};
