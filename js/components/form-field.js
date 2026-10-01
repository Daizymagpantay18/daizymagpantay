// Form Field Component
const FormField = {
  name: 'FormField',
  props: {
    label: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    }
  },
  template: `
    <div class="w-full space-y-1.5">
      <div v-if="label" class="flex items-center justify-between">
        <label class="block text-xs font-space uppercase tracking-wider text-neutral-400">
          {{ label }} <span v-if="required" class="text-[#F28C28]">*</span>
        </label>
        <span v-if="hint" class="text-[11px] text-neutral-500 font-inter">{{ hint }}</span>
      </div>
      <div>
        <slot></slot>
      </div>
      <p v-if="error" class="text-xs text-rose-400 font-inter mt-1">{{ error }}</p>
    </div>
  `
};
