import { defineStore } from 'pinia';
import authService from '../services/auth.service';
import router from '@/router'; // Import router để redirect

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    // Helper check quyền: Admin hoặc Nhân viên
    isAdminOrStaff: (state) => {
      return state.user?.roles?.some(role => 
        role === 'ROLE_ADMIN' || role === 'ROLE_SALE_MANAGER'
      );
    },
    userAvatar: (state) => state.user?.photo || null,
    userName: (state) => state.user?.fullname || state.user?.email
  },

  actions: {
    async login(credentials) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await authService.login(credentials);
        
        // 1. Lưu Token (Backend trả về accessToken & refreshToken)
        this.accessToken = response.accessToken;
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken); // Quan trọng cho cơ chế refresh

        // 2. Lấy thông tin User ngay sau khi có Token
        await this.fetchProfile();
        
        // 3. Redirect dựa trên Role (UX: Admin vào Dashboard, User về Home)
        if (this.isAdminOrStaff) {
          // SỬA DÒNG NÀY: Đổi 'AdminDashboard' thành 'AdminOrderList' (hoặc 'AdminProductList')
          router.push({ name: 'AdminOrderList' }); 
        } else {
          router.push({ name: 'Home' });
        }
        
        return { success: true };
      } catch (err) {
        this.error = err.message || 'Đăng nhập thất bại';
        return { success: false, message: this.error };
      } finally {
        this.isLoading = false;
      }
    },

    async loginWithGoogle(idToken) {
      this.isLoading = true;
      try {
        // 1. Gọi Service thay vì gọi axios trực tiếp
        const response = await authService.loginWithGoogle(idToken);
        
        // 2. Lưu token vào LocalStorage
        this.accessToken = response.accessToken;
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        
        // 3. Lấy thông tin User
        await this.fetchProfile();
        
        // 4. Điều hướng (Redirect)
        if (this.isAdminOrStaff) {
          router.push({ name: 'AdminOrderList' }); 
        } else {
          router.push({ name: 'Home' });
        }
        
        return { success: true };
      } catch (err) {
        console.error("Google Login Error:", err);
        return { success: false, message: err.message || "Lỗi đăng nhập Google" };
      } finally {
        this.isLoading = false;
      }
    },

    async register(data) {
      this.isLoading = true;
      try {
        await authService.register(data);
        return { success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt.' };
      } catch (err) {
        return { success: false, message: err.message };
      } finally {
        this.isLoading = false;
      }
    },

    async fetchProfile() {
      try {
        const response = await authService.getProfile();
        this.user = response; // Backend trả về UserDetailsResponse
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (err) {
        console.error('Lỗi lấy thông tin user:', err);
        // Nếu lỗi profile (token không hợp lệ), logout luôn cho an toàn
        this.logout(); 
      }
    },

    logout() {
      // 1. Gọi API Logout (Optional - để Backend xóa refresh token trong DB)
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
          authService.logout(refreshToken).catch(() => {}); // Không cần chờ, lỗi cũng kệ
      }

      // 2. Xóa Local State
      this.user = null;
      this.accessToken = null;
      this.error = null;

      // 3. Xóa Local Storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // 4. Redirect về Login
      router.push({ name: 'Login' });
      // Reload trang để reset toàn bộ state của các store khác (Cart, Product...)
      // window.location.reload(); 
    },
    
    // Action cập nhật state user khi user sửa profile
    updateUserState(updatedUser) {
        this.user = { ...this.user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
});