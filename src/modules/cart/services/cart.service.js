import axiosClient from '@/api/axiosClient';

export default {
  // --- CART APIs (Redis) ---
  getCart() {
    return axiosClient.get('/cart');
  },

  addToCart(productVariantId, quantity) {
    return axiosClient.post('/cart/items', { productVariantId, quantity });
  },

  updateQuantity(productVariantId, quantity) {
    return axiosClient.put(`/cart/items/${productVariantId}`, { quantity });
  },

  removeItem(productVariantId) {
    return axiosClient.delete(`/cart/items/${productVariantId}`);
  },

  clearCart() {
    return axiosClient.delete('/cart');
  },

  // --- ORDER APIs (Postgres) ---
  checkout(data) {
    // data: { customerName, shippingAddress, shippingPhone, notes, voucherCode, addressId }
    return axiosClient.post('/orders/checkout', data);
  },

  // --- PAYMENT APIs (VNPay) ---
  createPayment(orderId) {
    return axiosClient.get(`/payment/create-payment/${orderId}`);
  },

  calculateShippingFee(params) {
    // params: { districtId, wardCode, weight, insuranceValue }
    return axiosClient.get('/shipping/calculate', { params });
  }
};