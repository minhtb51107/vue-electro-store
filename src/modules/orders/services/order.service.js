import axiosClient from '@/api/axiosClient';

export default {
  // --- CUSTOMER APIs ---
  getMyOrders(params) {
    // params: { page, size, sort }
    return axiosClient.get('/orders/my-history', { params });
  },

  getMyOrderDetail(orderId) {
    return axiosClient.get(`/orders/${orderId}`);
  },

  cancelOrder(orderId) {
    return axiosClient.post(`/orders/${orderId}/cancel`);
  },

  // --- ADMIN APIs ---
  getAllOrders(params) {
    // params: { status, customerEmail, orderId, fromDate, toDate, page, size... }
    return axiosClient.get('/admin/orders', { params });
  },

  getAdminOrderDetail(orderId) {
    return axiosClient.get(`/admin/orders/${orderId}`);
  },

  updateStatus(orderId, newStatus) {
    // body: { newStatus }
    return axiosClient.patch(`/admin/orders/${orderId}/status`, { newStatus });
  }
};