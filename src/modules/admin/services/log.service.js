import axiosClient from '@/api/axiosClient';

export default {
  getLogs(params) {
    // params: { page, size, action, userId, startDate, endDate }
    return axiosClient.get('/activity-logs', { params });
  }
};