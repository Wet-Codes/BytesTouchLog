<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>

        <v-dialog v-model="responseDialog" max-width="500">
          <v-card :color="responseType === 'success' ? 'success' : 'error'">
            <v-card-title class="white--text">
              <v-icon left>{{ responseIcon }}</v-icon>
              {{ responseTitle }}
            </v-card-title>
            <v-card-text class="white--text">
              {{ responseMessage }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="responseDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>



        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <h1 class="table-title">STUDENT MANAGEMENT</h1>
                <div>
                  <v-btn 
                    color="success" 
                    dark
                    @click="openRegistrationDialog"
                    class="mr-2"
                  >
                    <v-icon left>mdi-account-plus</v-icon>
                    Register Student
                  </v-btn>
                  <v-btn 
                    color="primary" 
                    dark
                    @click="openUploadDialog"
                  >
                    <v-icon left>mdi-upload</v-icon>
                    Upload Students
                  </v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-card class="student-list-card">
                      <v-card-text>
                        <v-row class="mb-1" align="center">
                          <v-col cols="12" class="d-flex">
                            <v-col cols="6">
                              <v-select
                                v-model="filter.course"
                                :items="courses"
                                label="Select Course"
                                outlined
                                dense
                                dark
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-select
                                v-model="filter.yearLevel"
                                :items="yearLevels"
                                label="Select Year Level"
                                outlined
                                dense
                                dark
                              />
                            </v-col>
                          </v-col>
                          <v-col cols="12" class="mt-n4">
                            <v-text-field
                              v-model="search"
                              append-icon="mdi-magnify"
                              label="Search students..."
                              single-line
                              hide-details
                              outlined
                              dark
                              class="search-field"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <div class="student-list-header">
                          <span class="col-fname">First Name</span>
                          <span class="col-mi">M.I.</span>
                          <span class="col-lname">Last Name</span>
                          <span class="col-course">Course</span>
                          <span class="col-year">Year Level</span>
                          <span class="col-actions">Actions</span>
                        </div>
                        <v-data-table
                          :headers="studentHeaders"
                          :items="filteredStudents"
                          :search="search"
                          :items-per-page="10"
                          class="elevation-1 student-table"
                          dark
                          hide-default-header
                        >
                          <template v-slot:item="{ item }">
                            <tr>
                              <td class="col-fname text-center">{{ item.firstName }}</td>
                              <td class="col-mi text-center">{{ item.middleInitial }}</td>
                              <td class="col-lname text-center">{{ item.lastName }}</td>
                              <td class="col-course text-center">{{ item.department }}</td>
                              <td class="col-year text-center">{{ item.yearLevel }}</td>
                              <td class="col-actions text-center">
                                <div class="action-buttons">
                                  <v-btn 
                                    small 
                                    color="teal" 
                                    dark 
                                    @click="openFingerprintDialog(item)" 
                                    class="action-btn"
                                  >
                                    Fingerprint
                                  </v-btn>
                                </div>
                              </td>
                            </tr>
                          </template>
                          <template v-slot:footer>
                            <div class="text-center pt-2">
                              <v-pagination
                                v-model="page"
                                :length="pageCount"
                                :total-visible="5"
                                color="primary"
                                dark
                              ></v-pagination>
                            </div>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col v-if="selectedStudent" cols="4">
                    <v-card class="right-side-card">
                      <div class="details-header">
                        <v-card-title class="details-title">
                          {{ isNewStudent ? 'New Student Registration' : selectedStudent.firstName + ' ' + selectedStudent.lastName }}
                        </v-card-title>
                      </div>
                      <v-card-text>
                        <v-form @submit.prevent="handleRegistration">
                          <v-text-field 
                            v-model="editForm.firstName" 
                            label="First Name" 
                            outlined 
                            dense 
                            class="mb-2"
                            required
                          ></v-text-field>
                          <v-text-field 
                            v-model="editForm.middleInitial" 
                            label="Middle Initial" 
                            outlined 
                            dense 
                            class="mb-2"
                            maxlength="1"
                          ></v-text-field>
                          <v-text-field 
                            v-model="editForm.lastName" 
                            label="Last Name" 
                            outlined 
                            dense 
                            class="mb-2"
                            required
                          ></v-text-field>
                          <v-select
                          v-model="editForm.department" 
                          :items="courses.filter(c => c !== 'All')"
                          label="Department"
                          outlined
                          dense
                          class="mb-2"
                          required
                          ></v-select>
                          <v-select
                            v-model="editForm.yearLevel"
                            :items="yearLevels.filter(y => y !== 'All')"
                            label="Year Level"
                            outlined
                            dense
                            class="mb-2"
                            required
                          ></v-select>

                          <div class="regular-buttons">
                            <v-btn type="submit" color="success">Complete Registration</v-btn>
                            <v-btn @click="cancelRegistration" class="ml-2">Cancel</v-btn>
                          </div>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="uploadDialog" max-width="600">
        <v-card class="upload-dialog">
          <v-card-title class="headline">Upload Students</v-card-title>
          <v-card-text>
            <div class="file-input-container">
              <v-file-input
                v-model="uploadFile"
                label="SELECT FILE"
                accept=".xlsx"
                outlined
                prepend-icon="mdi-paperclip"
                class="centered-file-input"
              ></v-file-input>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="uploadStudents">Upload</v-btn>
            <v-btn text @click="uploadDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="fingerprintDialog" max-width="500" persistent>
        <v-card class="fingerprint-dialog">
          <v-card-title class="headline text-center">
            Fingerprint Enrollment - {{ fingerprintStudent.firstName }} {{ fingerprintStudent.lastName }}
          </v-card-title>
          <v-card-text class="text-center">
            <v-icon x-large class="mb-4 fingerprint-icon">mdi-fingerprint</v-icon>
            <p class="title">{{ fingerprintMessage }}</p>
            
            <template v-if="!fingerprintLoading">
              <v-btn 
                color="primary" 
                class="mt-4"
                @click="startFingerprintProcess"
              >
                Start Enrollment
              </v-btn>
            </template>
            <template v-else>
              <v-progress-linear
                v-model="fingerprintProgress"
                height="25"
                color="teal"
                class="mt-4"
              >
                <strong>{{ fingerprintProgress }}%</strong>
              </v-progress-linear>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="error" 
              @click="cancelFingerprintEnrollment"
              :disabled="fingerprintLoading"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';
import Auth from '@/services/AuthServices.js';


export default {
  components: {
    PageHeader
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      isNewStudent: false,
      responseDialog: false,
      responseType: 'success',
      responseTitle: '',
      responseMessage: '',
      responseIcon: '',
      students: [],
      filter: {
        course: null,
        yearLevel: null
      },
      search: '',
      selectedStudent: null,
      editForm: {
        firstName: '',
        lastName: '',
        middleInitial: '',
        course: '',
        yearLevel: ''
      },
      uploadDialog: false,
      uploadFile: null,
      fingerprintDialog: false,
      fingerprintStudent: {},
      fingerprintLoading: false,
      fingerprintMessage: 'Ready to enroll fingerprint',
      fingerprintProgress: 0,
      courses: ['All', 'BSIT', 'BSIS', 'BSCS', 'BSIT-DB', 'BSIT-MM'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      studentHeaders: [
        { text: 'First Name', value: 'firstName', align: 'center', width: '15%' },
        { text: 'M.I.', value: 'middleInitial', align: 'center', width: '5%' },
        { text: 'Last Name', value: 'lastName', align: 'center', width: '15%' },
        { text: 'Course', value: 'department', align: 'center', width: '15%' },
        { text: 'Year Level', value: 'yearLevel', align: 'center', width: '15%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '20%', sortable: false }
      ],
      page: 1,
      pageCount: 3
    };
  },
  async mounted() {
    await this.fetchStudents();
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student => {
        return (
          (this.filter.department === 'All' || !this.filter.department || student.department === this.filter.department) &&
          (this.filter.yearLevel === 'All' || !this.filter.yearLevel || student.yearLevel === this.filter.yearLevel) &&
          (this.search === '' || 
           student.firstName.toLowerCase().includes(this.search.toLowerCase()) || 
           student.lastName.toLowerCase().includes(this.search.toLowerCase()) ||
           student.department.toLowerCase().includes(this.search.toLowerCase()) ||
           student.yearLevel.toLowerCase().includes(this.search.toLowerCase()))
        );
      });
    },
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px 0'
      };
    }
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await Auth.getStudents();
        this.students = response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },

    openRegistrationDialog() {
      this.selectedStudent = {};
      this.isNewStudent = true;
      this.editForm = {
        firstName: '',
        lastName: '',
        middleInitial: '',
        course: '',
        yearLevel: ''
      };
    },

    cancelRegistration() {
      this.selectedStudent = null;
      this.isNewStudent = false;
    },

    openUploadDialog() {
      this.uploadDialog = true;
      this.uploadFile = null;
    },

    openFingerprintDialog(student) {
      this.fingerprintStudent = { ...student };
      this.fingerprintDialog = true;
      this.fingerprintLoading = false;
      this.fingerprintMessage = 'Ready to enroll fingerprint';
      this.fingerprintProgress = 0;
    },

    completeFingerprintEnrollment() {
      this.fingerprintMessage = 'Fingerprint enrolled successfully!';
      setTimeout(() => {
        this.fingerprintDialog = false;
        if (this.$toast) {
          this.$toast.success('Fingerprint enrollment completed');
        }
      }, 1500);
    },

 
    showResponse(type, title, message) {
      this.responseType = type;
      this.responseTitle = title;
      this.responseMessage = message;
      this.responseIcon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
      this.responseDialog = true;
    },

   async handleRegistration() {
  try {
    // Ensure empty middleInitial is sent as empty string
      const payload = {
      ...this.editForm,
      middleInitial: this.editForm.middleInitial?.trim().charAt(0).toUpperCase() || ''
      };

        if (!payload.firstName || !payload.lastName || !payload.department || !payload.yearLevel) {
        this.showResponse('error', 'Validation Error', 'Please fill all required fields');
          return;
        }

        const response = await Auth.createStudent(payload);
        
        
        if (response.data.error) {
          this.showResponse('error', 'Registration Failed', response.data.error);
          return;
        }

        this.showResponse('success', 'Success', 'Student registered successfully');
        await this.fetchStudents();
        this.resetForm();

      } catch (error) {
        const message = error.response?.data?.message || 'Registration failed due to server error';
        this.showResponse('error', 'Error', message);
      }
    },

    validateRegistrationForm() {
      return (
        this.editForm.firstName.trim() &&
        this.editForm.lastName.trim() &&
        this.editForm.course &&
        this.editForm.yearLevel
      );
    },

    resetForm() {
      this.selectedStudent = null;
      this.isNewStudent = false;
      this.editForm = {
        firstName: '',
        lastName: '',
        middleInitial: '',
        course: '',
        yearLevel: ''
      };
    },

    async uploadStudents() {
      try {
        if (!this.uploadFile) {
          this.showResponse('error', 'Upload Error', 'Please select a file first');
          return;
        }

        const formData = new FormData();
        formData.append('file', this.uploadFile);
        
        const response = await Auth.uploadStudents(this.uploadFile);  

        if (response.data.error) {
          this.showResponse('error', 'Upload Failed', response.data.error);
          return;
        }

        this.showResponse('success', 'Success', `${response.data.count} students uploaded successfully`);
        await this.fetchStudents();
        this.uploadDialog = false;
        this.uploadFile = null;

      } catch (error) {
        const message = error.response?.data?.message || 'File upload failed';
        this.showResponse('error', 'Upload Error', message);
      }
    },

    async startFingerprintProcess() {
      try {
        this.fingerprintLoading = true;
        this.fingerprintMessage = 'Scanning fingerprint...';
        
        // Simulate fingerprint enrollment process
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            this.fingerprintProgress += 10;
            if (this.fingerprintProgress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 500);
        });

        // Actual API call would go here
        await this.$http.post(`/students/${this.fingerprintStudent.id}/fingerprint`, {
          fingerprintData: 'simulated-data'
        });

        this.showResponse('success', 'Success', 'Fingerprint enrolled successfully');
        await this.fetchStudents();
        this.fingerprintDialog = false;

      } catch (error) {
        this.showResponse('error', 'Enrollment Failed', 'Fingerprint enrollment failed. Please try again.');
      } finally {
        this.resetFingerprintState();
      }
    },

    resetFingerprintState() {
      this.fingerprintLoading = false;
      this.fingerprintProgress = 0;
      this.fingerprintMessage = 'Ready to enroll fingerprint';
    },

    cancelFingerprintEnrollment() {
      if (this.fingerprintLoading) {
        this.showResponse('warning', 'Warning', 'Enrollment process was interrupted');
      }
      this.resetFingerprintState();
      this.fingerprintDialog = false;
    }
  



  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

