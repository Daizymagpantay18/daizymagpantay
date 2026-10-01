// Admin Settings View Component
const AdminSettingsView = {
  name: 'AdminSettingsView',
  data() {
    return {
      isSavingAccount: false,
      isSavingSite: false,
      accountForm: {
        name: 'Daizy Magpantay',
        email: 'admin@portfolio.com',
        current_password: '',
        new_password: '',
        confirm_password: ''
      },
      siteSettings: {
        site_title: 'DAIZY MAGPANTAY — Portfolio & CMS',
        accent_color: '#F28C28',
        site_status: 'online',
        show_skills: '1',
        show_experience: '1',
        show_philosophy: '1',
        show_markers: '1',
        enable_contact_form: '1',
        maintenance_mode: '0'
      }
    };
  },
  async mounted() {
    await this.loadSettings();
  },
  methods: {
    async loadSettings() {
      const res = await AppController.getSettings();
      if (res && res.data) {
        this.siteSettings = { ...this.siteSettings, ...res.data };
      }

      if (AppStore.auth.admin) {
        this.accountForm.name = AppStore.auth.admin.name || '';
        this.accountForm.email = AppStore.auth.admin.email || '';
      }
    },
    async saveAccount() {
      if (this.accountForm.new_password && this.accountForm.new_password !== this.accountForm.confirm_password) {
        AppAlerts.toast('New passwords do not match.', 'error');
        return;
      }

      this.isSavingAccount = true;
      const res = await AppController.updateAccount(this.accountForm);
      this.isSavingAccount = false;

      if (res && res.success) {
        AppAlerts.toast('Account credentials updated.');
        this.accountForm.current_password = '';
        this.accountForm.new_password = '';
        this.accountForm.confirm_password = '';
      } else {
        AppAlerts.toast(res.message || 'Error updating account.', 'error');
      }
    },
    async saveSiteSettings() {
      this.isSavingSite = true;
      const res = await AppController.updateSettings(this.siteSettings);
      this.isSavingSite = false;

      if (res && res.success) {
        AppAlerts.toast('Portfolio site settings updated.');
      } else {
        AppAlerts.toast(res.message || 'Failed to update settings.', 'error');
      }
    }
  },
  template: `
    <div class="space-y-8 max-w-5xl">
      <!-- Header -->
      <page-header 
        title="Settings &amp; Configuration" 
        subtitle="Manage administrator authentication security and portfolio configuration toggles."
      />

      <!-- Admin Account Security Card -->
      <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
        <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
          <app-icon name="shield-lock" :size="16" class="text-[#F28C28]" />
          <span>ADMINISTRATOR ACCOUNT SECURITY</span>
        </h2>

        <form @submit.prevent="saveAccount" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <form-field label="Administrator Name" required>
              <input 
                v-model="accountForm.name" 
                type="text" 
                required 
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>

            <form-field label="Login Email" required>
              <input 
                v-model="accountForm.email" 
                type="email" 
                required 
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>

            <div class="sm:col-span-2 pt-2 border-t border-white/5 space-y-4">
              <span class="block text-xs font-space tracking-widest text-[#FFB347] uppercase font-bold">
                Change Password (leave blank if keeping current password)
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <password-field 
                  v-model="accountForm.current_password" 
                  label="Current Password" 
                  placeholder="Current password"
                />
                <password-field 
                  v-model="accountForm.new_password" 
                  label="New Password" 
                  placeholder="New password"
                />
                <password-field 
                  v-model="accountForm.confirm_password" 
                  label="Confirm Password" 
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              type="submit" 
              :disabled="isSavingAccount"
              class="px-6 py-2.5 bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)] disabled:opacity-50"
            >
              {{ isSavingAccount ? 'Updating Account...' : 'Update Account Settings' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Portfolio Section Visibility & Appearance Card -->
      <div class="p-8 rounded-3xl bg-[#111111] border border-white/[0.08] space-y-6">
        <h2 class="text-base font-bold font-space text-white border-b border-white/[0.06] pb-3 flex items-center gap-2">
          <app-icon name="sliders" :size="16" class="text-[#F28C28]" />
          <span>PORTFOLIO SECTIONS &amp; ACCENT</span>
        </h2>

        <form @submit.prevent="saveSiteSettings" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <form-field label="Site Title Meta" required>
              <input 
                v-model="siteSettings.site_title" 
                type="text" 
                required 
                class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
              />
            </form-field>

            <form-field label="Theme Accent Color (HEX)">
              <div class="flex items-center gap-3">
                <input 
                  v-model="siteSettings.accent_color" 
                  type="text" 
                  class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
                />
                <input 
                  v-model="siteSettings.accent_color" 
                  type="color" 
                  class="w-12 h-11 bg-transparent cursor-pointer rounded-xl border border-white/10"
                />
              </div>
            </form-field>
          </div>

          <!-- Section Switches -->
          <div class="pt-4 border-t border-white/5 space-y-4">
            <span class="block text-xs font-space tracking-widest text-neutral-400 uppercase font-bold">
              PUBLIC SECTION VISIBILITY TOGGLES
            </span>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-space text-neutral-200">
              <label class="flex items-center justify-between p-4 rounded-xl bg-[#181818] border border-white/5 cursor-pointer">
                <span>Display "My Toolkit" Section</span>
                <input type="checkbox" v-model="siteSettings.show_skills" true-value="1" false-value="0" class="rounded bg-[#222] border-white/20 text-[#F28C28] focus:ring-0" />
              </label>

              <label class="flex items-center justify-between p-4 rounded-xl bg-[#181818] border border-white/5 cursor-pointer">
                <span>Display "The Journey" Section</span>
                <input type="checkbox" v-model="siteSettings.show_experience" true-value="1" false-value="0" class="rounded bg-[#222] border-white/20 text-[#F28C28] focus:ring-0" />
              </label>

              <label class="flex items-center justify-between p-4 rounded-xl bg-[#181818] border border-white/5 cursor-pointer">
                <span>Display "Design Philosophy" Quote</span>
                <input type="checkbox" v-model="siteSettings.show_philosophy" true-value="1" false-value="0" class="rounded bg-[#222] border-white/20 text-[#F28C28] focus:ring-0" />
              </label>

              <label class="flex items-center justify-between p-4 rounded-xl bg-[#181818] border border-white/5 cursor-pointer">
                <span>Enable Interactive Hero Markers</span>
                <input type="checkbox" v-model="siteSettings.show_markers" true-value="1" false-value="0" class="rounded bg-[#222] border-white/20 text-[#F28C28] focus:ring-0" />
              </label>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              type="submit" 
              :disabled="isSavingSite"
              class="px-6 py-2.5 bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)] disabled:opacity-50"
            >
              {{ isSavingSite ? 'Saving Settings...' : 'Save Site Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
};
