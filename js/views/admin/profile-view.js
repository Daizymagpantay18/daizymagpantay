// Admin Profile Management View Component
const AdminProfileView = {
  name: 'AdminProfileView',
  data() {
    return {
      isSaving: false,
      newAvailabilityItem: '',
      profile: {
        full_name: 'DAIZY MAGPANTAY',
        professional_title: 'IT STUDENT — EXPLORING SYSTEMS, DESIGN & TECHNOLOGY',
        short_intro: '',
        about_me: '',
        location: 'Philippines',
        focus_areas: 'Systems • Web • Design',
        current_status: 'Studying Information Technology',
        email: 'daizymagpantay@gmail.com',
        phone: '+63 912 345 6789',
        linkedin_url: '',
        github_url: '',
        avatar_url: 'assets/images/portrait-cinematic.svg',
        hero_badge: 'PORTFOLIO / 2026',
        availability_status: []
      }
    };
  },
  async mounted() {
    await this.loadProfile();
  },
  methods: {
    async loadProfile() {
      const res = await AppController.getProfile();
      if (res && res.data) {
        this.profile = {
          ...this.profile,
          ...res.data,
          availability_status: res.data.availability_status || [
            'School Projects',
            'Web Projects',
            'System Projects',
            'Creative Collaborations'
          ]
        };
      }
    },
    addAvailability() {
      const val = this.newAvailabilityItem.trim();
      if (val && !this.profile.availability_status.includes(val)) {
        this.profile.availability_status.push(val);
        this.newAvailabilityItem = '';
      }
    },
    removeAvailability(index) {
      this.profile.availability_status.splice(index, 1);
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'profile');

      AppAlerts.toast('Uploading portrait image...', 'info');
      const res = await AppController.uploadMedia(fd);
      if (res && res.success) {
        this.profile.avatar_url = res.file_path;
        AppAlerts.toast('Portrait uploaded.');
      } else {
        AppAlerts.toast(res.message || 'Upload failed.', 'error');
      }
    },
    async saveProfile() {
      this.isSaving = true;
      const res = await AppController.updateProfile(this.profile);
      this.isSaving = false;

      if (res && res.success) {
        AppAlerts.toast('Profile details updated and synchronized with live portfolio!');
      } else {
        AppAlerts.toast(res.message || 'Failed to update profile.', 'error');
      }
    }
  },
  template: `
    <div class="space-y-8 max-w-5xl">
      <!-- Header -->
      <page-header 
        title="Profile Management" 
        subtitle="Manage your personal brand identity, editorial bio, contact channels, and project availability."
      >
        <template #actions>
          <button 
            type="button" 
            @click="saveProfile"
            :disabled="isSaving"
            class="px-6 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)] disabled:opacity-50"
          >
            {{ isSaving ? 'Saving Changes...' : 'Save Profile' }}
          </button>
        </template>
      </page-header>

      <form @submit.prevent="saveProfile" class="space-y-8">
        
        <!-- Portrait & Core Identity Card -->
        <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <app-icon name="user" :size="16" class="text-[#F28C28]" />
            <span>PORTRAIT &amp; IDENTITY</span>
          </h2>

          <div class="flex flex-col sm:flex-row gap-8 items-start">
            <!-- Portrait Box -->
            <div class="w-40 sm:w-48 aspect-[4/5] rounded-2xl overflow-hidden bg-[#181818] border border-white/10 shrink-0 shadow-xl relative group">
              <img :src="profile.avatar_url || 'assets/images/portrait-cinematic.svg'" class="w-full h-full object-cover" />
              <label class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-xs font-space">
                <app-icon name="camera" :size="20" class="mb-1 text-[#FFB347]" />
                <span>Change Photo</span>
                <input type="file" accept="image/*" @change="handleAvatarUpload" class="hidden" />
              </label>
            </div>

            <!-- Fields -->
            <div class="flex-1 space-y-4 w-full">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form-field label="Full Name" required>
                  <input 
                    v-model="profile.full_name" 
                    type="text" 
                    required 
                    placeholder="DAIZY MAGPANTAY"
                    class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                  />
                </form-field>

                <form-field label="Hero Badge" hint="Badge shown on hero">
                  <input 
                    v-model="profile.hero_badge" 
                    type="text" 
                    placeholder="PORTFOLIO / 2026"
                    class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                  />
                </form-field>
              </div>

              <form-field label="Professional Title / Tagline" required>
                <input 
                  v-model="profile.professional_title" 
                  type="text" 
                  required 
                  placeholder="IT STUDENT — EXPLORING SYSTEMS, DESIGN & TECHNOLOGY"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>

              <form-field label="Avatar Image URL">
                <input 
                  v-model="profile.avatar_url" 
                  type="text" 
                  placeholder="assets/images/portrait-cinematic.svg"
                  class="w-full px-4 py-2.5 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-xs focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>
          </div>
        </div>

        <!-- Editorial Bios Card -->
        <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <app-icon name="align-left" :size="16" class="text-[#F28C28]" />
            <span>EDITORIAL BIOGRAPHY</span>
          </h2>

          <div class="space-y-6">
            <form-field label="Short Hero Introduction" hint="Displayed in the hero section">
              <textarea 
                v-model="profile.short_intro" 
                rows="3" 
                placeholder="I'm an Information Technology student exploring systems, web technology, digital design, and emerging technologies."
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] resize-none"
              ></textarea>
            </form-field>

            <form-field label="Detailed About Me Statement" hint="Large editorial quote in About section">
              <textarea 
                v-model="profile.about_me" 
                rows="4" 
                placeholder="I'm an Information Technology student interested in turning ideas and real-world problems into practical digital solutions..."
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] resize-none"
              ></textarea>
            </form-field>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <form-field label="Location">
                <input 
                  v-model="profile.location" 
                  type="text" 
                  placeholder="Philippines"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>

              <form-field label="Focus Areas">
                <input 
                  v-model="profile.focus_areas" 
                  type="text" 
                  placeholder="Systems • Web • Design"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>

              <form-field label="Current Status">
                <input 
                  v-model="profile.current_status" 
                  type="text" 
                  placeholder="Studying Information Technology"
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
              </form-field>
            </div>
          </div>
        </div>

        <!-- Contact Channels & Social Links -->
        <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <app-icon name="link" :size="16" class="text-[#F28C28]" />
            <span>CONTACT &amp; SOCIAL CHANNELS</span>
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <form-field label="Email Address" required>
              <input 
                v-model="profile.email" 
                type="email" 
                placeholder="daizymagpantay@gmail.com"
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>

            <form-field label="Phone Number">
              <input 
                v-model="profile.phone" 
                type="text" 
                placeholder="+63 912 345 6789"
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>

            <form-field label="LinkedIn Profile URL">
              <input 
                v-model="profile.linkedin_url" 
                type="text" 
                placeholder="https://linkedin.com/in/daizymagpantay"
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>

            <form-field label="GitHub Profile URL">
              <input 
                v-model="profile.github_url" 
                type="text" 
                placeholder="https://github.com/daizymagpantay"
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>
          </div>
        </div>

        <!-- Availability Items -->
        <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
          <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
            <app-icon name="check-circle" :size="16" class="text-emerald-400" />
            <span>PROJECT AVAILABILITY LIST</span>
          </h2>

          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <input 
                v-model="newAvailabilityItem" 
                @keydown.enter.prevent="addAvailability"
                type="text" 
                placeholder="e.g. System Projects, Web Projects, UI Collaborations"
                class="flex-1 px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
              <button 
                type="button" 
                @click="addAvailability"
                class="px-5 py-3 bg-white/10 hover:bg-[#F28C28] hover:text-black rounded-xl text-xs font-space font-semibold uppercase tracking-wider text-white transition-colors"
              >
                Add Item
              </button>
            </div>

            <div class="flex flex-wrap gap-2 pt-2">
              <span 
                v-for="(item, idx) in profile.availability_status" 
                :key="idx"
                class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-emerald-500/20 text-xs font-space text-emerald-300"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{{ item }}</span>
                <button type="button" @click="removeAvailability(idx)" class="hover:text-rose-400 ml-1">
                  <app-icon name="x" :size="13" />
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Save Button Footer -->
        <div class="flex justify-end pt-4">
          <button 
            type="submit" 
            :disabled="isSaving"
            class="px-8 py-3.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(242,140,40,0.3)] disabled:opacity-50"
          >
            {{ isSaving ? 'SAVING...' : 'SAVE PROFILE' }}
          </button>
        </div>

      </form>
    </div>
  `
};
