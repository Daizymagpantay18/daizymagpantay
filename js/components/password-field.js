// Password Field with Show/Hide Toggle
const PasswordField = {
  name: 'PasswordField',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: 'Password',
    },
    placeholder: {
      type: String,
      default: '••••••••',
    },
    required: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showPassword: false,
    };
  },
  template: `
    <div class="w-full">
      <label v-if="label" class="block text-xs font-space uppercase tracking-wider text-neutral-400 mb-2">
        {{ label }} <span v-if="required" class="text-[#F28C28]">*</span>
      </label>
      <div class="relative">
        <input 
          :type="showPassword ? 'text' : 'password'"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :placeholder="placeholder"
          :required="required"
          class="w-full px-4 py-2.5 bg-[#111111] border border-white/10 rounded-lg text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28] focus:ring-1 focus:ring-[#F28C28] transition-colors pr-10 font-inter"
        />
        <button 
          type="button" 
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors focus:outline-none"
          tabindex="-1"
        >
          <app-icon :name="showPassword ? 'eye-off' : 'eye'" :size="16" />
        </button>
      </div>
    </div>
  `
};
