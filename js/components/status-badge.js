// Status Badge Component
const StatusBadge = {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      default: 'Published'
    },
    size: {
      type: String,
      default: 'md' // 'sm', 'md'
    }
  },
  computed: {
    badgeClasses() {
      const s = (this.status || '').toLowerCase();
      switch (s) {
        case 'published':
        case 'active':
        case 'read':
          return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        case 'draft':
          return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        case 'unread':
          return 'bg-[#F28C28]/15 text-[#FFB347] border border-[#F28C28]/30 animate-pulse';
        case 'replied':
          return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
        default:
          return 'bg-neutral-800 text-neutral-300 border border-neutral-700';
      }
    },
    dotColor() {
      const s = (this.status || '').toLowerCase();
      switch (s) {
        case 'published':
        case 'active':
        case 'read':
          return 'bg-emerald-400';
        case 'draft':
          return 'bg-amber-400';
        case 'unread':
          return 'bg-[#F28C28]';
        case 'replied':
          return 'bg-cyan-400';
        default:
          return 'bg-neutral-400';
      }
    }
  },
  template: `
    <span 
      class="inline-flex items-center font-space tracking-wider uppercase rounded-full font-medium transition-colors"
      :class="[
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        badgeClasses
      ]"
    >
      <span class="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" :class="dotColor"></span>
      {{ status }}
    </span>
  `
};
