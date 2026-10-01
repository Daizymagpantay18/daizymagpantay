// Admin Layout Wrapper Component
const AdminLayout = {
  name: 'AdminLayout',
  data() {
    return {
      sidebarOpen: false,
    };
  },
  template: `
    <div class="min-h-screen bg-[#080808] text-[#F5F5F5] font-inter flex flex-col antialiased">
      <!-- Fixed Admin Sidebar -->
      <app-sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Main Layout Body -->
      <div class="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <!-- Topbar -->
        <app-topbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

        <!-- Main Content View Area -->
        <main class="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto">
          <router-view />
        </main>
      </div>
    </div>
  `
};
