// Admin Journey / Experience Timeline Management View Component
const AdminJourneyView = {
  name: 'AdminJourneyView',
  data() {
    return {
      experiences: [],
      isModalOpen: false,
      isEditing: false,
      isSaving: false,
      entryForm: {
        id: null,
        year: '2026',
        title: '',
        description: '',
        category: 'Milestone',
        sort_order: 1
      }
    };
  },
  async mounted() {
    await this.loadJourney();
  },
  methods: {
    async loadJourney() {
      const res = await AppController.getExperience();
      if (res && res.data) {
        this.experiences = res.data;
      }
    },
    openAddModal() {
      this.isEditing = false;
      this.entryForm = {
        id: null,
        year: '2026',
        title: '',
        description: '',
        category: 'System & Web Development',
        sort_order: this.experiences.length + 1
      };
      this.isModalOpen = true;
    },
    openEditModal(item) {
      this.isEditing = true;
      this.entryForm = { ...item };
      this.isModalOpen = true;
    },
    async saveEntry() {
      if (!this.entryForm.year || !this.entryForm.title || !this.entryForm.description) {
        AppAlerts.toast('Year, title, and description are required.', 'warning');
        return;
      }

      this.isSaving = true;
      let res;
      if (this.isEditing) {
        res = await AppController.updateExperience(this.entryForm);
      } else {
        res = await AppController.createExperience(this.entryForm);
      }
      this.isSaving = false;

      if (res && res.success) {
        AppAlerts.toast(this.isEditing ? 'Timeline entry updated.' : 'Timeline entry added.');
        this.isModalOpen = false;
        await this.loadJourney();
      } else {
        AppAlerts.toast(res.message || 'Error saving entry.', 'error');
      }
    },
    async deleteEntry(item) {
      const confirmed = await AppAlerts.confirm(`Delete "${item.year} - ${item.title}"?`, 'This will remove the milestone from your public journey.');
      if (confirmed) {
        const res = await AppController.deleteExperience(item.id);
        if (res && res.success) {
          AppAlerts.toast('Timeline entry deleted.');
          await this.loadJourney();
        } else {
          AppAlerts.toast(res.message || 'Failed to delete entry.', 'error');
        }
      }
    }
  },
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <page-header 
        title="Journey &amp; Experience Timeline" 
        subtitle="Chronicle your evolutionary path, milestone achievements, and academic progress."
        :badge="experiences.length + ' MILESTONES'"
      >
        <template #actions>
          <button 
            type="button" 
            @click="openAddModal"
            class="px-4 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)]"
          >
            <app-icon name="plus" :size="16" />
            <span>+ Add Milestone</span>
          </button>
        </template>
      </page-header>

      <!-- Journey Timeline List -->
      <div class="space-y-4 max-w-4xl">
        <div 
          v-for="item in experiences" 
          :key="item.id"
          class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
        >
          <!-- Left info -->
          <div class="flex items-start gap-4">
            <div class="px-3.5 py-2 rounded-xl bg-[#181818] border border-[#F28C28]/30 font-space font-bold text-base text-[#FFB347] shrink-0 text-center">
              {{ item.year }}
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="font-space font-bold text-base text-white group-hover:text-[#FFB347] transition-colors">
                  {{ item.title }}
                </h3>
                <span class="text-[10px] font-space text-[#F28C28] uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                  {{ item.category }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-neutral-400 font-inter leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button 
              @click="openEditModal(item)" 
              class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
              title="Edit Milestone"
            >
              <app-icon name="edit-2" :size="15" />
            </button>
            <button 
              @click="deleteEntry(item)" 
              class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
              title="Delete Milestone"
            >
              <app-icon name="trash-2" :size="15" />
            </button>
          </div>
        </div>

        <div v-if="experiences.length === 0" class="p-12 text-center rounded-2xl bg-[#111111] border border-white/5 text-neutral-500 text-sm font-space">
          No journey milestones recorded yet. Click "+ Add Milestone" to begin!
        </div>
      </div>

      <!-- Add/Edit Milestone Modal Dialog -->
      <app-modal 
        :is-open="isModalOpen"
        :title="isEditing ? 'Edit Milestone: ' + entryForm.year : 'Add Journey Milestone'"
        subtitle="Chronicle key academic and technical progress."
        @close="isModalOpen = false"
      >
        <form @submit.prevent="saveEntry" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <form-field label="Year" required>
              <input 
                v-model="entryForm.year" 
                type="text" 
                required 
                placeholder="2026"
                class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>

            <form-field label="Category / Focus">
              <input 
                v-model="entryForm.category" 
                type="text" 
                placeholder="e.g. System Development"
                class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>
          </div>

          <form-field label="Milestone Title" required>
            <input 
              v-model="entryForm.title" 
              type="text" 
              required 
              placeholder="e.g. Web Development - Projects & System Development"
              class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
            />
          </form-field>

          <form-field label="Milestone Description" required>
            <textarea 
              v-model="entryForm.description" 
              rows="3" 
              required
              placeholder="Describe key systems built, frameworks mastered, or achievements..."
              class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] resize-none"
            ></textarea>
          </form-field>

          <form-field label="Sort Order">
            <input 
              v-model="entryForm.sort_order" 
              type="number" 
              class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
            />
          </form-field>
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
            @click="saveEntry"
            :disabled="isSaving"
            class="px-5 py-2 bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase rounded-xl shadow-[0_0_15px_rgba(242,140,40,0.3)]"
          >
            {{ isSaving ? 'Saving...' : 'Save Milestone' }}
          </button>
        </template>
      </app-modal>
    </div>
  `
};
