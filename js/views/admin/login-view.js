// Admin Login View Component
const AdminLoginView = {
  name: 'AdminLoginView',
  data() {
    return {
      email: 'admin@portfolio.com',
      password: 'admin123',
      rememberMe: true,
      isLoading: false,
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      this.isLoading = true;

      const res = await AppController.login(this.email, this.password);
      this.isLoading = false;

      if (res && res.success) {
        AppAlerts.toast('Authentication verified. Welcome to Admin Control Center.');
        this.$router.push('/admin');
      } else {
        this.errorMessage = res.message || 'Invalid email or password.';
        AppAlerts.toast(this.errorMessage, 'error');
      }
    },
    fillDemo() {
      this.email = 'admin@portfolio.com';
      this.password = 'admin123';
    }
  },
  template: `
    <div class="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <!-- Background Glow -->
      <div class="absolute w-[500px] h-[500px] rounded-full bg-[#F28C28]/[0.08] blur-[150px] pointer-events-none"></div>

      <!-- Login Card -->
      <div class="w-full max-w-md relative z-10 space-y-8">
        <!-- Logo & Header -->
        <div class="text-center space-y-3">
          <div class="inline-flex w-14 h-14 rounded-2xl bg-[#141414] border border-white/15 items-center justify-center font-space font-bold text-xl text-white shadow-[0_0_30px_rgba(242,140,40,0.2)]">
            DM
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold font-space text-white tracking-tight">
            ADMIN CONTROL
          </h1>
          <p class="text-xs font-space tracking-widest text-[#F28C28] uppercase">
            RESTRICTED CONTENT MANAGEMENT SYSTEM
          </p>
        </div>

        <!-- Form Card -->
        <form @submit.prevent="handleLogin" class="p-8 rounded-3xl bg-[#111111] border border-white/10 shadow-2xl space-y-5">
          <div v-if="errorMessage" class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-inter flex items-center gap-2">
            <app-icon name="alert-circle" :size="16" />
            <span>{{ errorMessage }}</span>
          </div>

          <form-field label="Administrator Email" required>
            <input 
              v-model="email" 
              type="email" 
              required
              placeholder="admin@portfolio.com"
              class="w-full px-4 py-3 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] transition-colors"
            />
          </form-field>

          <password-field 
            v-model="password" 
            label="Password" 
            required 
          />

          <div class="flex items-center justify-between text-xs font-space text-neutral-400">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" v-model="rememberMe" class="rounded bg-[#181818] border-white/20 text-[#F28C28] focus:ring-0" />
              <span>Remember session</span>
            </label>
            <button type="button" @click="fillDemo" class="text-[#FFB347] hover:underline">
              Fill Default Demo
            </button>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-3.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(242,140,40,0.3)] disabled:opacity-50"
          >
            <span v-if="!isLoading">SIGN IN TO DASHBOARD →</span>
            <span v-else class="flex items-center gap-2">
              <span class="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
              <span>AUTHENTICATING...</span>
            </span>
          </button>
        </form>

        <!-- Back to Public Site -->
        <div class="text-center">
          <router-link to="/" class="text-xs font-space text-neutral-500 hover:text-neutral-300 transition-colors inline-flex items-center gap-1.5">
            <app-icon name="arrow-left" :size="14" />
            <span>Return to Public Portfolio</span>
          </router-link>
        </div>
      </div>
    </div>
  `
};
