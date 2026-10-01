// App Icon Component rendering Lucide SVG icons dynamically
const AppIcon = {
  name: 'AppIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 18,
    },
    strokeWidth: {
      type: [Number, String],
      default: 2,
    },
    class: {
      type: String,
      default: '',
    }
  },
  mounted() {
    this.renderIcon();
  },
  updated() {
    this.renderIcon();
  },
  methods: {
    renderIcon() {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({
          root: this.$el,
        });
      }
    }
  },
  template: `
    <span class="inline-flex items-center justify-center pointer-events-none" :class="$props.class">
      <i :data-lucide="name" :style="{ width: size + 'px', height: size + 'px', strokeWidth: strokeWidth }"></i>
    </span>
  `
};
