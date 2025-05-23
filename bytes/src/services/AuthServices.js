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
  return Api.put(`/api/users/${id}/status`)
    .catch(error => {
      throw new Error(`Toggle failed: ${error.response?.data?.error || error.message}`);
    });
},

  getStudents() {
    return Api.get('/students');
  },
  createStudent(studentData) {
    return Api.post('/students', studentData);
  },
  // Change the upload method to handle errors better
uploadStudents(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  return Api.post('/students/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure auth
    }
  }).catch(error => {
    console.error('Upload error details:', error.response?.data);
    throw error;
  });
},


};