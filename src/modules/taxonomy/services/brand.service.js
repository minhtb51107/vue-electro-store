import axiosClient from '@/api/axiosClient';

/**
 * Service giao tiếp với BrandController Backend
 * Prefix: /api/v1/brands
 */
export default {
  // 1. Lấy tất cả thương hiệu
  // Backend: GET /api/v1/brands
  getAll() {
    return axiosClient.get('/brands');
  },

  // 2. Lấy chi tiết (Cho trang Update)
  getById(id) {
    return axiosClient.get(`/brands/${id}`);
  },

  // 3. Tạo thương hiệu (Admin)
  // Backend: POST /api/v1/brands
  create(data) {
    // data: { name, logoUrl }
    return axiosClient.post('/brands', data);
  },

  // 4. Cập nhật (Admin)
  update(id, data) {
    return axiosClient.put(`/brands/${id}`, data);
  },

  // 5. Xóa (Admin)
  delete(id) {
    return axiosClient.delete(`/brands/${id}`);
  }
};