import { defineStore } from 'pinia';
import productService from '../services/product.service';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],       // Danh sách sản phẩm (cho admin hoặc search result)
    currentProduct: null, // Sản phẩm đang xem/sửa
    totalItems: 0,      // Tổng số record (cho pagination)
    isLoading: false,
    error: null,
    
    // State cho bộ lọc tìm kiếm (Public)
    searchParams: {
      q: '',
      categorySlug: null,
      brandSlug: null,
      priceGte: null,
      priceLte: null,
      page: 0,
      size: 12,
      sort: 'createdAt,desc' // Mặc định mới nhất
    }
  }),

  actions: {
    // Gọi API Search (Dùng chung cho cả Admin list và Public search)
    async fetchProducts(customParams = {}) {
      this.isLoading = true;
      try {
        // Merge params mặc định với params truyền vào (ví dụ từ phân trang Admin)
        const params = { ...this.searchParams, ...customParams };
        
        const response = await productService.search(params);
        
        // Backend Spring Data Page trả về: { content, totalElements, ... }
        this.products = response.content;
        this.totalItems = response.totalElements;
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductByIdAdmin(id) {
      this.isLoading = true;
      try {
        const data = await productService.getByIdAdmin(id);
        this.currentProduct = data;
        return data;
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    async createProduct(payload) {
      try {
        await productService.create(payload);
        return { success: true, message: 'Tạo sản phẩm thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async updateProduct(id, payload) {
      try {
        await productService.update(id, payload);
        return { success: true, message: 'Cập nhật thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async deleteProduct(id) {
      try {
        await productService.delete(id);
        // Refresh list sau khi xóa
        await this.fetchProducts({ page: 0 }); 
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async fetchProductBySlug(slug) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await productService.getBySlug(slug);
        this.currentProduct = data;
        return data; // Trả về data để Component xử lý tiếp (ví dụ set ảnh default)
      } catch (err) {
        this.error = err.message;
        // Nếu lỗi 404, router sẽ redirect sang trang NotFound (xử lý ở view)
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Helper: Reset bộ lọc
    resetFilters() {
      this.searchParams = {
        q: '',
        categorySlug: null,
        brandSlug: null,
        priceGte: null,
        priceLte: null,
        page: 0,
        size: 12
      };
    }
  }
});