import axiosClient from '@/api/axiosClient';

export default {
  getByProduct(productId, params) {
    return axiosClient.get(`/reviews/product/${productId}`, { params });
  },

  create(data) {
    // data: { productId, rating, comment, imageUrls }
    return axiosClient.post('/reviews', data);
  }
};