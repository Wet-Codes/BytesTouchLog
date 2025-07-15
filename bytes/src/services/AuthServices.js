import Api from '@/services/Api';

export default {
  recordLogin(deviceInfo) {
    return Api.post('/api/history/record-login', deviceInfo);
  },
  
  recordLogout(deviceInfo) {
  return Api.post('/api/history/record-logout', {
    ip: deviceInfo.ip,
    device: deviceInfo.device
  });
},
  
  getLoginHistory() {
    return Api.get('/api/history/login-logs');
  },
  
  getFullSessionHistory() {
    return Api.get('/api/history/session-logs');
  },
  
  logout() {
    return Api.post('/api/logout');
  }
  ,
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
  clearStudents() {
  return Api.delete('/students/clear');
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
  identifyFingerprint2(data) {
    return Api.post('/fingerprint/identify2', data);
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

//Note
createNote(content) {
  return Api.post('/api/notes', { content });
},

getNotes() {
  return Api.get('/api/notes');
},

markNotesRead() {
  return Api.post('/api/notes/mark-read');
},

 recordPayment(paymentPayload) {
    return Api.post('/api/history/record-payment', paymentPayload);
  },

getPaymentLogs() {
  return Api.get('/api/history/payment-logs')
    .then(response => response) // Return the full response
    .catch(error => {
      console.error('API Error:', error);
      throw error;
    });
},

 getFinesDistribution(eventId) {
    return Api.get(`/api/dashboard/fines-distribution?eventId=${eventId}`);
  },
  
  getFinesOverTime(schoolYear) {
    return Api.get(`/api/dashboard/fines-over-time?schoolYear=${schoolYear}`);
  },
  
  getAttendanceByCourse(eventId) {
    return Api.get(`/api/dashboard/attendance-by-course?eventId=${eventId}`);
  },
  
  getStudentDistribution() {
    return Api.get('/api/dashboard/student-distribution');
  },
  
  getEvent() {
    return Api.get('/events');
  }

};