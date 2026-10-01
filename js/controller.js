// API Controller & HTTP Service Layer
const AppController = {
  baseUrl: 'api',

  async request(endpoint, options = {}) {
    const defaultHeaders = {
      'Accept': 'application/json',
    };

    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, config);
      const data = await response.json();

      if (!response.ok && response.status === 401) {
        // If unauthorized while accessing admin, clear auth in store
        AppStore.setAuth(false, null);
      }

      return data;
    } catch (error) {
      console.error(`API Error on [${endpoint}]:`, error);
      return {
        success: false,
        message: 'Network error or server unreachable. Please check your connection and XAMPP status.'
      };
    }
  },

  // Authentication
  async checkAuth() {
    AppStore.auth.loading = true;
    const res = await this.request('auth.php?action=check');
    AppStore.auth.loading = false;
    if (res && res.authenticated) {
      AppStore.setAuth(true, res.admin);
      return true;
    } else {
      AppStore.setAuth(false, null);
      return false;
    }
  },

  async login(email, password) {
    const res = await this.request('auth.php?action=login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res && res.success) {
      AppStore.setAuth(true, res.admin);
    }
    return res;
  },

  async logout() {
    const res = await this.request('auth.php?action=logout', { method: 'POST' });
    AppStore.setAuth(false, null);
    return res;
  },

  async updateAccount(data) {
    return await this.request('auth.php?action=update_credentials', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Profile
  async getProfile() {
    const res = await this.request('profile.php?action=get');
    if (res && res.success && res.data) {
      AppStore.setProfile(res.data);
    }
    return res;
  },

  async updateProfile(data) {
    const res = await this.request('profile.php?action=update', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res && res.success) {
      await this.getProfile();
    }
    return res;
  },

  // Projects
  async getProjects(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await this.request(`projects.php?action=list&${query}`);
    if (res && res.success && res.data) {
      if (!params.status || params.status === 'Published') {
        AppStore.setProjects(res.data);
      }
    }
    return res;
  },

  async getProject(idOrSlug) {
    const isId = Number.isInteger(Number(idOrSlug)) && !isNaN(Number(idOrSlug));
    const param = isId ? `id=${idOrSlug}` : `slug=${encodeURIComponent(idOrSlug)}`;
    return await this.request(`projects.php?action=get&${param}`);
  },

  async createProject(data) {
    return await this.request('projects.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateProject(data) {
    return await this.request('projects.php?action=update', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async toggleProjectStatus(id, status) {
    return await this.request('projects.php?action=toggle_status', {
      method: 'POST',
      body: JSON.stringify({ id, status })
    });
  },

  async deleteProject(id) {
    return await this.request('projects.php?action=delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  async recordProjectView(id) {
    return await this.request('projects.php?action=increment_view', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  // Skills
  async getSkills(grouped = true) {
    const res = await this.request(`skills.php?action=list&grouped=${grouped ? 1 : 0}`);
    if (res && res.success && res.data) {
      AppStore.setSkillCategories(res.data);
    }
    return res;
  },

  async getSkillCategories() {
    return await this.request('skills.php?action=categories');
  },

  async createSkill(data) {
    return await this.request('skills.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateSkill(data) {
    return await this.request('skills.php?action=update', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async deleteSkill(id) {
    return await this.request('skills.php?action=delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  // Experience / Journey
  async getExperience() {
    const res = await this.request('experience.php?action=list');
    if (res && res.success && res.data) {
      AppStore.setExperience(res.data);
    }
    return res;
  },

  async createExperience(data) {
    return await this.request('experience.php?action=create', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateExperience(data) {
    return await this.request('experience.php?action=update', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async deleteExperience(id) {
    return await this.request('experience.php?action=delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  // Messages
  async submitContactMessage(data) {
    return await this.request('messages.php?action=submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getMessages(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await this.request(`messages.php?action=list&${query}`);
    if (res && res.success && typeof res.unread_count !== 'undefined') {
      AppStore.stats.unread_messages = res.unread_count;
    }
    return res;
  },

  async updateMessageStatus(id, status) {
    return await this.request('messages.php?action=update_status', {
      method: 'POST',
      body: JSON.stringify({ id, status })
    });
  },

  async deleteMessage(id) {
    return await this.request('messages.php?action=delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  // Media Library
  async getMedia(search = '') {
    return await this.request(`media.php?action=list&search=${encodeURIComponent(search)}`);
  },

  async uploadMedia(formData) {
    return await this.request('media.php?action=upload', {
      method: 'POST',
      body: formData
    });
  },

  async deleteMedia(id) {
    return await this.request('media.php?action=delete', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  },

  // Analytics & Stats
  async recordPageView(pagePath = '/') {
    return await this.request('analytics.php?action=record_view', {
      method: 'POST',
      body: JSON.stringify({ page_path: pagePath })
    });
  },

  async getAnalytics() {
    const res = await this.request('analytics.php?action=get_stats');
    if (res && res.success && res.stats) {
      AppStore.setStats(res.stats);
    }
    return res;
  },

  // Settings
  async getSettings() {
    const res = await this.request('settings.php?action=get');
    if (res && res.success && res.data) {
      AppStore.setSettings(res.data);
    }
    return res;
  },

  async updateSettings(data) {
    const res = await this.request('settings.php?action=update', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res && res.success) {
      AppStore.setSettings(data);
    }
    return res;
  },

  // Activity Logs
  async getActivityLogs(limit = 15) {
    return await this.request(`activity.php?limit=${limit}`);
  }
};
