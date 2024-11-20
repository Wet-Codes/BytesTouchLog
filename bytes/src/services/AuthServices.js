import Api from '@/services/Api'
//Services Requested for front End
export default {
    login (credentials) {
        return Api().post('/', credentials)
    },
    getStudents() {
        return Api().get('/students');
      },
      addStudent(data) {
        return Api().post('/students', data);
      },
      updateStudent(id, data) {
        return Api().put(`/students/${id}`, data);
      },
      deleteStudent(id) {
        return Api().delete(`/students/${id}`);
      },
      uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
       

        return Api().post('/students/upload', formData, {
          
          headers: {
            'Content-Type': 'multipart/form-data'
          }
          
        } );
      }
    };
// AuthServices.register({
//  email: 'test@gmail.com'
//  password: '123456'
//})