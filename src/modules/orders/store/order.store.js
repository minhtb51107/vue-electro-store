import { defineStore } from 'pinia';
import orderService from '../services/order.service';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],         // Danh sách đơn hàng (chung cho cả Admin/User tùy ngữ cảnh)
    currentOrder: null, // Chi tiết đơn hàng đang xem
    totalItems: 0,
    isLoading: false,
    error: null,
  }),

  actions: {
    // Cho Khách hàng
    async fetchMyOrders(params) {
      this.isLoading = true;
      try {
        const response = await orderService.getMyOrders(params);
        this.orders = response.content;
        this.totalItems = response.totalElements;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    // Cho Admin
    async fetchAllOrders(params) {
      this.isLoading = true;
      try {
        const response = await orderService.getAllOrders(params);
        this.orders = response.content;
        this.totalItems = response.totalElements;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchOrderDetail(id, isAdmin = false) {
      this.isLoading = true;
      try {
        const response = isAdmin 
          ? await orderService.getAdminOrderDetail(id)
          : await orderService.getMyOrderDetail(id);
        this.currentOrder = response;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async cancelMyOrder(id) {
      try {
        await orderService.cancelOrder(id);
        // Refresh lại list hoặc detail
        if (this.currentOrder?.id === id) {
             this.currentOrder.status = 'CANCELLED';
        }
        return { success: true, message: 'Hủy đơn hàng thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async updateOrderStatus(id, newStatus) {
      try {
        await orderService.updateStatus(id, newStatus);
        // Update state local để UI phản hồi ngay
        if (this.currentOrder?.id === id) {
            this.currentOrder.status = newStatus;
        }
        // Cũng cập nhật trong list orders nếu đang ở trang list
        const orderInList = this.orders.find(o => o.id === id);
        if (orderInList) orderInList.status = newStatus;

        return { success: true, message: 'Cập nhật trạng thái thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    }
  }
});