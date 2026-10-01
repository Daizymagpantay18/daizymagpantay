// App Modal Component
const AppModal = {
  name: 'AppModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: 'max-w-2xl', // 'max-w-md', 'max-w-lg', 'max-w-2xl', 'max-w-4xl', 'max-w-5xl'
    }
  },
  emits: ['close'],
  template: `
    <teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Dialog Card -->
        <div 
          class="relative w-full rounded-2xl bg-[#141414] border border-white/10 shadow-2xl overflow-hidden z-10 my-8 transition-all"
          :class="maxWidth"
        >
          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#181818]/60 backdrop-blur-sm">
            <div>
              <h3 class="text-lg font-bold font-space text-white tracking-tight">
                {{ title }}
              </h3>
              <p v-if="subtitle" class="text-xs text-neutral-400 font-inter mt-0.5">
                {{ subtitle }}
              </p>
            </div>
            <button 
              @click="$emit('close')"
              class="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/5"
            >
              <app-icon name="x" :size="16" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 max-h-[calc(85vh-130px)] overflow-y-auto custom-scrollbar">
            <slot></slot>
          </div>

          <!-- Modal Footer (Optional) -->
          <div v-if="$slots.footer" class="px-6 py-4 bg-[#111111] border-t border-white/[0.08] flex items-center justify-end gap-3">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </teleport>
  `
};
