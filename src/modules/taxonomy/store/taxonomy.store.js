import { defineStore } from 'pinia';
import categoryService from '../services/category.service';
import brandService from '../services/brand.service';

export const useTaxonomyStore = defineStore('taxonomy', {
  // --- STATE: Dữ liệu lưu trữ ---
  state: () => ({
    categories: [], // Dạng cây (Tree) trả về từ Backend
    brands: [],     // Danh sách phẳng (List)
    isLoading: false,
    error: null,
  }),

  // --- GETTERS: Tính toán dữ liệu (giống Computed) ---
  getters: {
    // Biến đổi Tree thành danh sách phẳng (Flatten) để đổ vào Select box nếu cần
    flattenCategories: (state) => {
      const flatten = (nodes, level = 0) => {
        let result = [];
        nodes.forEach(node => {
          result.push({ ...node, level }); // Thêm level để indent UI
          if (node.children && node.children.length > 0) {
            result = result.concat(flatten(node.children, level + 1));
          }
        });
        return result;
      };
      return flatten(state.categories);
    }
  },

  // --- ACTIONS: Các hành động thay đổi State (Logic nghiệp vụ) ---
  actions: {
    // 1. Fetch Categories (Tree)
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      try {
        // Gọi service -> axios -> Backend
        const data = await categoryService.getTree();
        this.categories = data; // Backend trả về List<CategoryResponse> (Tree structure)
      } catch (err) {
        this.error = err.message;
        console.error('Failed to fetch categories:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // 2. Fetch Brands
    async fetchBrands() {
      this.isLoading = true;
      try {
        const data = await brandService.getAll();
        this.brands = data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // --- ADMIN ACTIONS (CUD) ---
    // Các hàm này sẽ được gọi từ Admin Form
    
    async createCategory(payload) {
      try {
        await categoryService.create(payload);
        await this.fetchCategories(); // Reload lại danh sách sau khi tạo
        return { success: true, message: 'Tạo danh mục thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async updateCategory(id, payload) {
      try {
        await categoryService.update(id, payload);
        await this.fetchCategories(); // Reload để cập nhật cây thư mục
        return { success: true, message: 'Cập nhật thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async deleteCategory(id) {
      try {
        await categoryService.delete(id);
        await this.fetchCategories();
        return { success: true, message: 'Xóa danh mục thành công' };
      } catch (err) {
        return { success: false, message: err.message }; // Backend sẽ chặn nếu có con
      }
    },

    // Tương tự cho Brand...
    async createBrand(payload) {
        try {
            await brandService.create(payload);
            await this.fetchBrands();
            return { success: true };
        } catch (err) { return { success: false, message: err.message }; }
    },

    async deleteBrand(id) {
        try {
            await brandService.delete(id);
            await this.fetchBrands();
            return { success: true };
        } catch (err) { return { success: false, message: err.message }; }
    }
  }
});