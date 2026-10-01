// Admin Sidebar Navigation Component
const AppSidebar = {
  name: 'AppSidebar',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  computed: {
    menuItems() {
      return APP_NAVIGATION.adminMenu;
    },
    unreadMessages() {
      return AppStore.stats.unread_messages || 0;
    },
    currentPath() {
      return this.$route.path;
    }
  },
  methods: {
    isActive(itemPath) {
      if (itemPath === '/admin') {
        return this.currentPath === '/admin' || this.currentPath === '/admin/';
      }
      return this.currentPath.startsWith(itemPath);
    },
    async handleLogout() {
      const confirm = await AppAlerts.confirm('Sign Out', 'Are you sure you want to end your administrator session?');
      if (confirm) {
        await AppController.logout();
        AppAlerts.toast('You have been signed out.');
        this.$router.push('/admin/login');
      }
    }
  },
  template: `
    <div>
      <!-- Mobile Backdrop -->
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        @click="$emit('close')"
      ></div>

      <!-- Sidebar Container -->
      <aside 
        class="fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <!-- Top Section: Brand Identity -->
        <div>
          <div class="h-20 px-6 flex items-center justify-between border-b border-white/[0.06]">
            <router-link to="/admin" class="flex items-center gap-3.5 group">
              <div class="w-10 h-10 rounded-xl bg-[#181818] border border-white/10 flex items-center justify-center font-space font-bold text-base text-white group-hover:border-[#F28C28] group-hover:text-[#FFB347] transition-all">
                DM
              </div>
              <div>
                <span class="block font-space font-bold text-sm tracking-wider text-white group-hover:text-[#FFB347] transition-colors">
                  DAIZY MAGPANTAY
                </span>
                <span class="block font-space text-[10px] tracking-widest text-[#F28C28] uppercase font-semibold">
                  ADMIN CONTROL
                </span>
              </div>
            </router-link>

            <!-- Close button for mobile -->
            <button 
              @click="$emit('close')" 
              class="lg:hidden text-neutral-400 hover:text-white"
            >
              <app-icon name="x" :size="20" />
            </button>
          </div>

          <!-- Navigation Links -->
          <nav class="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              @click="$emit('close')"
              class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-space tracking-wide transition-all group"
              :class="isActive(item.path) ? 'bg-[#F28C28]/15 text-[#FFB347] font-semibold border-l-2 border-[#F28C28] shadow-[0_0_20px_rgba(242,140,40,0.12)]' : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'"
            >
              <div class="flex items-center gap-3">
                <app-icon 
                  :name="item.icon" 
                  :size="18" 
                  :class="isActive(item.path) ? 'text-[#F28C28]' : 'text-neutral-400 group-hover:text-white transition-colors'" 
                />
                <span>{{ item.name }}</span>
              </div>

              <!-- Unread Badge if applicable -->
              <span 
                v-if="item.badge === 'unread_messages' && unreadMessages > 0"
                class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#F28C28] text-black animate-pulse"
              >
                {{ unreadMessages }}
              </span>
            </router-link>
          </nav>
        </div>

        <!-- Bottom Section: Quick Links & Logout -->
        <div class="p-4 border-t border-white/[0.06] space-y-2 bg-[#0a0a0a]">
          <router-link 
            to="/" 
            target="_blank"
            class="flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-space text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span class="flex items-center gap-2">
              <app-icon name="external-link" :size="15" class="text-neutral-400" />
              View Public Website
            </span>
            <app-icon name="arrow-up-right" :size="14" class="text-neutral-500" />
          </router-link>

          <button 
            @click="handleLogout"
            class="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-space text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <app-icon name="log-out" :size="15" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  `
};
