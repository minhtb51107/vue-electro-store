import axiosClient from '@/api/axiosClient';

export default {
  // Update profile: fullname, photoUrl, bio
  updateProfile(data) {
    return axiosClient.put('/users/profile', data);
  },

  // Change password: oldPassword, newPassword
  changePassword(data) {
    return axiosClient.post('/auth/change-password', data);
  }
};