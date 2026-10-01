// Admin Messages / Inbox Management View Component
const AdminMessagesView = {
  name: 'AdminMessagesView',
  data() {
    return {
      messages: [],
      searchQuery: '',
      statusFilter: 'all',
      selectedMessage: null,
      isViewModalOpen: false,
      isLoading: true
    };
  },
  computed: {
    unreadCount() {
      return this.messages.filter(m => m.status === 'Unread').length;
    }
  },
  async mounted() {
    await this.fetchMessages();
  },
  methods: {
    async fetchMessages() {
      this.isLoading = true;
      const res = await AppController.getMessages({
        status: this.statusFilter,
        search: this.searchQuery
      });
      if (res && res.data) {
        this.messages = res.data;
      }
      this.isLoading = false;
    },
    async viewMessage(msg) {
      this.selectedMessage = msg;
      this.isViewModalOpen = true;

      if (msg.status === 'Unread') {
        await this.setStatus(msg, 'Read');
      }
    },
    async setStatus(msg, status) {
      const res = await AppController.updateMessageStatus(msg.id, status);
      if (res && res.success) {
        msg.status = status;
        AppAlerts.toast(`Marked as ${status}.`);
      }
    },
    async deleteMessage(msg) {
      const confirmed = await AppAlerts.confirm(`Delete message from ${msg.sender_name}?`, 'This transmission will be permanently erased.');
      if (confirmed) {
        const res = await AppController.deleteMessage(msg.id);
        if (res && res.success) {
          AppAlerts.toast('Message deleted.');
          this.isViewModalOpen = false;
          await this.fetchMessages();
        } else {
          AppAlerts.toast(res.message || 'Failed to delete message.', 'error');
        }
      }
    },
    formatDate(dateStr) {
      return AppModel.formatDateTime(dateStr);
    }
  },
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <page-header 
        title="Inquiries &amp; Messages" 
        subtitle="Manage transmissions received through your public portfolio contact portal."
        :badge="unreadCount + ' UNREAD'"
      />

      <!-- Search & Filters -->
      <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="w-full sm:w-80 relative">
          <input 
            v-model="searchQuery" 
            @input="fetchMessages"
            type="text" 
            placeholder="Search sender, email, subject..." 
            class="w-full px-4 py-2.5 pl-10 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
          />
          <app-icon name="search" :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button 
            @click="statusFilter = 'all'; fetchMessages()"
            class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors"
            :class="statusFilter === 'all' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
          >
            All
          </button>
          <button 
            @click="statusFilter = 'Unread'; fetchMessages()"
            class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors"
            :class="statusFilter === 'Unread' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
          >
            Unread
          </button>
          <button 
            @click="statusFilter = 'Read'; fetchMessages()"
            class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors"
            :class="statusFilter === 'Read' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
          >
            Read
          </button>
          <button 
            @click="statusFilter = 'Replied'; fetchMessages()"
            class="px-4 py-2 rounded-xl text-xs font-space tracking-wider uppercase transition-colors"
            :class="statusFilter === 'Replied' ? 'bg-[#F28C28] text-black font-bold' : 'bg-white/5 text-neutral-400 hover:text-white'"
          >
            Replied
          </button>
        </div>
      </div>

      <!-- Messages Table -->
      <div class="rounded-3xl bg-[#111111] border border-white/[0.08] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm font-inter">
            <thead>
              <tr class="text-[11px] font-space uppercase tracking-wider text-neutral-400 bg-[#141414] border-b border-white/5">
                <th class="py-4 px-6 font-semibold">Sender</th>
                <th class="py-4 px-4 font-semibold">Subject &amp; Excerpt</th>
                <th class="py-4 px-4 font-semibold">Date</th>
                <th class="py-4 px-4 font-semibold">Status</th>
                <th class="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr 
                v-for="msg in messages" 
                :key="msg.id" 
                class="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                :class="msg.status === 'Unread' ? 'bg-[#F28C28]/[0.02]' : ''"
                @click="viewMessage(msg)"
              >
                <!-- Sender -->
                <td class="py-4 px-6">
                  <div class="space-y-0.5">
                    <span class="block font-space font-semibold text-white group-hover:text-[#FFB347] transition-colors">
                      {{ msg.sender_name }}
                    </span>
                    <span class="block text-xs text-neutral-500 font-inter">
                      {{ msg.email }}
                    </span>
                  </div>
                </td>

                <!-- Subject & Message excerpt -->
                <td class="py-4 px-4">
                  <div class="space-y-0.5 max-w-md">
                    <span class="block font-space font-medium text-neutral-200 text-xs">
                      {{ msg.subject || 'Portfolio Inquiry' }}
                    </span>
                    <p class="text-xs text-neutral-400 line-clamp-1">
                      {{ msg.message }}
                    </p>
                  </div>
                </td>

                <!-- Date -->
                <td class="py-4 px-4 text-xs font-space text-neutral-400 whitespace-nowrap">
                  {{ formatDate(msg.created_at) }}
                </td>

                <!-- Status -->
                <td class="py-4 px-4">
                  <status-badge :status="msg.status" size="sm" />
                </td>

                <!-- Actions -->
                <td class="py-4 px-6 text-right" @click.stop>
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="viewMessage(msg)"
                      class="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
                      title="Inspect Transmission"
                    >
                      <app-icon name="eye" :size="15" />
                    </button>
                    <button 
                      @click="deleteMessage(msg)"
                      class="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Transmission"
                    >
                      <app-icon name="trash-2" :size="15" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="messages.length === 0">
                <td colspan="5" class="py-12 text-center text-sm text-neutral-500 font-space">
                  No messages found in inbox.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Message Detail Modal Dialog -->
      <app-modal 
        :is-open="isViewModalOpen && !!selectedMessage"
        :title="selectedMessage ? selectedMessage.subject : 'Message Details'"
        :subtitle="selectedMessage ? ('From: ' + selectedMessage.sender_name + ' (' + selectedMessage.email + ')') : ''"
        @close="isViewModalOpen = false"
      >
        <div v-if="selectedMessage" class="space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-white/5">
            <div class="space-y-1">
              <span class="text-[11px] font-space text-neutral-400 uppercase">TRANSMISSION TIME</span>
              <p class="text-xs font-space text-neutral-200">{{ formatDate(selectedMessage.created_at) }}</p>
            </div>
            <div>
              <status-badge :status="selectedMessage.status" />
            </div>
          </div>

          <!-- Body -->
          <div class="p-4 rounded-xl bg-[#181818] border border-white/5">
            <p class="text-neutral-200 font-inter text-sm leading-relaxed whitespace-pre-line">
              {{ selectedMessage.message }}
            </p>
          </div>
        </div>

        <template #footer>
          <div v-if="selectedMessage" class="flex items-center justify-between w-full">
            <button 
              type="button" 
              @click="deleteMessage(selectedMessage)"
              class="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-space uppercase"
            >
              Delete
            </button>

            <div class="flex items-center gap-3">
              <button 
                type="button" 
                v-if="selectedMessage.status !== 'Replied'"
                @click="setStatus(selectedMessage, 'Replied')"
                class="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl text-xs font-space uppercase"
              >
                Mark Replied
              </button>

              <a 
                :href="'mailto:' + selectedMessage.email + '?subject=' + encodeURIComponent('Re: ' + selectedMessage.subject)"
                @click="setStatus(selectedMessage, 'Replied')"
                class="px-5 py-2 bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase rounded-xl flex items-center gap-1.5"
              >
                <app-icon name="send" :size="14" />
                <span>Send Reply Email</span>
              </a>
            </div>
          </div>
        </template>
      </app-modal>
    </div>
  `
};
