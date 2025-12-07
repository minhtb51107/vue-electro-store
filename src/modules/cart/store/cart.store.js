import { defineStore } from 'pinia';
import cartService from '../services/cart.service';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    totalPrice: 0,
    totalItems: 0,
    isLoading: false,
    checkoutResult: null, // Lưu kết quả sau khi đặt hàng thành công
    shippingFee: 0,
  }),

  actions: {
    async fetchCart() {
      this.isLoading = true;
      try {
        const data = await cartService.getCart();
        this.patchState(data);
      } catch (err) {
        console.error('Lỗi tải giỏ hàng:', err);
      } finally {
        this.isLoading = false;
      }
    },

    async addToCart(productVariantId, quantity) {
      try {
        const data = await cartService.addToCart(productVariantId, quantity);
        this.patchState(data);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message }; // Ví dụ: Hết hàng
      }
    },

    async updateItemQuantity(productVariantId, quantity) {
      // Optimistic Update: Cập nhật UI ngay lập tức (để user cảm thấy nhanh)
      // Nhưng cần cẩn thận nếu backend lỗi thì phải revert lại. 
      // Ở đây làm an toàn: Gọi API xong mới update.
      try {
        const data = await cartService.updateQuantity(productVariantId, quantity);
        this.patchState(data);
      } catch (err) {
        alert(err.message); // Hết hàng hoặc lỗi
        // Reload lại cart chuẩn từ server để đồng bộ
        await this.fetchCart();
      }
    },

    async removeItem(productVariantId) {
      try {
        const data = await cartService.removeItem(productVariantId);
        this.patchState(data);
      } catch (err) {
        console.error(err);
      }
    },

    // Hàm đồng bộ state từ response của Backend (CartResponse)
    patchState(cartData) {
      this.items = cartData.items || [];
      this.totalPrice = cartData.totalPrice || 0;
      this.totalItems = cartData.totalItems || 0;
    },

    // --- CHECKOUT ACTIONS ---
    async processCheckout(checkoutData) {
      this.isLoading = true;
      try {
        // 1. Tạo đơn hàng (OrderService.java createOrderFromCart)
        const order = await cartService.checkout(checkoutData);
        
        // 2. Nếu thành công, xóa giỏ hàng local (Backend đã xóa trong Redis rồi)
        this.items = [];
        this.totalItems = 0;
        this.checkoutResult = order;

        // 3. Trả về Order ID để redirect sang trang thanh toán hoặc Success
        return { success: true, order };
      } catch (err) {
        return { success: false, message: err.message };
      } finally {
        this.isLoading = false;
      }
    },

    async payWithVnPay(orderId) {
       try {
           const res = await cartService.createPayment(orderId);
           // Backend trả về paymentUrl
           if (res.paymentUrl) {
               window.location.href = res.paymentUrl; // Redirect sang VNPay
           }
       } catch (err) {
           alert("Lỗi tạo thanh toán: " + err.message);
       }
    },

    async estimateShippingFee(address) {
       if (!address.ghnDistrictId || !address.ghnWardCode) {
           this.shippingFee = 30000; // Fallback nếu thiếu ID
           return;
       }
       try {
           const fee = await cartService.calculateShippingFee({
               districtId: address.ghnDistrictId,
               wardCode: address.ghnWardCode,
               weight: this.totalItems * 500, // Giả sử 500g/món
               insuranceValue: this.totalPrice
           });
           this.shippingFee = fee;
       } catch (e) {
           console.error("Lỗi tính phí ship:", e);
           this.shippingFee = 30000; // Fallback
       }
    }
  }
});