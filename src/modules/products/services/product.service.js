import axiosClient from '@/api/axiosClient';

export default {
  // --- PUBLIC APIS ---

  /**
   * Tìm kiếm sản phẩm (Dùng cho trang Home/Search của khách hàng)
   * Gọi API Elasticsearch backend
   * @param {Object} params - { q, categorySlug, brandSlug, priceGte, priceLte, page, size, sort }
   */
  search(params) {
    return axiosClient.get('/products/search', { params });
  },

  /**
   * Lấy chi tiết sản phẩm theo Slug (Trang chi tiết khách hàng)
   */
  getBySlug(slug) {
    return axiosClient.get(`/products/${slug}`);
  },

  // --- ADMIN APIS ---

  /**
   * Lấy chi tiết theo ID (Dùng cho Admin để sửa)
   */
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