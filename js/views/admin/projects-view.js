// Admin Projects Management View Component
const AdminProjectsView = {
  name: 'AdminProjectsView',
  data() {
    return {
      projects: [],
      searchQuery: '',
      statusFilter: 'all',
      isLoading: true
    };
  },
  async mounted() {
    await this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.isLoading = true;
      const res = await AppController.getProjects({
        status: this.statusFilter,
        search: this.searchQuery
      });
      if (res && res.data) {
        this.projects = res.data;
      }
      this.isLoading = false;
    },
    async toggleStatus(proj) {
      const nextStatus = proj.status === 'Published' ? 'Draft' : 'Published';
      const res = await AppController.toggleProjectStatus(proj.id, nextStatus);
      if (res && res.success) {
        proj.status = nextStatus;
        AppAlerts.toast(`Project set to ${nextStatus}.`);
      } else {
        AppAlerts.toast('Could not change project status.', 'error');
      }
    },
    async deleteProject(proj) {
      const confirmed = await AppAlerts.confirm(`Delete "${proj.title}"?`, 'This will permanently remove this project and its screenshots.');
      if (confirmed) {
        const res = await AppController.deleteProject(proj.id);
        if (res && res.success) {
          AppAlerts.toast('Project deleted successfully.');
          await this.fetchProjects();
        } else {
          AppAlerts.toast(res.message || 'Failed to delete project.', 'error');
        }
      }
    },
    previewPublic(proj) {
      AppStore.openProjectModal(proj);
    }
  },
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <page-header 
        title="Project Management" 
        subtitle="Curate and orchestrate your portfolio project showcases, case studies, and live demonstrations."
        :badge="projects.length + ' ITEMS'"
      >
        <template #actions>
          <router-link 
            to="/admin/projects/new" 
            class="px-4 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)]"
          >
            <app-icon name="plus" :size="16" />
            <span>+ Add Project</span>
          </router-link>
        </template>
      </page-header>

      <!-- Search & Filter Controls -->
      <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <!-- Search Input -->
        <div class="w-full sm:w-80 relative">
          <input 
            v-model="searchQuery" 
            @input="fetchProjects"
            type="text" 
            placeholder="Search projects or technologies..." 
            class="w-full px-4 py-2.5 pl-10 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] transition-colors"
          />
          <app-icon name="search" :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button 
            @click="statusFilter = 'all'; fetchProjects()"
            class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors"
            :class="statusFilter === 'all' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
          >
            All
          </button>
          <button 
            @click="statusFilter = 'Published'; fetchProjects()"
            class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors"
            :class="statusFilter === 'Published' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
          >
            Published
          </button>
          <button 
            @click="statusFilter = 'Draft'; fetchProjects()"
            class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors"
            :class="statusFilter === 'Draft' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
          >
            Draft
          </button>
        </div>
      </div>

      <!-- Project List Table -->
      <div class="rounded-3xl bg-[#111111] border border-white/[0.08] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm font-inter">
            <thead>
              <tr class="text-[11px] font-space uppercase tracking-wider text-neutral-400 bg-[#141414] border-b border-white/5">
                <th class="py-4 px-6 font-semibold">Project Details</th>
                <th class="py-4 px-4 font-semibold">Category</th>
                <th class="py-4 px-4 font-semibold">Tech Stack</th>
                <th class="py-4 px-4 font-semibold">Views</th>
                <th class="py-4 px-4 font-semibold">Status</th>
                <th class="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="proj in projects" :key="proj.id" class="group hover:bg-white/[0.02] transition-colors">
                <!-- Thumbnail & Details -->
                <td class="py-4 px-6">
                  <div class="flex items-center gap-4">
                    <img 
                      :src="proj.cover_image || 'assets/images/project-default.svg'" 
                      class="w-14 h-14 rounded-xl object-cover bg-[#181818] border border-white/10 shrink-0" 
                    />
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] font-space text-[#F28C28] font-bold">PROJECT {{ proj.project_number || '01' }}</span>
                        <span class="text-neutral-600">•</span>
                        <span class="text-[10px] font-space text-neutral-500">{{ proj.year }}</span>
                      </div>
                      <span class="block font-space font-bold text-white group-hover:text-[#FFB347] transition-colors">
                        {{ proj.title }}
                      </span>
                      <p class="text-xs text-neutral-400 line-clamp-1 max-w-sm mt-0.5">
                        {{ proj.short_description }}
                      </p>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="py-4 px-4 text-xs font-space text-neutral-300">
                  {{ proj.category }}
                </td>

                <!-- Tech Tags -->
                <td class="py-4 px-4">
                  <div class="flex flex-wrap gap-1 max-w-xs">
                    <span 
                      v-for="t in (proj.technologies || []).slice(0, 3)" 
                      :key="t"
                      class="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-space text-neutral-400"
                    >
                      {{ t }}
                    </span>
                    <span v-if="(proj.technologies || []).length > 3" class="text-[10px] font-space text-neutral-500 self-center">
                      +{{ (proj.technologies || []).length - 3 }}
                    </span>
                  </div>
                </td>

                <!-- Views -->
                <td class="py-4 px-4 text-xs font-space text-neutral-300">
                  {{ proj.views_count || 0 }}
                </td>

                <!-- Status Pill -->
                <td class="py-4 px-4">
                  <status-badge :status="proj.status" size="sm" />
                </td>

                <!-- Actions -->
                <td class="py-4 px-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="previewPublic(proj)" 
                      class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#FFB347] transition-colors"
                      title="Preview Case Study Overlay"
                    >
                      <app-icon name="eye" :size="15" />
                    </button>

                    <button 
                      @click="toggleStatus(proj)" 
                      class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                      :title="proj.status === 'Published' ? 'Unpublish to Draft' : 'Publish to Showcase'"
                    >
                      <app-icon :name="proj.status === 'Published' ? 'eye-off' : 'check'" :size="15" />
                    </button>

                    <router-link 
                      :to="'/admin/projects/edit/' + proj.id"
                      class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#F28C28] transition-colors"
                      title="Edit Project"
                    >
                      <app-icon name="edit-3" :size="15" />
                    </router-link>

                    <button 
                      @click="deleteProject(proj)" 
                      class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete Project"
                    >
                      <app-icon name="trash-2" :size="15" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="projects.length === 0">
                <td colspan="6" class="py-12 text-center text-sm text-neutral-500 font-space">
                  No projects matching your search criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Public Project Preview Modal Integration -->
      <project-modal />
    </div>
  `
};
