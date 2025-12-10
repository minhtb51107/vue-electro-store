import axios from 'axios';
import axiosClient from '@/api/axiosClient'; // Import axiosClient của app mình để gọi API backend

// Token GHN (Dùng cho các hàm lấy tỉnh/huyện trực tiếp từ GHN nếu cần, hoặc gọi qua backend)
const GHN_TOKEN = '54196d5b-d468-11f0-a3d6-dac90fb956b5'; 
const GHN_API = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data';

const ghnClient = axios.create({
  baseURL: GHN_API,
  headers: { 'token': GHN_TOKEN }
});

export default {
  // Lấy địa chính (Gọi trực tiếp GHN API - Client side)
  getProvinces() {
    return ghnClient.get('/province');
  },
  getDistricts(provinceId) {
    return ghnClient.get('/district', { params: { province_id: provinceId } });
  },
  getWards(districtId) {
    return ghnClient.get('/ward', { params: { district_id: districtId } });
  },

  // [MỚI] Tính phí ship công khai (Gọi qua Backend của mình)
  // Backend sẽ dùng token GHN của shop để tính
  calculatePublicFee(data) {
    // data: { to_district_id, to_ward_code, weight, insurance_value }
    return axiosClient.post('/shipping/calculate-public', data);
  }
};