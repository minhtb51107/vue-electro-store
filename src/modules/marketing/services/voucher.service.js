import axiosClient from '@/api/axiosClient';

export default {
  getAll(params) {
    return axiosClient.get('/vouchers', { params });
  },
  getById(id) {
    return axiosClient.get(`/vouchers/${id}`);
  },
  create(data) {
    return axiosClient.post('/vouchers', data);
  },
  update(id, data) {
    return axiosClient.put(`/vouchers/${id}`, data);
  },
  delete(id) {
    return axiosClient.delete(`/vouchers/${id}`);
  }
};