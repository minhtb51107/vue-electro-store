import axiosClient from '@/api/axiosClient';

export default {
  getAll(params) {
    return axiosClient.get('/customers', { params });
  },
  // API Khóa tài khoản (Backend dùng delete để Suspend user)
  deleteCustomer(id) {
     return axiosClient.delete(`/customers/${id}`);
  }
};