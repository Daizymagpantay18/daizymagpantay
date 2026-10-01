// SweetAlert2 and Toast Notifications helper
const AppAlerts = {
  toast(message, type = 'success') {
    if (typeof Swal !== 'undefined') {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#181818',
        color: '#F5F5F5',
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: type,
        title: message
      });
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  },

  async confirm(title, text = 'This action cannot be undone.') {
    if (typeof Swal !== 'undefined') {
      const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F28C28',
        cancelButtonColor: '#222222',
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'Cancel',
        background: '#181818',
        color: '#F5F5F5'
      });
      return result.isConfirmed;
    }
    return window.confirm(`${title}\n${text}`);
  },

  success(title, text = '') {
    if (typeof Swal !== 'undefined') {
      return Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonColor: '#F28C28',
        background: '#181818',
        color: '#F5F5F5'
      });
    }
    alert(title + (text ? ': ' + text : ''));
  },

  error(title, text = '') {
    if (typeof Swal !== 'undefined') {
      return Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonColor: '#F28C28',
        background: '#181818',
        color: '#F5F5F5'
      });
    }
    alert(title + (text ? ': ' + text : ''));
  }
};
