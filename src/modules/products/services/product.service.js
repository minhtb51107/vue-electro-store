import axiosClient from '@/api/axiosClient';

export default {
  // --- PUBLIC APIS ---

  /**
   * Tìm kiếm sản phẩm (Home/Search)
   */
  search(params) {
    return axiosClient.get('/products/search', { params });
  },

  /**
   * Lấy chi tiết sản phẩm theo Slug
   */
  getBySlug(slug) {
    return axiosClient.get(`/products/${slug}`);
  },

  // --- NEW FEATURES (COMPARE & WISHLIST) ---

  /**
   * So sánh sản phẩm
   * @param {Array} productIds - Danh sách ID [1, 2, 3]
   */
  compareProducts(productIds) {
    return axiosClient.get('/products/compare', {
      params: { ids: productIds.join(',') }
    });
  },

  /**
   * Lấy danh sách yêu thích của user
   */
  getWishlist(params) {
    return axiosClient.get('/wishlists', { params });
  },

  /**
   * Thêm/Xóa sản phẩm khỏi wishlist (Toggle)
   */
  toggleWishlist(productId) {
    return axiosClient.post(`/wishlists/${productId}`);
  },

  /**
   * Kiểm tra user đã like sản phẩm này chưa
   */
  checkWishlist(productId) {
    return axiosClient.get(`/wishlists/${productId}/check`);
  },

  // --- ADMIN APIS ---

  getByIdAdmin(id) {
    return axiosClient.get(`/products/admin/${id}`);
  },

  create(data) {
    return axiosClient.post('/products', data);
  },

  update(id, data) {
    return axiosClient.put(`/products/${id}`, data);
  },

  delete(id) {
    return axiosClient.delete(`/products/${id}`);
  }
};