import axios from 'axios';

// Sử dụng biến môi trường hoặc fallback về localhost
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // Tùy chọn timeout
});

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  async (error) => {
    // Xử lý 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('Phiên đăng nhập hết hạn hoặc không hợp lệ.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      // window.location.href = '/auth/login'; // Uncomment nếu muốn auto redirect
    }

    const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;