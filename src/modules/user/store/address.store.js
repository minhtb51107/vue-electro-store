import { defineStore } from 'pinia';
import addressService from '../services/address.service';

export const useAddressStore = defineStore('address', {
  state: () => ({
    addresses: [],
    isLoading: false,
  }),

  actions: {
    async fetchAddresses() {
      this.isLoading = true;
      try {
        const data = await addressService.getMyAddresses();
        this.addresses = data;
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    async createAddress(payload) {
      try {
        await addressService.create(payload);
        await this.fetchAddresses(); // Refresh list
        return { success: true, message: 'Thêm địa chỉ thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async updateAddress(id, payload) {
      try {
        await addressService.update(id, payload);
        await this.fetchAddresses();
        return { success: true, message: 'Cập nhật địa chỉ thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    async deleteAddress(id) {
      try {
        await addressService.delete(id);
        await this.fetchAddresses();
        return { success: true, message: 'Xóa địa chỉ thành công' };
      } catch (err) {
        return { success: false, message: err.message };
      }
    }
  }
});