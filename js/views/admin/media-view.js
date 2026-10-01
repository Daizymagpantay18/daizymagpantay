// Admin Media Library View Component
const AdminMediaView = {
  name: 'AdminMediaView',
  data() {
    return {
      mediaList: [],
      searchQuery: '',
      isUploading: false,
      previewMediaItem: null,
      isLoading: true
    };
  },
  async mounted() {
    await this.fetchMedia();
  },
  methods: {
    async fetchMedia() {
      this.isLoading = true;
      const res = await AppController.getMedia(this.searchQuery);
      if (res && res.data) {
        this.mediaList = res.data;
      }
      this.isLoading = false;
    },
    async handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      this.isUploading = true;
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('file', files[i]);
        fd.append('folder', 'media');
        await AppController.uploadMedia(fd);
      }
      this.isUploading = false;
      AppAlerts.toast('Media uploaded to library.');
      await this.fetchMedia();
    },
    copyPath(path) {
      navigator.clipboard.writeText(path);
      AppAlerts.toast('Image path copied to clipboard: ' + path);
    },
    async deleteMedia(item) {
      const confirmed = await AppAlerts.confirm(`Delete file "${item.filename}"?`, 'This file will be permanently removed from disk.');
      if (confirmed) {
        const res = await AppController.deleteMedia(item.id);
        if (res && res.success) {
          AppAlerts.toast('Media deleted.');
          await this.fetchMedia();
        } else {
          AppAlerts.toast(res.message || 'Failed to delete media.', 'error');
        }
      }
    },
    formatSize(bytes) {
      return AppModel.formatFileSize(bytes);
    },
    formatDate(dateStr) {
      return AppModel.formatDateTime(dateStr);
    }
  },
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <page-header 
        title="Media Library" 
        subtitle="Manage uploaded cover illustrations, UI screenshots, portraits, and asset assets."
        :badge="mediaList.length + ' FILES'"
      >
        <template #actions>
          <label class="px-4 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#FFB347] text-black font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(242,140,40,0.3)]">
            <app-icon name="upload-cloud" :size="16" />
            <span>Upload New Media</span>
            <input type="file" multiple accept="image/*" @change="handleFileUpload" class="hidden" />
          </label>
        </template>
      </page-header>

      <!-- Upload Drop Area / Controls -->
      <div class="p-6 rounded-2xl bg-[#111111] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="w-full sm:w-80 relative">
          <input 
            v-model="searchQuery" 
            @input="fetchMedia"
            type="text" 
            placeholder="Search media filename or caption..." 
            class="w-full px-4 py-2.5 pl-10 bg-[#181818] border border-white/10 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-[#F28C28]"
          />
          <app-icon name="search" :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        </div>

        <div v-if="isUploading" class="flex items-center gap-2 text-xs font-space text-[#FFB347]">
          <span class="w-3 h-3 rounded-full border-2 border-[#FFB347] border-t-transparent animate-spin"></span>
          <span>Uploading media files...</span>
        </div>
      </div>

      <!-- Media Visual Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="item in mediaList" 
          :key="item.id"
          class="rounded-2xl bg-[#111111] border border-white/[0.08] overflow-hidden group hover:border-[#F28C28]/40 transition-all flex flex-col justify-between"
        >
          <!-- Thumbnail Image -->
          <div class="relative w-full aspect-video bg-[#181818] overflow-hidden">
            <img :src="item.file_path" :alt="item.caption || item.filename" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <button 
                @click="copyPath(item.file_path)"
                class="p-2 rounded-lg bg-[#F28C28] text-black font-bold"
                title="Copy Relative Path"
              >
                <app-icon name="copy" :size="15" />
              </button>
              <button 
                @click="deleteMedia(item)"
                class="p-2 rounded-lg bg-rose-500 text-white"
                title="Delete Media"
              >
                <app-icon name="trash-2" :size="15" />
              </button>
            </div>
          </div>

          <!-- Metadata info -->
          <div class="p-4 space-y-1 bg-[#141414] border-t border-white/5">
            <p class="font-space text-xs font-semibold text-white truncate" :title="item.filename">
              {{ item.caption || item.filename }}
            </p>
            <div class="flex items-center justify-between text-[10px] font-space text-neutral-500">
              <span>{{ formatSize(item.file_size) }}</span>
              <span>{{ formatDate(item.uploaded_at) }}</span>
            </div>
          </div>
        </div>

        <div v-if="mediaList.length === 0" class="col-span-full py-16 text-center rounded-3xl bg-[#111111] border border-white/5 text-neutral-500 text-sm font-space">
          No media uploaded yet. Use the "Upload New Media" button above to populate your gallery.
        </div>
      </div>
    </div>
  `
};
