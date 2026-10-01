// Central Reactive Store for Vue 3
const { reactive } = Vue;

const AppStore = reactive({
  // Authentication State
  auth: {
    isAuthenticated: false,
    admin: null,
    checked: false,
    loading: false,
  },

  // Public & Admin Data Cache
  profile: null,
  projects: [],
  skillCategories: [],
  experience: [],
  settings: {
    accent_color: '#F28C28',
    site_title: 'DAIZY MAGPANTAY',
    show_skills: '1',
    show_experience: '1',
    show_philosophy: '1',
    show_markers: '1',
    enable_contact_form: '1',
  },
  
  // Dashboard & Admin Stats
  stats: {
    total_projects: 0,
    published_projects: 0,
    total_skills: 0,
    total_messages: 0,
    unread_messages: 0,
    profile_views: 0
  },

  // Interactive UI States
  selectedProject: null, // Active project for public editorial case study modal
  activeHeroMarker: null, // Active marker ID in the hero section
  mobilePublicNavOpen: false,
  adminSidebarCollapsed: false,
  isLoading: false,

  // Store Mutation Methods
  setAuth(authenticated, admin = null) {
    this.auth.isAuthenticated = authenticated;
    this.auth.admin = admin;
    this.auth.checked = true;
  },

  setProfile(data) {
    this.profile = data;
  },

  setProjects(list) {
    this.projects = list;
  },

  setSkillCategories(cats) {
    this.skillCategories = cats;
  },

  setExperience(list) {
    this.experience = list;
  },

  setSettings(data) {
    this.settings = { ...this.settings, ...data };
  },

  setStats(data) {
    this.stats = { ...this.stats, ...data };
  },

  openProjectModal(project) {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
  },

  closeProjectModal() {
    this.selectedProject = null;
    document.body.style.overflow = 'auto';
  }
});
