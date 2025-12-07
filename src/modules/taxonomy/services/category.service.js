import axiosClient from '@/api/axiosClient';

/**
 * Service giao tiếp với CategoryController Backend
 * Prefix: /api/v1/categories
 */
export default {
  // 1. Lấy danh mục dạng cây (Cho cả Khách & Admin)
  // Backend: GET /api/v1/categories/tree
  getTree() {
    return axiosClient.get('/categories/tree');
  },

  // 2. Tạo danh mục mới (Chỉ Admin)
  // Backend: POST /api/v1/categories
  create(data) {
    // data: { name, parentId }
    return axiosClient.post('/categories', data);
  },

  // 3. Cập nhật danh mục (Chỉ Admin)
  // Backend: PUT /api/v1/categories/{id}
  update(id, data) {
    return axiosClient.put(`/categories/${id}`, data);
  },

  // 4. Xóa danh mục (Chỉ Admin)
  // Backend: DELETE /api/v1/categories/{id}
  delete(id) {
    return axiosClient.delete(`/categories/${id}`);
  }
};