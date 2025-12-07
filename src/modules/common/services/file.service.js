import axiosClient from '@/api/axiosClient';

export default {
  upload(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};