import axios from 'axios';

// Token GHN (Lấy từ application.properties của bạn để đồng bộ)
const GHN_TOKEN = '940d5957-c795-11f0-b432-5a45d0a14640'; 
const GHN_API = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data';

const ghnClient = axios.create({
  baseURL: GHN_API,
  headers: { 'token': GHN_TOKEN }
});

export default {
  getProvinces() {
    return ghnClient.get('/province');
  },
  getDistricts(provinceId) {
    return ghnClient.get('/district', { params: { province_id: provinceId } });
  },
  getWards(districtId) {
    return ghnClient.get('/ward', { params: { district_id: districtId } });
  }
};