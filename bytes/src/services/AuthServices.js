import Api from '@/services/Api';

export default {
  login(credentials) {
    return Api.post('/', credentials); // Remove the ()
  },
  createAccount(userData) {
    return Api.post('/api/users', userData);
  },
   verifyDevPassword: (password) => Api.post('/api/verify-dev', {
    password: password // Send simple string
  }),
  getAccounts() {
    return Api.get('/api/users');
  },
  toggleAccountStatus(id) {
    return Api.put(`/api/users/${id}/status`);
  },
  updateAccount(id, data) {
    return Api.put(`/api/users/${id}`, data);
  },
  getStudents() {
    return Api.get('/students');
  },
  addStudent(data) {
    return Api.post('/students', data);
  },
  updateStudent(id, data) {
    return Api.put(`/students/${id}`, data);
  },
  deleteStudent(id) {
    return Api.delete(`/students/${id}`);
  },
  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return Api.post('/students/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};