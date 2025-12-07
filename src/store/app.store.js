import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    snackbar: {
      show: false,
      message: '',
      color: 'success', // success, error, info, warning
      timeout: 3000
    }
  }),
  
  actions: {
    notify(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    notifyError(error) {
      const msg = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      this.notify(msg, 'error');
    }
  }
});