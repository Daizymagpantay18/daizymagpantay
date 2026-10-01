// Public Luxury Portfolio Home View Component
const PublicHomeView = {
  name: 'PublicHomeView',
  data() {
    return {
      isScrolled: false,
      mobileMenuOpen: false,
      activeMarker: null,
      contactForm: {
        sender_name: '',
        email: '',
        subject: '',
        message: ''
      },
      isSubmittingContact: false,
      contactSubmitted: false,
      interactiveMarkers: [
        { id: 1, top: '22%', left: '18%', label: 'SYSTEM ARCHITECTURE', tag: 'PHP • REST • PDO' },
        { id: 2, top: '38%', right: '12%', label: 'WEB TECHNOLOGY', tag: 'Vue.js • Tailwind CSS' },
        { id: 3, top: '65%', left: '14%', label: 'DIGITAL DESIGN', tag: 'Figma • Glassmorphism' },
        { id: 4, top: '78%', right: '18%', label: 'AI & VISION', tag: 'Prompting • Model API' },
        { id: 5, top: '15%', right: '28%', label: 'EDUCATION', tag: 'BS Information Technology' },
      ]
    };
  },
  computed: {
    profile() {
      return AppStore.profile || {
        full_name: 'DAIZY MAGPANTAY',
        professional_title: 'IT STUDENT — EXPLORING SYSTEMS, DESIGN & TECHNOLOGY',
        short_intro: "I'm an Information Technology student exploring systems, web technology, digital design, and emerging technologies.",
        about_me: "I'm an Information Technology student interested in turning ideas and real-world problems into practical digital solutions. Combining modern frontend interfaces with robust backend architectures, I focus on clean structure, intuitive interaction, and efficient database designs.",
        location: 'Philippines',
        focus_areas: 'Systems • Web • Design',
        current_status: 'Studying Information Technology',
        email: 'daizymagpantay@gmail.com',
        phone: '+63 912 345 6789',
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        avatar_url: 'assets/images/portrait-cinematic.svg',
        hero_badge: 'PORTFOLIO / 2026',
        availability_status: [
          'School Projects',
          'Web Projects',
          'System Projects',
          'Creative Collaborations'
        ]
      };
    },
    projects() {
      return AppStore.projects;
    },
    skillCategories() {
      return AppStore.skillCategories;
    },
    experience() {
      return AppStore.experience;
    },
    settings() {
      return AppStore.settings;
    },
    publicNav() {
      return APP_NAVIGATION.publicMenu;
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll);
    await this.loadInitialData();
    // Record page view for analytics
    AppController.recordPageView('/');
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 40;
    },
    async loadInitialData() {
      AppStore.isLoading = true;
      await Promise.all([
        AppController.getProfile(),
        AppController.getProjects({ status: 'Published' }),
        AppController.getSkills(true),
        AppController.getExperience(),
        AppController.getSettings()
      ]);
      AppStore.isLoading = false;
    },
    openProject(project) {
      AppController.recordProjectView(project.id);
      AppStore.openProjectModal(project);
    },
    async submitContact() {
      if (!this.contactForm.sender_name || !this.contactForm.email || !this.contactForm.message) {
        AppAlerts.toast('Please provide your name, email, and message.', 'warning');
        return;
      }
      this.isSubmittingContact = true;
      const res = await AppController.submitContactMessage(this.contactForm);
      this.isSubmittingContact = false;

      if (res && res.success) {
        AppAlerts.success('Message Transmitted', 'Thank you for reaching out! Your message has been safely logged in the system.');
        this.contactForm = { sender_name: '', email: '', subject: '', message: '' };
        this.contactSubmitted = true;
      } else {
        AppAlerts.error('Transmission Failed', res.message || 'Could not send message.');
      }
    }
  },
  template: `
    <div class="relative min-h-screen bg-[#080808] text-[#F5F5F5] font-inter selection:bg-[#F28C28]/30 selection:text-white overflow-x-hidden">
      
      <!-- Background Ambient Glow & Cinematic Grid -->
      <div class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute top-[-10%] left-[25%] w-[600px] h-[600px] rounded-full bg-[#F28C28]/[0.06] blur-[150px]"></div>
        <div class="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#F28C28]/[0.04] blur-[140px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#F28C28]/[0.05] blur-[160px]"></div>
      </div>

      <!-- ================= 1. PUBLIC NAVIGATION ================= -->
      <header 
        class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        :class="isScrolled ? 'bg-[#080808]/85 backdrop-blur-md border-b border-white/[0.08] py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'bg-transparent py-6'"
      >
        <div class="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          <!-- Top Left: Logo / Personal Initials -->
          <a href="#" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-full border border-white/20 bg-white/[0.03] group-hover:border-[#F28C28] flex items-center justify-center font-space font-bold text-sm tracking-wider text-white group-hover:text-[#FFB347] transition-all">
              DM
            </div>
            <div class="hidden sm:block">
              <span class="block font-space text-sm font-bold tracking-widest text-white group-hover:text-[#FFB347] transition-colors">
                {{ profile.full_name }}
              </span>
              <span class="block font-space text-[10px] tracking-widest text-[#F28C28] uppercase">
                2026 PORTFOLIO
              </span>
            </div>
          </a>

          <!-- Top Center: Navigation Links -->
          <nav class="hidden md:flex items-center gap-8 text-xs font-space tracking-widest text-neutral-400">
            <a 
              v-for="item in publicNav" 
              :key="item.anchor" 
              :href="item.anchor"
              class="hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[#F28C28] after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
            >
              {{ item.label }}
            </a>
          </nav>

          <!-- Top Right: Action / Menu Trigger -->
          <div class="flex items-center gap-4">
            <a 
              href="#contact-section" 
              class="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#F28C28]/40 bg-[#F28C28]/10 hover:bg-[#F28C28] text-xs font-space font-semibold tracking-wider text-[#FFB347] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(242,140,40,0.15)]"
            >
              <span>LET'S TALK</span>
              <app-icon name="arrow-up-right" :size="14" />
            </a>

            <!-- Mobile Drawer Button -->
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen" 
              class="md:hidden w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-neutral-300 hover:text-white"
            >
              <app-icon :name="mobileMenuOpen ? 'x' : 'menu'" :size="18" />
            </button>
          </div>
        </div>

        <!-- Mobile Dropdown Navigation -->
        <transition name="fade">
          <div v-if="mobileMenuOpen" class="md:hidden bg-[#0d0d0d] border-b border-white/10 px-6 py-6 space-y-4">
            <a 
              v-for="item in publicNav" 
              :key="item.anchor" 
              :href="item.anchor"
              @click="mobileMenuOpen = false"
              class="block font-space text-sm tracking-widest text-neutral-300 hover:text-[#FFB347] py-2 border-b border-white/5"
            >
              {{ item.label }}
            </a>
            <a 
              href="#contact-section" 
              @click="mobileMenuOpen = false"
              class="block w-full text-center py-2.5 rounded-full bg-[#F28C28] text-black font-space text-xs font-bold tracking-wider"
            >
              LET'S TALK →
            </a>
          </div>
        </transition>
      </header>

      <!-- ================= 2. HERO — DIGITAL IDENTITY ================= -->
      <section class="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            
            <!-- HERO LEFT (Cols 1-4): Editorial Typography & Introduction -->
            <div class="lg:col-span-4 space-y-6 z-10 order-2 lg:order-1">
              <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[#FFB347] font-space text-xs tracking-widest uppercase">
                <span class="w-1.5 h-1.5 rounded-full bg-[#F28C28] animate-pulse"></span>
                <span>{{ profile.hero_badge || 'PORTFOLIO / 2026' }}</span>
              </div>

              <div class="space-y-2">
                <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold font-space text-white tracking-tight leading-[1.05]">
                  {{ profile.full_name }}
                </h1>
                <p class="text-xs sm:text-sm font-space tracking-widest text-[#F28C28] uppercase font-semibold">
                  {{ profile.professional_title }}
                </p>
              </div>

              <p class="text-sm sm:text-base text-neutral-400 font-inter leading-relaxed max-w-md">
                {{ profile.short_intro }}
              </p>

              <!-- CTA Action Buttons -->
              <div class="pt-4 flex flex-wrap items-center gap-4">
                <a 
                  href="#selected-work" 
                  class="px-6 py-3.5 rounded-full bg-[#F28C28] hover:bg-[#FFB347] text-black font-space text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all shadow-[0_0_25px_rgba(242,140,40,0.35)]"
                >
                  <span>VIEW SELECTED WORK</span>
                  <app-icon name="arrow-right" :size="16" />
                </a>

                <a 
                  href="#about-me" 
                  class="px-5 py-3.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 font-space text-xs tracking-widest uppercase flex items-center gap-2 transition-colors"
                >
                  <span>SCROLL</span>
                  <app-icon name="arrow-down" :size="15" />
                </a>
              </div>
            </div>

            <!-- HERO CENTER (Cols 5-8): Portrait & Floating Interactive Markers -->
            <div class="lg:col-span-4 relative flex justify-center items-center order-1 lg:order-2">
              <div class="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5] rounded-3xl overflow-visible group">
                
                <!-- Background Atmospheric Glow Behind Portrait -->
                <div class="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#F28C28]/20 via-[#F28C28]/5 to-transparent blur-2xl -z-10 group-hover:from-[#F28C28]/35 transition-all duration-700"></div>

                <!-- Portrait Container Frame with Rim Lighting -->
                <div class="w-full h-full rounded-3xl overflow-hidden border border-white/15 bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
                  <img 
                    :src="profile.avatar_url || 'assets/images/portrait-cinematic.svg'" 
                    :alt="profile.full_name" 
                    class="w-full h-full object-cover grayscale-[20%] contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <!-- Inner Warm Orange Shadow Gradient -->
                  <div class="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 pointer-events-none"></div>
                </div>

                <!-- Interactive Floating Markers Around Portrait -->
                <div 
                  v-for="marker in interactiveMarkers" 
                  :key="marker.id"
                  class="absolute z-20"
                  :style="{ top: marker.top, left: marker.left, right: marker.right }"
                  @mouseenter="activeMarker = marker.id"
                  @mouseleave="activeMarker = null"
                >
                  <div class="relative group/pin cursor-pointer">
                    <!-- Marker Pulse Halo -->
                    <div class="absolute -inset-2 rounded-full bg-[#F28C28]/30 animate-ping pointer-events-none"></div>
                    
                    <!-- Marker Core Pin -->
                    <div class="relative w-7 h-7 rounded-full bg-[#181818]/90 border border-[#F28C28] flex items-center justify-center text-[#FFB347] shadow-[0_0_15px_rgba(242,140,40,0.6)] hover:bg-[#F28C28] hover:text-black transition-all">
                      <app-icon name="plus" :size="14" />
                    </div>

                    <!-- Marker Hover Floating Info Tooltip -->
                    <transition name="fade">
                      <div 
                        v-if="activeMarker === marker.id" 
                        class="absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-2 rounded-xl bg-[#141414]/95 border border-[#F28C28]/40 backdrop-blur-md shadow-2xl z-30 pointer-events-none text-left"
                      >
                        <div class="text-[10px] font-space font-bold tracking-widest text-[#FFB347] uppercase">{{ marker.label }}</div>
                        <div class="text-[9px] font-inter text-neutral-300">{{ marker.tag }}</div>
                      </div>
                    </transition>
                  </div>
                </div>

              </div>
            </div>

            <!-- HERO RIGHT (Cols 9-12): Floating Glass Information Panels -->
            <div class="lg:col-span-4 space-y-4 z-10 order-3">
              
              <!-- Floating Panel 1: Profile -->
              <div class="p-5 rounded-2xl glass-panel space-y-3 hover:border-white/20 transition-all">
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span class="text-[10px] font-space tracking-widest text-[#F28C28] uppercase font-bold">DIGITAL IDENTITY</span>
                  <span class="text-[10px] font-space text-neutral-400">PHILIPPINES</span>
                </div>
                <div>
                  <h3 class="font-space font-bold text-base text-white">{{ profile.full_name }}</h3>
                  <p class="text-xs font-inter text-neutral-400 mt-0.5">IT Student &amp; Digital Solutions Builder</p>
                </div>
                <div class="flex items-center gap-3 pt-1">
                  <a :href="profile.linkedin_url" target="_blank" class="text-neutral-400 hover:text-[#FFB347] transition-colors" title="LinkedIn">
                    <app-icon name="linkedin" :size="16" />
                  </a>
                  <a :href="profile.github_url" target="_blank" class="text-neutral-400 hover:text-[#FFB347] transition-colors" title="GitHub">
                    <app-icon name="github" :size="16" />
                  </a>
                  <a :href="'mailto:' + profile.email" class="text-neutral-400 hover:text-[#FFB347] transition-colors" title="Email">
                    <app-icon name="mail" :size="16" />
                  </a>
                </div>
              </div>

              <!-- Floating Panel 2: Currently Exploring -->
              <div class="p-5 rounded-2xl glass-panel space-y-3 hover:border-white/20 transition-all">
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span class="text-[10px] font-space tracking-widest text-[#F28C28] uppercase font-bold">CURRENTLY EXPLORING</span>
                  <span class="w-2 h-2 rounded-full bg-[#F28C28] animate-ping"></span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span class="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-space text-neutral-300">Web Development</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-space text-neutral-300">System Architecture</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-space text-neutral-300">UI / UX Design</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-space text-neutral-300">Database Optimization</span>
                  <span class="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-space text-neutral-300">AI Integration</span>
                </div>
              </div>

              <!-- Floating Panel 3: Available For -->
              <div class="p-5 rounded-2xl glass-panel space-y-3 hover:border-white/20 transition-all">
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span class="text-[10px] font-space tracking-widest text-emerald-400 uppercase font-bold">AVAILABLE FOR</span>
                  <span class="inline-flex items-center gap-1.5 text-[10px] font-space text-emerald-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> OPEN
                  </span>
                </div>
                <ul class="space-y-1.5 text-xs font-space text-neutral-300">
                  <li v-for="item in (profile.availability_status || ['School Projects', 'Web Projects', 'System Projects', 'Creative Collaborations'])" :key="item" class="flex items-center gap-2">
                    <span class="w-1 h-1 rounded-full bg-[#F28C28]"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>
      </section>

      <!-- ================= 3. ABOUT SECTION (EDITORIAL SPLIT) ================= -->
      <section id="about-me" class="py-24 sm:py-32 border-t border-white/[0.06] relative">
        <div class="max-w-7xl mx-auto px-6 sm:px-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            <!-- Left Editorial Headline -->
            <div class="lg:col-span-5 space-y-6">
              <span class="text-xs font-space tracking-widest text-[#F28C28] uppercase font-bold">
                01 // BACKGROUND
              </span>
              <h2 class="text-4xl sm:text-5xl lg:text-6xl font-space font-bold text-white tracking-tight leading-[1.08]">
                A LITTLE<br/>
                <span class="font-editorial italic font-normal text-[#FFB347]">About Me.</span>
              </h2>
              <div class="w-16 h-[2px] bg-[#F28C28]"></div>
            </div>

            <!-- Right Content & Editorial Grid -->
            <div class="lg:col-span-7 space-y-10">
              <p class="text-xl sm:text-2xl font-editorial italic text-neutral-200 leading-relaxed font-light">
                "{{ profile.about_me }}"
              </p>

              <!-- Clean Metadata Line Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                <div class="space-y-1">
                  <span class="text-[11px] font-space tracking-widest text-[#F28C28] uppercase">BASED IN</span>
                  <p class="text-sm font-space text-neutral-200 font-semibold">{{ profile.location || 'Philippines' }}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[11px] font-space tracking-widest text-[#F28C28] uppercase">FOCUS</span>
                  <p class="text-sm font-space text-neutral-200 font-semibold">{{ profile.focus_areas || 'Systems • Web • Design' }}</p>
                </div>
                <div class="space-y-1">
                  <span class="text-[11px] font-space tracking-widest text-[#F28C28] uppercase">CURRENTLY</span>
                  <p class="text-sm font-space text-neutral-200 font-semibold">{{ profile.current_status || 'Studying Information Technology' }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ================= 4. SELECTED WORK (EDITORIAL SHOWCASE) ================= -->
      <section id="selected-work" class="py-24 sm:py-32 border-t border-white/[0.06] bg-[#0c0c0c]/40 relative">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 space-y-16">
          
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div class="space-y-3">
              <span class="text-xs font-space tracking-widest text-[#F28C28] uppercase font-bold">
                02 // SELECTED WORK
              </span>
              <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold font-space text-white tracking-tight">
                Featured Systems &amp; Interfaces
              </h2>
            </div>
            <p class="text-xs font-space tracking-widest text-neutral-400 uppercase">
              CLICK A PROJECT TO EXPLORE CASE STUDY OVERLAY →
            </p>
          </div>

          <!-- Project Panels Stack (Large Visual Panels) -->
          <div class="space-y-12">
            <div 
              v-for="(project, index) in projects" 
              :key="project.id"
              @click="openProject(project)"
              class="project-card group cursor-pointer p-6 sm:p-10 rounded-3xl bg-[#111111] border border-white/[0.08] relative overflow-hidden"
            >
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                <!-- Project Text Details (Cols 1-5) -->
                <div class="lg:col-span-5 space-y-6 order-2 lg:order-1">
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-space font-bold text-[#F28C28] tracking-widest uppercase">
                      PROJECT {{ project.project_number || ('0' + (index + 1)) }}
                    </span>
                    <span class="text-neutral-600">•</span>
                    <span class="text-xs font-space text-neutral-400 uppercase">
                      {{ project.year }}
                    </span>
                  </div>

                  <div class="space-y-2">
                    <h3 class="text-2xl sm:text-3xl md:text-4xl font-bold font-space text-white group-hover:text-[#FFB347] transition-colors leading-tight">
                      {{ project.title }}
                    </h3>
                    <p class="text-xs font-space tracking-wider text-[#F28C28] uppercase">
                      {{ project.category }}
                    </p>
                  </div>

                  <p class="text-sm text-neutral-400 font-inter leading-relaxed">
                    {{ project.short_description }}
                  </p>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2 pt-2">
                    <span 
                      v-for="tech in project.technologies" 
                      :key="tech"
                      class="px-3 py-1 rounded-full bg-[#181818] border border-white/5 text-[11px] font-space tracking-wider text-neutral-300"
                    >
                      {{ tech }}
                    </span>
                  </div>

                  <!-- Explore Case Study Button -->
                  <div class="pt-4">
                    <span class="inline-flex items-center gap-2 text-xs font-space font-bold tracking-widest text-[#FFB347] group-hover:text-white uppercase transition-colors">
                      <span>EXPLORE CASE STUDY</span>
                      <app-icon name="arrow-up-right" :size="16" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </div>
                </div>

                <!-- Project Preview Image (Cols 6-12) -->
                <div class="lg:col-span-7 order-1 lg:order-2">
                  <div class="relative rounded-2xl overflow-hidden bg-[#181818] border border-white/10 aspect-[16/10] shadow-2xl">
                    <img 
                      :src="project.cover_image || 'assets/images/project-default.svg'" 
                      :alt="project.title" 
                      class="img-zoom w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700"
                    />
                    <!-- Overlay Badge -->
                    <div class="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#080808]/80 backdrop-blur-md border border-white/10 text-[10px] font-space tracking-widest text-neutral-300 uppercase">
                      EXPAND CASE STUDY
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ================= 5. MY TOOLKIT / SKILLS ================= -->
      <section id="my-toolkit" class="py-24 sm:py-32 border-t border-white/[0.06] relative">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 space-y-16">
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div class="space-y-3">
              <span class="text-xs font-space tracking-widest text-[#F28C28] uppercase font-bold">
                03 // TECH CAPABILITIES
              </span>
              <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold font-space text-white tracking-tight">
                My Toolkit
              </h2>
            </div>
            <p class="text-xs font-space tracking-wider text-neutral-400 max-w-md">
              A curated overview of technologies, frameworks, and workflows actively utilized in development and ongoing study.
            </p>
          </div>

          <!-- Organized Categories Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="cat in skillCategories" 
              :key="cat.id"
              class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] hover:border-[#F28C28]/30 transition-all space-y-5"
            >
              <div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 class="font-space font-bold text-xs tracking-widest text-[#FFB347] uppercase">
                  {{ cat.name }}
                </h3>
                <span class="text-[10px] font-space text-neutral-500">{{ (cat.skills || []).length }} TOOLS</span>
              </div>

              <div class="space-y-3">
                <div 
                  v-for="skill in cat.skills" 
                  :key="skill.id"
                  class="p-3 rounded-xl bg-[#161616] border border-white/[0.04] hover:border-white/10 transition-colors flex items-start gap-3.5 group"
                >
                  <div class="w-8 h-8 rounded-lg bg-[#202020] border border-white/5 flex items-center justify-center shrink-0 text-[#F28C28] group-hover:bg-[#F28C28] group-hover:text-black transition-colors mt-0.5">
                    <app-icon :name="skill.icon_name || 'code'" :size="15" />
                  </div>
                  <div>
                    <h4 class="font-space font-semibold text-xs text-white group-hover:text-[#FFB347] transition-colors">
                      {{ skill.name }}
                    </h4>
                    <p v-if="skill.description" class="text-[11px] text-neutral-400 font-inter mt-0.5 leading-relaxed">
                      {{ skill.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ================= 6. THE JOURNEY / TIMELINE ================= -->
      <section id="the-journey" class="py-24 sm:py-32 border-t border-white/[0.06] bg-[#0c0c0c]/40 relative">
        <div class="max-w-4xl mx-auto px-6 sm:px-10 space-y-16">
          
          <div class="text-center space-y-3">
            <span class="text-xs font-space tracking-widest text-[#F28C28] uppercase font-bold">
              04 // TIMELINE
            </span>
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold font-space text-white tracking-tight">
              The Journey
            </h2>
          </div>

          <!-- Minimal Vertical Editorial Timeline -->
          <div class="relative border-l border-white/[0.1] ml-4 sm:ml-32 space-y-12">
            <div 
              v-for="item in experience" 
              :key="item.id"
              class="relative pl-8 sm:pl-12 group"
            >
              <!-- Timeline Marker Node -->
              <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#111111] border-2 border-[#F28C28] group-hover:scale-125 group-hover:bg-[#F28C28] transition-all"></div>

              <!-- Year Label on the Left for Desktop -->
              <div class="sm:absolute sm:-left-32 sm:top-0 text-left sm:text-right w-24">
                <span class="text-lg font-space font-bold text-[#FFB347]">
                  {{ item.year }}
                </span>
              </div>

              <!-- Content Panel -->
              <div class="p-6 rounded-2xl bg-[#141414] border border-white/[0.06] group-hover:border-white/15 transition-all space-y-2">
                <div class="flex items-center justify-between">
                  <h3 class="font-space font-bold text-base text-white">
                    {{ item.title }}
                  </h3>
                  <span class="text-[10px] font-space uppercase tracking-wider text-[#F28C28]">
                    {{ item.category }}
                  </span>
                </div>
                <p class="text-sm text-neutral-400 font-inter leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- ================= 7. DESIGN PHILOSOPHY ================= -->
      <section class="py-28 sm:py-36 border-t border-white/[0.06] relative overflow-hidden text-center">
        <div class="max-w-5xl mx-auto px-6 sm:px-10 space-y-6">
          <span class="text-xs font-space tracking-widest text-[#F28C28] uppercase font-bold">
            // CORE DESIGN PHILOSOPHY
          </span>
          <div class="space-y-4">
            <h2 class="text-3xl sm:text-5xl md:text-6xl font-space font-bold tracking-tight text-neutral-300 leading-tight">
              DESIGN SHOULD NOT<br class="hidden sm:inline" /> JUST LOOK GOOD.
            </h2>
            <h2 class="text-3xl sm:text-5xl md:text-6xl font-editorial italic text-[#FFB347] font-normal leading-tight">
              It Should Make Things Feel Simple.
            </h2>
          </div>
          <div class="w-12 h-[2px] bg-[#F28C28] mx-auto mt-6"></div>
        </div>
      </section>

      <!-- ================= 8. CONTACT SECTION ================= -->
      <section id="contact-section" class="py-24 sm:py-32 border-t border-white/[0.06] bg-[#0d0d0d] relative">
        <div class="max-w-7xl mx-auto px-6 sm:px-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            <!-- Contact Left Column -->
            <div class="lg:col-span-5 space-y-8">
              <div class="space-y-3">
                <span class="text-xs font-space tracking-widest text-[#F28C28] uppercase font-bold">
                  05 // CONTACT &amp; COLLABORATION
                </span>
                <h2 class="text-4xl sm:text-5xl font-space font-bold text-white tracking-tight leading-tight">
                  LET'S CREATE<br />SOMETHING.
                </h2>
                <p class="text-neutral-400 font-inter text-sm sm:text-base leading-relaxed max-w-md">
                  Have a system project, collaboration idea, or question? Send a transmission directly through this form.
                </p>
              </div>

              <!-- Direct Channels -->
              <div class="space-y-4 pt-4 border-t border-white/[0.08]">
                <a :href="'mailto:' + profile.email" class="flex items-center gap-3 text-neutral-300 hover:text-[#FFB347] transition-colors group">
                  <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F28C28] group-hover:border-[#F28C28] transition-colors">
                    <app-icon name="mail" :size="18" />
                  </div>
                  <div>
                    <span class="block text-[10px] font-space uppercase text-[#F28C28]">DIRECT EMAIL</span>
                    <span class="text-sm font-space">{{ profile.email }}</span>
                  </div>
                </a>

                <a :href="profile.linkedin_url" target="_blank" class="flex items-center gap-3 text-neutral-300 hover:text-[#FFB347] transition-colors group">
                  <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F28C28] group-hover:border-[#F28C28] transition-colors">
                    <app-icon name="linkedin" :size="18" />
                  </div>
                  <div>
                    <span class="block text-[10px] font-space uppercase text-[#F28C28]">PROFESSIONAL NETWORK</span>
                    <span class="text-sm font-space">LinkedIn Profile</span>
                  </div>
                </a>

                <a :href="profile.github_url" target="_blank" class="flex items-center gap-3 text-neutral-300 hover:text-[#FFB347] transition-colors group">
                  <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F28C28] group-hover:border-[#F28C28] transition-colors">
                    <app-icon name="github" :size="18" />
                  </div>
                  <div>
                    <span class="block text-[10px] font-space uppercase text-[#F28C28]">CODE REPOSITORIES</span>
                    <span class="text-sm font-space">GitHub Portfolio</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Contact Right: Form -->
            <div class="lg:col-span-7">
              <form @submit.prevent="submitContact" class="p-8 sm:p-10 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-2xl space-y-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <form-field label="Your Name" required>
                    <input 
                      v-model="contactForm.sender_name" 
                      type="text" 
                      placeholder="e.g. Alex Morgan" 
                      required 
                      class="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-white/10 text-white text-sm focus:outline-none focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] transition-colors"
                    />
                  </form-field>

                  <form-field label="Email Address" required>
                    <input 
                      v-model="contactForm.email" 
                      type="email" 
                      placeholder="alex@example.com" 
                      required 
                      class="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-white/10 text-white text-sm focus:outline-none focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] transition-colors"
                    />
                  </form-field>
                </div>

                <form-field label="Subject">
                  <input 
                    v-model="contactForm.subject" 
                    type="text" 
                    placeholder="System Development Project Inquiry" 
                    class="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-white/10 text-white text-sm focus:outline-none focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] transition-colors"
                  />
                </form-field>

                <form-field label="Your Message" required>
                  <textarea 
                    v-model="contactForm.message" 
                    rows="5" 
                    placeholder="Tell me about your project scope, timeline, and vision..." 
                    required 
                    class="w-full px-4 py-3 rounded-xl bg-[#0e0e0e] border border-white/10 text-white text-sm focus:outline-none focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] transition-colors resize-none"
                  ></textarea>
                </form-field>

                <button 
                  type="submit" 
                  :disabled="isSubmittingContact"
                  class="w-full py-4 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(242,140,40,0.3)] disabled:opacity-50"
                >
                  <span v-if="!isSubmittingContact">TRANSMIT MESSAGE →</span>
                  <span v-else class="flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
                    <span>SENDING TRANSMISSION...</span>
                  </span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <!-- ================= 9. LUXURY FOOTER ================= -->
      <footer class="py-12 border-t border-white/[0.06] bg-[#080808] text-xs font-space text-neutral-500">
        <div class="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="font-bold text-white tracking-widest">{{ profile.full_name }}</span>
            <span>•</span>
            <span>© {{ settings.year || '2026' }} ALL RIGHTS RESERVED</span>
          </div>

          <div class="flex items-center gap-6">
            <a href="#about-me" class="hover:text-neutral-300 transition-colors">ABOUT</a>
            <a href="#selected-work" class="hover:text-neutral-300 transition-colors">WORK</a>
            <a href="#my-toolkit" class="hover:text-neutral-300 transition-colors">TOOLKIT</a>
            
            <!-- Discreet Admin Portal Link -->
            <router-link to="/admin" class="text-neutral-600 hover:text-[#F28C28] transition-colors flex items-center gap-1">
              <app-icon name="lock" :size="12" />
              <span>CMS</span>
            </router-link>
          </div>
        </div>
      </footer>

      <!-- Editorial Case Study Overlay Modal -->
      <project-modal />

    </div>
  `
};