.v-card.success {
  background-color: #4CAF50 !important;
}

.v-card.error {
  background-color: #f44336 !important;
}

.v-card.warning {
  background-color: #ff9800 !important;
}

.page-title {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  margin-top: 20px;
}

.confirm-dialog {
  background: rgba(0, 0, 0, 0.9);
  color: white;
}

.confirm-dialog .headline {
  color: #FF5252;
  font-weight: bold;
}

.confirm-dialog .v-card__text {
  font-size: 1.1rem;
  padding: 20px;
}

.confirm-dialog .v-card__actions {
  padding: 16px;
}

.locked-notice {
  margin-bottom: 16px;
}

.table-title {
  color: white;
  font-size: 2rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.details-title {
  font-size: 1.5rem !important;
  padding: 16px !important;
  white-space: normal;
  word-break: break-word;
}

.fine-card {
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  color: rgba(41, 12, 12, 0.103);
}

.student-list-card {
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .4);
  border-radius: 10px;
  color: white;
}

.right-side-card {
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .4);
  border-radius: 10px;
  color: white;
  height: 100%;
}

.upload-dialog {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.fingerprint-dialog {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
}

.upload-table {
  background-color: rgba(0, 0, 0, 0.3) !important;
}

.file-input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.centered-file-input {
  width: 80%;
}

.centered-file-input >>> .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid #289bb8 !important;
}

