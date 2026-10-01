// Public Project Detail Case Study Overlay Component
const ProjectModal = {
  name: 'ProjectModal',
  computed: {
    project() {
      return AppStore.selectedProject;
    },
    isOpen() {
      return !!AppStore.selectedProject;
    }
  },
  methods: {
    close() {
      AppStore.closeProjectModal();
    },
    handleKeydown(e) {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  template: `
    <teleport to="body">
      <transition name="fade">
        <div v-if="isOpen && project" class="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-3 sm:p-6 md:p-12">
          <!-- Backdrop -->
          <div 
            class="fixed inset-0 bg-black/90 backdrop-blur-xl transition-opacity"
            @click="close"
          ></div>

          <!-- Editorial Case Study Container -->
          <div class="relative w-full max-w-5xl bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl z-10 my-6 overflow-hidden">
            <!-- Top Sticky Action Bar -->
            <div class="sticky top-0 z-20 px-6 sm:px-8 py-4 bg-[#0e0e0e]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-xs font-space font-bold text-[#F28C28] tracking-widest uppercase">
                  PROJECT {{ project.project_number || '01' }}
                </span>
                <span class="text-neutral-600">•</span>
                <span class="text-xs font-space text-neutral-400 uppercase tracking-wider">
                  {{ project.category }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <a 
                  v-if="project.github_url && project.github_url !== '#'" 
                  :href="project.github_url" 
                  target="_blank"
                  class="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-space text-neutral-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all"
                >
                  <app-icon name="github" :size="14" />
                  <span class="hidden sm:inline">Repository</span>
                </a>

                <a 
                  v-if="project.project_url && project.project_url !== '#'" 
                  :href="project.project_url" 
                  target="_blank"
                  class="px-4 py-1.5 rounded-full bg-[#F28C28] hover:bg-[#FFB347] text-xs font-space font-bold text-black flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(242,140,40,0.3)]"
                >
                  <span>Live Demo</span>
                  <app-icon name="arrow-up-right" :size="14" />
                </a>

                <button 
                  @click="close"
                  class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 flex items-center justify-center transition-all ml-2"
                  title="Close (Esc)"
                >
                  <app-icon name="x" :size="16" />
                </button>
              </div>
            </div>

            <!-- Case Study Content Body -->
            <div class="p-6 sm:p-10 space-y-12 max-h-[calc(90vh-80px)] overflow-y-auto custom-scrollbar">
              
              <!-- Header Section -->
              <div class="space-y-4">
                <div class="inline-block px-3 py-1 rounded-full bg-[#F28C28]/10 border border-[#F28C28]/20 text-[#FFB347] text-xs font-space tracking-widest uppercase">
                  CASE STUDY ARCHIVE // {{ project.year }}
                </div>
                <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold font-space text-white tracking-tight leading-tight">
                  {{ project.title }}
                </h2>
                <p class="text-lg text-neutral-300 font-inter leading-relaxed max-w-3xl">
                  {{ project.short_description }}
                </p>
              </div>

              <!-- Cover Image Display -->
              <div class="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#141414] aspect-video">
                <img 
                  :src="project.cover_image || 'assets/images/project-default.svg'" 
                  :alt="project.title" 
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Metadata Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/[0.08] bg-white/[0.01] rounded-xl px-4">
                <div>
                  <span class="block text-[11px] font-space tracking-widest text-[#F28C28] uppercase">ROLE</span>
                  <span class="block text-sm font-space text-neutral-200 mt-1 font-semibold">{{ project.role || 'Full-Stack Developer' }}</span>
                </div>
                <div>
                  <span class="block text-[11px] font-space tracking-widest text-[#F28C28] uppercase">YEAR</span>
                  <span class="block text-sm font-space text-neutral-200 mt-1 font-semibold">{{ project.year || '2026' }}</span>
                </div>
                <div>
                  <span class="block text-[11px] font-space tracking-widest text-[#F28C28] uppercase">CATEGORY</span>
                  <span class="block text-sm font-space text-neutral-200 mt-1 font-semibold">{{ project.category }}</span>
                </div>
                <div>
                  <span class="block text-[11px] font-space tracking-widest text-[#F28C28] uppercase">STATUS</span>
                  <span class="block text-sm font-space text-emerald-400 mt-1 font-semibold">{{ project.status || 'Active' }}</span>
                </div>
              </div>

              <!-- Technology Stack Tags -->
              <div class="space-y-3">
                <h3 class="text-xs font-space tracking-widest text-neutral-400 uppercase">TECHNOLOGIES &amp; TOOLS</h3>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tech in project.technologies" 
                    :key="tech"
                    class="px-3 py-1 rounded-full bg-[#181818] border border-white/10 text-xs font-space tracking-wider text-neutral-300"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Deep Dive: Overview, Problem, Solution, Contribution -->
              <div class="space-y-10">
                <!-- Overview -->
                <div v-if="project.full_description" class="space-y-3">
                  <h3 class="text-xs font-space tracking-widest text-[#F28C28] uppercase flex items-center gap-2">
                    <app-icon name="layers" :size="15" /> OVERVIEW
                  </h3>
                  <p class="text-neutral-300 font-inter leading-relaxed text-sm sm:text-base">
                    {{ project.full_description }}
                  </p>
                </div>

                <!-- Problem & Solution Split -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- The Problem -->
                  <div class="p-6 rounded-xl bg-[#141414] border border-white/[0.08] space-y-3">
                    <h3 class="text-xs font-space tracking-widest text-rose-400 uppercase flex items-center gap-2 font-bold">
                      <app-icon name="alert-circle" :size="15" /> THE PROBLEM
                    </h3>
                    <p class="text-neutral-300 font-inter text-sm leading-relaxed">
                      {{ project.problem || 'Manual operations and lack of digitized verification caused processing bottlenecks and administrative delays.' }}
                    </p>
                  </div>

                  <!-- The Solution -->
                  <div class="p-6 rounded-xl bg-[#141414] border border-[#F28C28]/20 space-y-3">
                    <h3 class="text-xs font-space tracking-widest text-[#FFB347] uppercase flex items-center gap-2 font-bold">
                      <app-icon name="check-circle-2" :size="15" /> THE SOLUTION
                    </h3>
                    <p class="text-neutral-300 font-inter text-sm leading-relaxed">
                      {{ project.solution || 'Engineered an automated digital platform that verifies credentials instantly with secure real-time tracking.' }}
                    </p>
                  </div>
                </div>

                <!-- My Contribution -->
                <div class="p-6 rounded-xl bg-gradient-to-r from-[#181818] to-[#121212] border border-white/10 space-y-3">
                  <h3 class="text-xs font-space tracking-widest text-[#F28C28] uppercase flex items-center gap-2 font-bold">
                    <app-icon name="code" :size="15" /> MY CONTRIBUTION &amp; ARCHITECTURE
                  </h3>
                  <p class="text-neutral-300 font-inter text-sm leading-relaxed">
                    {{ project.my_contribution || 'Led the system development, structured the normalized database schema, and implemented responsive UI microinteractions.' }}
                  </p>
                </div>
              </div>

              <!-- Project Screenshots Gallery -->
              <div v-if="project.screenshots && project.screenshots.length > 0" class="space-y-6">
                <h3 class="text-xs font-space tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                  <app-icon name="image" :size="15" /> PROJECT SCREENSHOTS &amp; INTERFACES
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    v-for="(img, idx) in project.screenshots" 
                    :key="idx"
                    class="rounded-xl overflow-hidden border border-white/10 bg-[#141414] group"
                  >
                    <img 
                      :src="img.image_url" 
                      :alt="img.caption || ('Screenshot ' + (idx + 1))" 
                      class="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div v-if="img.caption" class="p-3 bg-[#111111] border-t border-white/5">
                      <p class="text-xs font-space text-neutral-400">{{ img.caption }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom Close / Next CTA -->
              <div class="pt-8 border-t border-white/[0.08] flex items-center justify-between">
                <button 
                  @click="close"
                  class="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-space tracking-wider uppercase text-neutral-300 hover:text-white border border-white/10 transition-colors"
                >
                  CLOSE OVERLAY
                </button>
                <a 
                  href="#contact-section" 
                  @click="close"
                  class="px-6 py-2.5 rounded-full bg-[#F28C28] hover:bg-[#FFB347] text-xs font-space font-bold tracking-wider uppercase text-black transition-colors"
                >
                  DISCUSS THIS PROJECT →
                </a>
              </div>

            </div>
          </div>
        </div>
      </transition>
    </teleport>
  `
};
