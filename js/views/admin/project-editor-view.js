// Admin Project Add / Edit View Component
const AdminProjectEditorView = {
  name: 'AdminProjectEditorView',
  data() {
    return {
      isEditing: false,
      projectId: null,
      isSaving: false,
      newTechInput: '',
      form: {
        project_number: '01',
        title: '',
        slug: '',
        short_description: '',
        full_description: '',
        category: 'System Design & Web App',
        year: '2026',
        role: 'Lead Developer & UI Designer',
        technologies: ['UI/UX', 'WEB APP', 'SYSTEM DESIGN'],
        cover_image: 'assets/images/project-default.svg',
        github_url: '',
        project_url: '',
        is_featured: 1,
        status: 'Published',
        problem: '',
        solution: '',
        my_contribution: '',
        sort_order: 1,
        screenshots: []
      }
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    if (id && id !== 'new') {
      this.isEditing = true;
      this.projectId = parseInt(id);
      await this.loadProjectData(this.projectId);
    }
  },
  methods: {
    async loadProjectData(id) {
      const res = await AppController.getProject(id);
      if (res && res.success && res.data) {
        this.form = {
          ...this.form,
          ...res.data,
          technologies: AppModel.parseTags(res.data.technologies_json),
          screenshots: res.data.screenshots || []
        };
      } else {
        AppAlerts.toast('Project not found.', 'error');
        this.$router.push('/admin/projects');
      }
    },
    generateSlug() {
      if (!this.isEditing || !this.form.slug) {
        this.form.slug = AppModel.slugify(this.form.title);
      }
    },
    addTech() {
      const val = this.newTechInput.trim();
      if (val && !this.form.technologies.includes(val)) {
        this.form.technologies.push(val);
        this.newTechInput = '';
      }
    },
    removeTech(index) {
      this.form.technologies.splice(index, 1);
    },
    async handleCoverUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'projects');

      AppAlerts.toast('Uploading cover image...', 'info');
      const res = await AppController.uploadMedia(fd);
      if (res && res.success) {
        this.form.cover_image = res.file_path;
        AppAlerts.toast('Cover image uploaded successfully.');
      } else {
        AppAlerts.toast(res.message || 'Upload failed.', 'error');
      }
    },
    async handleScreenshotUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        fd.append('folder', 'projects');

        const res = await AppController.uploadMedia(fd);
        if (res && res.success) {
          this.form.screenshots.push({
            image_url: res.file_path,
            caption: 'Interface Screenshot ' + (this.form.screenshots.length + 1)
          });
        }
      }
      AppAlerts.toast('Screenshots uploaded.');
    },
    removeScreenshot(index) {
      this.form.screenshots.splice(index, 1);
    },
    async save(statusOverride = null) {
      if (!this.form.title) {
        AppAlerts.toast('Project title is required.', 'warning');
        return;
      }

      if (statusOverride) {
        this.form.status = statusOverride;
      }

      this.isSaving = true;
      let res;

      if (this.isEditing) {
        res = await AppController.updateProject({
          ...this.form,
          id: this.projectId
        });
      } else {
        res = await AppController.createProject(this.form);
      }

      this.isSaving = false;

      if (res && res.success) {
        AppAlerts.toast(this.isEditing ? 'Project updated successfully.' : 'Project created successfully.');
        this.$router.push('/admin/projects');
      } else {
        AppAlerts.toast(res.message || 'Error saving project.', 'error');
      }
    }
  },
  template: `
    <div class="space-y-8 max-w-5xl">
      <!-- Header -->
      <page-header 
        :title="isEditing ? 'Edit Project: ' + form.title : 'Create New Project'" 
        subtitle="Specify comprehensive case study metadata, technical stack, problem-solution statements, and visual media."
      >
        <template #actions>
          <button 
            type="button" 
            @click="save('Draft')"
            :disabled="isSaving"
            class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-space text-xs font-semibold uppercase tracking-wider border border-white/10 transition-colors"
          >
            Save Draft
          </button>

          <button 
            type="button" 
            @click="save('Published')"
            :disabled="isSaving"
            class="px-5 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)]"
          >
            {{ isEditing ? 'Update & Publish' : 'Publish Project' }}
          </button>
        </template>
      </page-header>

      <!-- Main Form -->
      <form @submit.prevent="save()" class="space-y-8">
        
        <!-- General Information Card -->
        <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <app-icon name="info" :size="16" class="text-[#F28C28]" />
            <span>GENERAL PROJECT DETAILS</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Project Number -->
            <div class="md:col-span-3">
              <form-field label="Project Number" required hint="e.g. 01, 02">
                <input 
                  v-model="form.project_number" 
                  type="text" 
                  required
                  placeholder="01"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <!-- Title -->
            <div class="md:col-span-9">
              <form-field label="Project Title" required>
                <input 
                  v-model="form.title" 
                  @input="generateSlug"
                  type="text" 
                  required
                  placeholder="e.g. NCST e-Docs"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <!-- Slug -->
            <div class="md:col-span-6">
              <form-field label="URL Slug" hint="Unique identifier">
                <input 
                  v-model="form.slug" 
                  type="text" 
                  placeholder="ncst-e-docs"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <!-- Category -->
            <div class="md:col-span-6">
              <form-field label="Category" required>
                <input 
                  v-model="form.category" 
                  type="text" 
                  placeholder="e.g. System Design & Web App"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <!-- Role -->
            <div class="md:col-span-6">
              <form-field label="My Role" required>
                <input 
                  v-model="form.role" 
                  type="text" 
                  placeholder="e.g. Lead Full-Stack Developer"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <!-- Year -->
            <div class="md:col-span-3">
              <form-field label="Year" required>
                <input 
                  v-model="form.year" 
                  type="text" 
                  placeholder="2026"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <!-- Status -->
            <div class="md:col-span-3">
              <form-field label="Status" required>
                <select 
                  v-model="form.status" 
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </form-field>
            </div>

            <!-- Short Description -->
            <div class="md:col-span-12">
              <form-field label="Short Description" hint="Showcase card overview">
                <input 
                  v-model="form.short_description" 
                  type="text" 
                  placeholder="Digital Certificate Request & Verification System with Automated Document Workflows"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <!-- Full Description -->
            <div class="md:col-span-12">
              <form-field label="Full Detailed Description">
                <textarea 
                  v-model="form.full_description" 
                  rows="4" 
                  placeholder="Deep dive into the architecture, scope, user workflows, and institutional impact..."
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] resize-none"
                ></textarea>
              </form-field>
            </div>

            <!-- Technologies Tags -->
            <div class="md:col-span-12 space-y-3">
              <form-field label="Technologies & Frameworks">
                <div class="flex items-center gap-2">
                  <input 
                    v-model="newTechInput" 
                    @keydown.enter.prevent="addTech"
                    type="text" 
                    placeholder="Type technology (e.g. Vue.js, PHP, MySQL) and press Enter or Add"
                    class="flex-1 px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                  />
                  <button 
                    type="button" 
                    @click="addTech"
                    class="px-4 py-2.5 bg-white/10 hover:bg-[#F28C28] hover:text-black rounded-xl text-xs font-space font-semibold uppercase tracking-wider text-white transition-colors"
                  >
                    Add Tag
                  </button>
                </div>
              </form-field>

              <div class="flex flex-wrap gap-2 pt-1">
                <span 
                  v-for="(t, idx) in form.technologies" 
                  :key="idx"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-xs font-space text-neutral-300"
                >
                  <span>{{ t }}</span>
                  <button type="button" @click="removeTech(idx)" class="hover:text-rose-400">
                    <app-icon name="x" :size="12" />
                  </button>
                </span>
              </div>
            </div>

            <!-- URLs -->
            <div class="md:col-span-6">
              <form-field label="Live Demo URL">
                <input 
                  v-model="form.project_url" 
                  type="text" 
                  placeholder="https://..."
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>

            <div class="md:col-span-6">
              <form-field label="GitHub Repository URL">
                <input 
                  v-model="form.github_url" 
                  type="text" 
                  placeholder="https://github.com/..."
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>
          </div>
        </div>

        <!-- Case Study Problem, Solution, Contribution -->
        <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <app-icon name="file-text" :size="16" class="text-[#F28C28]" />
            <span>CASE STUDY DEEP-DIVE</span>
          </h2>

          <div class="space-y-6">
            <form-field label="The Problem Statement">
              <textarea 
                v-model="form.problem" 
                rows="3" 
                placeholder="What challenges or inefficiencies did this project aim to solve?"
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] resize-none"
              ></textarea>
            </form-field>

            <form-field label="The Solution & System Implementation">
              <textarea 
                v-model="form.solution" 
                rows="3" 
                placeholder="How did your engineered solution address the problem effectively?"
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] resize-none"
              ></textarea>
            </form-field>

            <form-field label="My Key Contributions & Architecture">
              <textarea 
                v-model="form.my_contribution" 
                rows="3" 
                placeholder="Specific roles, database designs, backend APIs, or UI interactions you created..."
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] resize-none"
              ></textarea>
            </form-field>
          </div>
        </div>

        <!-- Media & Screenshots Section -->
        <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <app-icon name="image" :size="16" class="text-[#F28C28]" />
            <span>COVER IMAGE &amp; SCREENSHOTS</span>
          </h2>

          <!-- Cover Image -->
          <div class="space-y-3">
            <label class="block text-xs font-space uppercase tracking-wider text-neutral-400">
              Project Showcase Cover Image
            </label>
            <div class="flex flex-col sm:flex-row gap-6 items-start">
              <div class="w-full sm:w-60 h-36 rounded-xl overflow-hidden bg-[#181818] border border-white/10 shrink-0">
                <img :src="form.cover_image || 'assets/images/project-default.svg'" class="w-full h-full object-cover" />
              </div>
              <div class="space-y-3 flex-1">
                <input 
                  v-model="form.cover_image" 
                  type="text" 
                  placeholder="assets/images/project-default.svg" 
                  class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
                <div class="flex items-center gap-3">
                  <label class="px-4 py-2 bg-white/10 hover:bg-white/20 text-neutral-200 rounded-xl text-xs font-space cursor-pointer flex items-center gap-2 transition-colors">
                    <app-icon name="upload" :size="14" />
                    <span>Upload New Cover Image</span>
                    <input type="file" accept="image/*" @change="handleCoverUpload" class="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Multiple Screenshots -->
          <div class="pt-6 border-t border-white/5 space-y-4">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-space uppercase tracking-wider text-neutral-400">
                Project Detail Screenshots ({{ form.screenshots.length }})
              </label>
              <label class="px-3.5 py-1.5 bg-[#F28C28]/15 hover:bg-[#F28C28] text-[#FFB347] hover:text-black border border-[#F28C28]/30 rounded-lg text-xs font-space font-semibold cursor-pointer flex items-center gap-1.5 transition-colors">
                <app-icon name="plus" :size="14" />
                <span>Add Screenshots</span>
                <input type="file" multiple accept="image/*" @change="handleScreenshotUpload" class="hidden" />
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-for="(s, sIdx) in form.screenshots" 
                :key="sIdx"
                class="rounded-xl bg-[#181818] border border-white/10 p-3 space-y-2 relative group"
              >
                <div class="w-full h-28 rounded-lg overflow-hidden bg-[#111111]">
                  <img :src="s.image_url" class="w-full h-full object-cover" />
                </div>
                <input 
                  v-model="s.caption" 
                  placeholder="Screenshot caption..." 
                  class="w-full px-3 py-1.5 bg-[#111111] border border-white/10 rounded-lg text-neutral-200 text-xs focus:outline-none focus:border-[#F28C28]"
                />
                <button 
                  type="button" 
                  @click="removeScreenshot(sIdx)"
                  class="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/80 text-rose-400 hover:text-rose-300 flex items-center justify-center border border-white/10 shadow-lg"
                >
                  <app-icon name="x" :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <router-link 
            to="/admin/projects" 
            class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-space text-xs tracking-wider uppercase transition-colors"
          >
            Cancel
          </router-link>

          <div class="flex items-center gap-3">
            <button 
              type="button" 
              @click="save('Draft')"
              :disabled="isSaving"
              class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-space text-xs font-semibold uppercase tracking-wider border border-white/10 transition-colors"
            >
              Save As Draft
            </button>
            <button 
              type="button" 
              @click="save('Published')"
              :disabled="isSaving"
              class="px-6 py-3 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(242,140,40,0.3)]"
            >
              {{ isEditing ? 'Update Project' : 'Publish Project' }}
            </button>
          </div>
        </div>

      </form>
    </div>
  `
};
