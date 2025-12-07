import axiosClient from '@/api/axiosClient';

export default {
  getMyAddresses() {
    return axiosClient.get('/users/addresses');
  },
  
  getDefaultAddress() {
    return axiosClient.get('/users/addresses/default');
  },

  create(data) {
    // data: { receiverName, receiverPhone, streetAddress, ward, district, province, isDefault }
    return axiosClient.post('/users/addresses', data);
  },

  update(id, data) {
    return axiosClient.put(`/users/addresses/${id}`, data);
  },

  delete(id) {
    return axiosClient.delete(`/users/addresses/${id}`);
  }
};