.centered-file-input >>> .v-text-field__slot input {
  color: white !important;
  font-size: 1.1rem !important;
  font-weight: 500 !important;
  text-align: center !important;
}

.centered-file-input >>> .v-label {
  color: #289bb8 !important;
  font-size: 1.1rem !important;
  width: 100% !important;
  text-align: center !important;
}

.centered-file-input >>> .v-input__prepend-outer {
  margin-right: 8px !important;
}

.fingerprint-icon {
  font-size: 72px !important;
  color: #4DB6AC;
}

.student-list-header {
  display: flex;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  border-radius: 4px 4px 0 0;
  text-align: center;
}

.student-list-header span {
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-fines-table {
  background-color: rgba(0, 0, 0, 0.3) !important;
  color: white !important;
  border-radius: 0 0 4px 4px;
}

.student-fines-table tr {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.student-fines-table tr:hover {
  background-color: rgba(40, 155, 184, 0.2) !important;
}

.student-fines-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 12px 8px !important;
  vertical-align: middle !important;
  text-align: center !important;
}

.col-fname {
  width: 15%;
}
.col-mi {
  width: 5%;
}
.col-lname {
  width: 15%;
}
.col-course {
  width: 15%;
}
.col-year {
  width: 15%;
}
.col-status {
  width: 15%;
}
.col-actions {
  width: 20%;
}

.fine-details-header {
  display: flex;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  border-radius: 4px 4px 0 0;
}

.fine-details-header span {
  padding: 0 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fine-details-header .col-event {
  width: 30%;
  text-align: left;
}

.fine-details-header .col-semester {
  width: 20%;
  text-align: center;
}

.fine-details-header .col-fine {
  width: 15%;
  text-align: right;
}

.fine-details-header .col-date {
  width: 20%;
  text-align: center;
}

.fine-details-header .col-actions {
  width: 15%;
  text-align: center;
}

.fine-details-table {
  background-color: rgba(0, 0, 0, 0.3) !important;
  color: white !important;
  border-radius: 0 0 4px 4px;
}

.fine-details-table tr {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.fine-details-table tr:hover {
  background-color: rgba(40, 155, 184, 0.2) !important;
}

.fine-details-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 12px 8px !important;
  vertical-align: middle !important;
}

.fine-details-table .col-event {
  width: 30%;
  text-align: left;
  padding-left: 16px !important;
}

.fine-details-table .col-semester {
  width: 20%;
  text-align: center;
  padding: 12px 8px !important;
}

.fine-details-table .col-fine {
  width: 15%;
  text-align: right;
  padding-right: 16px !important;
}

.fine-details-table .col-date {
  width: 20%;
  text-align: center;
}

.fine-details-table .col-actions {
  width: 15%;
  text-align: center;
}

.total-fines {
  background-color: rgba(40, 155, 184, 0.3);
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: right;
  font-size: 1.1rem;
  color: #fff;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
}

.action-btn {
  min-width: 90px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0 8px;
  margin: 0 2px;
}

.paid-btn {
  background-color: #4CAF50 !important;
  color: white !important;
}

.student-info {
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 16px;
}

.student-info p {
  margin-bottom: 8px;
}

.status-change-container {
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 16px;
}

.locked-notice {
  margin-bottom: 16px;
}

.v-card .v-btn {
  color: #289bb8;
  transition: .5s;
}

.v-card .v-btn:hover {
  background: #289bb8;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #289bb8, 0 0 25px #289bb8, 0 0 50px #289bb8, 0 0 100px #289bb8;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}

.text-right {
  text-align: right;
}

.mt-4 {
  margin-top: 16px;
}

.event-selector {
  max-width: 250px;
}

.search-field {
  margin-top: -15px;
}

.v-pagination {
  justify-content: center;
  margin-top: 20px;
}

.v-pagination__item {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  min-width: 32px;
  height: 32px;
}

.v-pagination__item--active {
  background: #289bb8 !important;
  color: white !important;
}

.v-pagination__navigation {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.regular-buttons {
  margin-top: 16px;
}

@media (max-width: 960px) {
  .student-list-header .col-fname,
  .student-list-header .col-lname,
  .student-fines-table .col-fname,
  .student-fines-table .col-lname {
    width: 20%;
  }
  
  .student-list-header .col-status,
  .student-fines-table .col-status {
    display: none;
  }
  
  .action-btn {
    min-width: 70px;
    font-size: 0.7rem;
    padding: 0 4px;
  }
  
  .fingerprint-icon {
    font-size: 48px !important;
  }
  
  .centered-file-input {
    width: 100%;
  }

  .details-title {
    font-size: 1.2rem !important;
    padding: 12px !important;
  }
}
</style>