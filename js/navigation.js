// Navigation structure definitions
const APP_NAVIGATION = {
  publicMenu: [
    { label: 'WORK', anchor: '#selected-work' },
    { label: 'ABOUT', anchor: '#about-me' },
    { label: 'SKILLS', anchor: '#my-toolkit' },
    { label: 'EXPERIENCE', anchor: '#the-journey' },
    { label: 'CONTACT', anchor: '#contact-section' },
  ],

  adminMenu: [
    { name: 'Dashboard', path: '/admin', icon: 'layout-dashboard' },
    { name: 'Profile', path: '/admin/profile', icon: 'user' },
    { name: 'Projects', path: '/admin/projects', icon: 'folder-git-2' },
    { name: 'Skills & Tools', path: '/admin/skills', icon: 'cpu' },
    { name: 'Journey', path: '/admin/journey', icon: 'milestone' },
    { name: 'Messages', path: '/admin/messages', icon: 'mail', badge: 'unread_messages' },
    { name: 'Media', path: '/admin/media', icon: 'image' },
    { name: 'Analytics', path: '/admin/analytics', icon: 'line-chart' },
    { name: 'Settings', path: '/admin/settings', icon: 'settings' },
  ]
};
