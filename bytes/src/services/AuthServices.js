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

 updateAccount(userData) {
  return Api.put(`/api/users/${userData.id}`, userData);
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

  updateStudents(id, userData) {
  return Api.put(`/students/${id}/api`, userData);
},
  EnrollExist(existingstudent){
    return Api.post('/student/enrollexist', existingstudent)
  },

  getEvents() {
    return Api.get('/events');
  },
  createEvent(eventData) {
    return Api.post('/events', eventData);
  },
  updateEvent(eventId, eventData) {
    return Api.put(`/events/${eventId}`, eventData);
  },

  enrollFingerprint(data) {
    return Api.post('/fingerprint/enroll', data);
  },
  
  identifyFingerprint(data) {
    return Api.post('/fingerprint/identify', data);
  },

    // Create or update fine (PUT)
  saveFine(id, data) {
    return Api.put(`/fines/${id}`, data);
  },

  // Get fines for a specific event
  getFinesForEvent(studentId) {
    return Api.get(`/fines/student/${studentId}`);
  },

  // Delete fine by ID
  deleteFine(id) {
    return Api.delete(`/fines/${id}`);
  },

// Update these methods
getAttendanceForEvent(eventId) {
  return Api.get(`/attendance/${eventId}`);
},

updateAttendance(data) {
  return Api.put('/attendance', data);
},

getStudentFines(studentId) {
  return Api.get(`/fines/student/${studentId}`);
},

clearStudentFines(studentId) {
  return Api.put(`/fines/student/${studentId}/clear`);
},

};