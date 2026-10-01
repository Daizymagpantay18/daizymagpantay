// Admin Skills & Toolkit Management View Component
const AdminSkillsView = {
  name: 'AdminSkillsView',
  data() {
    return {
      categories: [],
      skillsData: [],
      selectedCategoryId: 'all',
      isModalOpen: false,
      isEditing: false,
      isSaving: false,
      skillForm: {
        id: null,
        category_id: 1,
        name: '',
        description: '',
        icon_name: 'code',
        is_visible: 1,
        sort_order: 1
      },
      iconOptions: ['code', 'server', 'database', 'layout', 'figma', 'monitor', 'cpu', 'shield-check', 'sparkles', 'git-branch', 'terminal', 'bot', 'zap', 'eye', 'hard-drive', 'layers', 'file-code', 'palette', 'link', 'lock']
    };
  },
  computed: {
    totalSkillsCount() {
      let count = 0;
      this.skillsData.forEach(c => {
        count += (c.skills || []).length;
      });
      return count;
    },
    filteredCategories() {
      if (this.selectedCategoryId === 'all') {
        return this.skillsData;
      }
      return this.skillsData.filter(c => c.id == this.selectedCategoryId);
    }
  },
  async mounted() {
    await this.loadSkills();
    await this.loadCategories();
  },
  methods: {
    async loadSkills() {
      const res = await AppController.getSkills(true);
      if (res && res.data) {
        this.skillsData = res.data;
      }
    },
    async loadCategories() {
      const res = await AppController.getSkillCategories();
      if (res && res.data) {
        this.categories = res.data;
        if (this.categories.length > 0 && !this.skillForm.category_id) {
          this.skillForm.category_id = this.categories[0].id;
        }
      }
    },
    openAddModal(catId = null) {
      this.isEditing = false;
      this.skillForm = {
        id: null,
        category_id: catId || (this.categories[0] ? this.categories[0].id : 1),
        name: '',
        description: '',
        icon_name: 'code',
        is_visible: 1,
        sort_order: 1
      };
      this.isModalOpen = true;
    },
    openEditModal(skill) {
      this.isEditing = true;
      this.skillForm = {
        id: skill.id,
        category_id: skill.category_id,
        name: skill.name,
        description: skill.description || '',
        icon_name: skill.icon_name || 'code',
        is_visible: parseInt(skill.is_visible) || 1,
        sort_order: skill.sort_order || 1
      };
      this.isModalOpen = true;
    },
    async saveSkill() {
      if (!this.skillForm.name || !this.skillForm.category_id) {
        AppAlerts.toast('Skill name and category are required.', 'warning');
        return;
      }

      this.isSaving = true;
      let res;

      if (this.isEditing) {
        res = await AppController.updateSkill(this.skillForm);
      } else {
        res = await AppController.createSkill(this.skillForm);
      }
      this.isSaving = false;

      if (res && res.success) {
        AppAlerts.toast(this.isEditing ? 'Skill updated successfully.' : 'Skill added successfully.');
        this.isModalOpen = false;
        await this.loadSkills();
      } else {
        AppAlerts.toast(res.message || 'Failed to save skill.', 'error');
      }
    },
    async deleteSkill(skill) {
      const confirmed = await AppAlerts.confirm(`Delete "${skill.name}"?`, 'This technology will be removed from your toolkit.');
      if (confirmed) {
        const res = await AppController.deleteSkill(skill.id);
        if (res && res.success) {
          AppAlerts.toast('Skill deleted.');
          await this.loadSkills();
        } else {
          AppAlerts.toast(res.message || 'Failed to delete skill.', 'error');
        }
      }
    }
  },
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <page-header 
        title="Skills &amp; Toolkit Management" 
        subtitle="Manage your technology inventory across systems, web frameworks, design systems, and AI models."
        :badge="totalSkillsCount + ' SKILLS'"
      >
        <template #actions>
          <button 
            type="button" 
            @click="openAddModal()"
            class="px-4 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)]"
          >
            <app-icon name="plus" :size="16" />
            <span>+ Add Skill</span>
          </button>
        </template>
      </page-header>

      <!-- Category Filter Tabs -->
      <div class="p-4 rounded-2xl bg-[#111111] border border-white/[0.08] flex items-center gap-2 overflow-x-auto">
        <button 
          @click="selectedCategoryId = 'all'"
          class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors shrink-0"
          :class="selectedCategoryId === 'all' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
        >
          All Categories
        </button>
        <button 
          v-for="c in categories" 
          :key="c.id"
          @click="selectedCategoryId = c.id"
          class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors shrink-0"
          :class="selectedCategoryId === c.id ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
        >
          {{ c.name }}
        </button>
      </div>

      <!-- Categories & Skills Cards Grid -->
      <div class="space-y-8">
        <div 
          v-for="cat in filteredCategories" 
          :key="cat.id"
          class="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6"
        >
          <div class="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div class="flex items-center gap-3">
              <h2 class="text-base font-bold font-space text-[#FFB347] tracking-wider uppercase">
                {{ cat.name }}
              </h2>
              <span class="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-space text-neutral-400 border border-white/5">
                {{ (cat.skills || []).length }} Items
              </span>
            </div>
            
            <button 
              @click="openAddModal(cat.id)"
              class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-space text-neutral-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <app-icon name="plus" :size="13" />
              <span>Add to Category</span>
            </button>
          </div>

          <!-- Skills Grid in this category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="s in cat.skills" 
              :key="s.id"
              class="p-4 rounded-2xl bg-[#161616] border border-white/[0.06] hover:border-white/15 transition-all flex items-start justify-between gap-3 group"
            >
              <div class="flex items-start gap-3.5">
                <div class="w-9 h-9 rounded-xl bg-[#222222] border border-white/5 flex items-center justify-center shrink-0 text-[#F28C28] group-hover:bg-[#F28C28] group-hover:text-black transition-colors mt-0.5">
                  <app-icon :name="s.icon_name || 'code'" :size="16" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-space font-bold text-sm text-white group-hover:text-[#FFB347] transition-colors">
                      {{ s.name }}
                    </h3>
                    <span v-if="!s.is_visible" class="text-[9px] font-space text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      HIDDEN
                    </span>
                  </div>
                  <p class="text-xs text-neutral-400 font-inter mt-1 leading-relaxed">
                    {{ s.description }}
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button 
                  @click="openEditModal(s)"
                  class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  title="Edit Skill"
                >
                  <app-icon name="edit-2" :size="13" />
                </button>
                <button 
                  @click="deleteSkill(s)"
                  class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="Delete Skill"
                >
                  <app-icon name="trash-2" :size="13" />
                </button>
              </div>
            </div>

            <div v-if="(cat.skills || []).length === 0" class="col-span-full py-6 text-center text-xs text-neutral-500 font-space">
              No skills in this category yet. Click "Add to Category" to create one.
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Skill Modal Dialog -->
      <app-modal 
        :is-open="isModalOpen"
        :title="isEditing ? 'Edit Skill: ' + skillForm.name : 'Add New Skill / Tool'"
        subtitle="Manage tool category classification, descriptive focus, and icon."
        @close="isModalOpen = false"
      >
        <form @submit.prevent="saveSkill" class="space-y-5">
          <form-field label="Skill / Technology Name" required>
            <input 
              v-model="skillForm.name" 
              type="text" 
              required 
              placeholder="e.g. Vue.js 3, PHP, MySQL, Figma"
              class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
            />
          </form-field>

          <form-field label="Category" required>
            <select 
              v-model="skillForm.category_id" 
              class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
            >
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </form-field>

          <form-field label="Short Functional Description" hint="Brief explanation of usage or area">
            <input 
              v-model="skillForm.description" 
              type="text" 
              placeholder="e.g. Reactive SPA components, Vue Router, state management"
              class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
            />
          </form-field>

          <form-field label="Technology Icon">
            <div class="grid grid-cols-5 sm:grid-cols-8 gap-2 p-2 bg-[#181818] rounded-xl border border-white/10 max-h-36 overflow-y-auto">
              <button 
                type="button" 
                v-for="ic in iconOptions" 
                :key="ic"
                @click="skillForm.icon_name = ic"
                class="p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors"
                :class="skillForm.icon_name === ic ? 'bg-[#F28C28] text-black font-bold' : 'hover:bg-white/5 text-neutral-400 hover:text-white'"
              >
                <app-icon :name="ic" :size="16" />
                <span class="text-[9px] truncate max-w-full">{{ ic }}</span>
              </button>
            </div>
          </form-field>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <form-field label="Visibility">
              <select 
                v-model="skillForm.is_visible" 
                class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              >
                <option :value="1">Visible on Portfolio</option>
                <option :value="0">Hidden</option>
              </select>
            </form-field>

            <form-field label="Sort Order">
              <input 
                v-model="skillForm.sort_order" 
                type="number" 
                class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>
          </div>
        </form>

        <template #footer>
          <button 
            type="button" 
            @click="isModalOpen = false"
            class="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl text-xs font-space uppercase"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="saveSkill"
            :disabled="isSaving"
            class="px-5 py-2 bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase rounded-xl shadow-[0_0_15px_rgba(242,140,40,0.3)]"
          >
            {{ isSaving ? 'Saving...' : 'Save Skill' }}
          </button>
        </template>
      </app-modal>
    </div>
  `
};
