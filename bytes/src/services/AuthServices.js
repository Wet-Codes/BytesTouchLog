import Api from '@/services/Api';

export default {
  login(credentials) {
    return Api.post('/', credentials); // Remove the ()
  },
  createAccount(userData) {
    return Api.post('/api/users', userData);
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