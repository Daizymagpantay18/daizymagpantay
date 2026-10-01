// Admin Topbar Component
const AppTopbar = {
  name: 'AppTopbar',
  emits: ['toggle-sidebar'],
  data() {
    return {
      currentTime: '',
      timer: null
    };
  },
  computed: {
    admin() {
      return AppStore.auth.admin || { name: 'Admin', email: 'admin@portfolio.com', role: 'Administrator' };
    }
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' PHT';
    }
  },
  template: `
    <header class="h-20 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/[0.08] px-6 flex items-center justify-between sticky top-0 z-30">
      <!-- Left: Mobile Menu Toggle & Breadcrumbs/Welcome -->
      <div class="flex items-center gap-4">
        <button 
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white border border-white/10"
        >
          <app-icon name="menu" :size="20" />
        </button>

        <div class="hidden sm:flex items-center gap-2 text-xs font-space text-neutral-400">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>CMS ONLINE</span>
          <span class="text-neutral-600">•</span>
          <span class="text-neutral-300">{{ currentTime }}</span>
        </div>
      </div>

      <!-- Right: Admin Profile Pill & Actions -->
      <div class="flex items-center gap-4">
        <router-link 
          to="/" 
          target="_blank"
          class="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#F28C28]/10 text-xs font-space text-neutral-300 hover:text-[#FFB347] border border-white/10 hover:border-[#F28C28]/30 transition-all"
        >
          <app-icon name="eye" :size="14" class="text-[#F28C28]" />
          <span>Live Portfolio</span>
        </router-link>

        <!-- Admin Profile Info -->
        <router-link to="/admin/profile" class="flex items-center gap-3 pl-3 border-l border-white/10 group">
          <div class="w-9 h-9 rounded-full bg-[#181818] border border-white/15 flex items-center justify-center overflow-hidden group-hover:border-[#F28C28] transition-colors">
            <app-icon name="user" :size="18" class="text-neutral-300 group-hover:text-[#F28C28]" />
          </div>
          <div class="hidden sm:block text-left">
            <span class="block text-xs font-space font-semibold text-white group-hover:text-[#FFB347] transition-colors">
              {{ admin.name }}
            </span>
            <span class="block text-[10px] font-space text-[#F28C28] uppercase">
              {{ admin.role }}
            </span>
          </div>
        </router-link>
      </div>
    </header>
  `
};
