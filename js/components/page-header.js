// Admin Page Header Component
const PageHeader = {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    }
  },
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/[0.08]">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl lg:text-3xl font-bold font-space text-white tracking-tight">
            {{ title }}
          </h1>
          <span v-if="badge" class="px-2 py-0.5 text-xs font-space font-medium rounded-full bg-[#F28C28]/15 text-[#FFB347] border border-[#F28C28]/30">
            {{ badge }}
          </span>
        </div>
        <p v-if="subtitle" class="text-sm text-neutral-400 font-inter mt-1">
          {{ subtitle }}
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <slot name="actions"></slot>
      </div>
    </div>
  `
};
