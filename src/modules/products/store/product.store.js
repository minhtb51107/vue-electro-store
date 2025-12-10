import { defineStore } from 'pinia';
import productService from '../services/product.service';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],       
    currentProduct: null, 
    totalItems: 0,      
    isLoading: false,
    error: null,
    
    compareIds: JSON.parse(localStorage.getItem('compare_ids') || '[]'),
    comparisonData: null,

    searchParams: {
      q: '',
      categorySlug: null,
      brandSlug: null,
      priceGte: null,
      priceLte: null,
      page: 0,
      size: 12,
      sort: 'createdAt,desc'
    }
  }),

  actions: {
    async fetchProducts(customParams = {}) {
      this.isLoading = true;
      try {
        const params = { ...this.searchParams, ...customParams };
        const response = await productService.search(params);
        // axiosClient đã unwrap data, nên dùng response.content luôn
        this.products = response.content; 
        this.totalItems = response.totalElements;
      } catch (err) {
        console.error(err);
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProductBySlug(slug) {
      this.isLoading = true;
      this.error = null;
      try {
        const data = await productService.getBySlug(slug);
        this.currentProduct = data;
        return data;
      } catch (err) {
        this.error = err.message;
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // --- WISHLIST ACTIONS ---
    async toggleWishlist(productId) {
      try {
        await productService.toggleWishlist(productId);
        return true; 
      } catch (err) {
        console.error("Lỗi toggle wishlist:", err);
        return false;
      }
    },

    // --- COMPARE ACTIONS ---
    addToCompare(productId) {
      if (this.compareIds.length >= 3) {
        alert('Bạn chỉ được so sánh tối đa 3 sản phẩm!');
        return;
      }
      if (!this.compareIds.includes(productId)) {
        this.compareIds.push(productId);
        this.saveCompareToLocal();
      }
    },

    removeFromCompare(productId) {
      this.compareIds = this.compareIds.filter(id => id !== productId);
      this.saveCompareToLocal();
    },

    clearCompare() {
      this.compareIds = [];
      this.saveCompareToLocal();
      this.comparisonData = null;
    },

    saveCompareToLocal() {
      localStorage.setItem('compare_ids', JSON.stringify(this.compareIds));
    },

    async fetchComparison() {
      // 1. Log danh sách ID đang có
      console.log("Đang so sánh các ID:", this.compareIds);

      if (this.compareIds.length < 2) {
         console.warn("Không đủ sản phẩm để so sánh");
         return;
      }

      this.isLoading = true;
      try {
        const res = await productService.compareProducts(this.compareIds);
        console.log("Kết quả API trả về:", res); // 2. Xem API trả về gì

        // Nếu API trả về thành công nhưng danh sách rỗng (do ID rác)
        if (!res || !res.products || res.products.length === 0) {
            console.warn("Backend không tìm thấy sản phẩm nào khớp với ID này.");
            // Tự động xóa ID rác để người dùng chọn lại từ đầu
            this.clearCompare(); 
            this.comparisonData = null;
        } else {
            this.comparisonData = res;
        }
        
      } catch (error) {
        console.error("Lỗi gọi API So sánh:", error);
        // Nếu lỗi 403/401 -> Nhắc người dùng check lại Security Backend
      } finally {
        this.isLoading = false;
      }
    },

    // --- ADMIN ACTIONS ---
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
        await this.fetchProducts({ page: 0 }); 
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
    
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