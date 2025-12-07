import axiosClient from '@/api/axiosClient';

export default {
  login(credentials) {
    return axiosClient.post('/auth/login', credentials);
  },
  register(data) {
    return axiosClient.post('/auth/register', data);
  },
  getProfile() {
    return axiosClient.get('/auth/me');
  },
  logout(refreshToken) {
    return axiosClient.post('/auth/logout', { refreshToken });
  },
  // --- MỚI THÊM ---
  forgotPassword(email) {
    return axiosClient.post('/auth/forgot-password', { email });
  },
  resetPassword(data) {
    // data: { token, newPassword }
    return axiosClient.post('/auth/reset-password', data);
  },
  activateAccount(token) {
    return axiosClient.get(`/auth/activate?token=${token}`);
  },
  loginWithGoogle(idToken) {
    // Gửi ID Token sang Backend để xác thực
    return axiosClient.post('/auth/google', { idToken });
  }
};