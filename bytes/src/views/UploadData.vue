<template>
  <div>
    <h1>Students</h1>
    <table>
      <thead>
        <tr>
          <th>Last Name</th>
          <th>First Name</th>
          <th>Middle Initial</th>
          <th>Department</th>
          <th>ID Number</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.lastName }}</td>
          <td>{{ student.firstName }}</td>
          <td>{{ student.middleInitial }}</td>
          <td>{{ student.department }}</td>
          <td>{{ student.idNumber }}</td>
          <td>
            <button @click="editStudent(student)">Edit</button>
            <button @click="deleteStudent(student.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <h2>{{ isEdit ? 'Edit Student' : 'Add Student' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="lastName">Last Name:</label>
          <input type="text" v-model="formData.lastName" required />
        </div>
        <div>
          <label for="firstName">First Name:</label>
          <input type="text" v-model="formData.firstName" required />
        </div>
        <div>
          <label for="middleInitial">Middle Initial:</label>
          <input type="text" v-model="formData.middleInitial" required />
        </div>
        <div>
          <label for="department">Department:</label>
          <input type="text" v-model="formData.department" required />
        </div>
        <div>
          <label for="idNumber">ID Number:</label>
          <input type="text" v-model="formData.idNumber" required />
        </div>
        <button type="submit">{{ isEdit ? 'Update' : 'Add' }}</button>
      </form>
    </div>
    <div>
      <h2>Upload Students via Excel</h2>
      <v-file-input 
        label="Select File"
        @change="handleFileChange"
      ></v-file-input>
      <button @click="uploadFile">Upload</button>
    </div>
  </div>
</template>

<script>
import StudentService from '@/services/AuthServices';

export default {
  data() {
    return {
      students: [],
      formData: {
        lastName: '',
        firstName: '',
        middleInitial: '',
        department: '',
        idNumber: ''
      },
      isEdit: false,
      editId: null,
      file: null
    }
  },
  methods: {
    fetchStudents() {
      StudentService.getStudents()
        .then(response => {
          this.students = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleSubmit() {
      if (this.isEdit) {
        StudentService.updateStudent(this.editId, this.formData)
          .then(() => {
            this.fetchStudents();
            this.resetForm();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        StudentService.addStudent(this.formData)
          .then(() => {
            this.fetchStudents();
            this.resetForm();
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    editStudent(student) {
      this.isEdit = true;
      this.editId = student.id;
      this.formData = { ...student };
    },
    deleteStudent(id) {
      StudentService.deleteStudent(id)
        .then(() => {
          this.fetchStudents();
        })
        .catch(error => {
          console.error(error);
        });
    },
    resetForm() {
      this.isEdit = false;
      this.editId = null;
      this.formData = {
        lastName: '',
        firstName: '',
        middleInitial: '',
        department: '',
        idNumber: ''
      };
    },
    handleFileChange(event) {
  const file = event.target.files[0];
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid Excel file (.xls or .xlsx)');
    return;
  }

  this.file = file;
},
    uploadFile() {
      if (!this.file) {
        alert('Please select a file to upload');
        return;
      }
      StudentService.uploadFile(this.file)
        .then(() => {
          this.fetchStudents();
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.fetchStudents();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
form {
  margin-top: 20px;
}
div {
  margin-bottom: 10px;
}
.dropzone {
  border: 2px dashed #cccccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
.dropzone:hover {
  background-color: #f0f0f0;
}
</style>
