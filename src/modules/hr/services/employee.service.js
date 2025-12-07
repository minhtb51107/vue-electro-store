import axiosClient from '@/api/axiosClient';

export default {
  getAll(params) {
    return axiosClient.get('/employees', { params });
  },
  create(data) {
    // data: { fullname, email, password, employeeCode, roleNames: [] }
    return axiosClient.post('/employees', data);
  },
  update(id, data) {
    return axiosClient.put(`/employees/${id}`, data);
  },
  updateStatus(id, isActive) {
    return axiosClient.patch(`/employees/${id}/status`, null, { params: { isActive } });
  },
  // API lấy danh sách Roles để hiển thị trong dropdown
  getAllRoles() {
    return axiosClient.get('/roles');
  }
};