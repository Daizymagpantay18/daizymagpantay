// Vue Router Configuration
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
  {
    path: '/',
    name: 'home',
    component: PublicHomeView,
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: AdminDashboardView,
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: AdminProfileView,
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: AdminProjectsView,
      },
      {
        path: 'projects/new',
        name: 'admin-project-create',
        component: AdminProjectEditorView,
      },
      {
        path: 'projects/edit/:id',
        name: 'admin-project-edit',
        component: AdminProjectEditorView,
      },
      {
        path: 'skills',
        name: 'admin-skills',
        component: AdminSkillsView,
      },
      {
        path: 'journey',
        name: 'admin-journey',
        component: AdminJourneyView,
      },
      {
        path: 'messages',
        name: 'admin-messages',
        component: AdminMessagesView,
      },
      {
        path: 'media',
        name: 'admin-media',
        component: AdminMediaView,
      },
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: AdminAnalyticsView,
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: AdminSettingsView,
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Navigation Guard to protect Admin Area
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!AppStore.auth.checked) {
      await AppController.checkAuth();
    }
    if (!AppStore.auth.isAuthenticated) {
      next({ path: '/admin/login', query: { redirect: to.fullPath } });
      return;
    }
  } else if (to.matched.some(record => record.meta.guestOnly)) {
    if (!AppStore.auth.checked) {
      await AppController.checkAuth();
    }
    if (AppStore.auth.isAuthenticated) {
      next({ path: '/admin' });
      return;
    }
  }
  next();
});
