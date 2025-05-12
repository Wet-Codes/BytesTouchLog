<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <h1 class="table-title">STUDENT MANAGEMENT</h1>
                <v-btn 
                  color="primary" 
                  dark
                  @click="openUploadDialog"
                >
                  <v-icon left>mdi-upload</v-icon>
                  Upload Students
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col :cols="selectedStudent ? 8 : 12">
                    <v-card class="student-list-card">
                      <v-card-text>
                        <v-row class="mb-4" align="center">
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
                        </v-row>

                        <div class="student-list-header">
                          <span class="col-fname">First Name</span>
                          <span class="col-mi">M.I.</span>
                          <span class="col-lname">Last Name</span>
                          <span class="col-course">Course</span>
                          <span class="col-year">Year Level</span>
                          <span class="col-status">Status</span>
                          <span class="col-actions">Actions</span>
                        </div>
                        <v-data-table
                          :headers="studentFinesHeaders"
                          :items="filteredStudentFines"
                          :items-per-page="-1"
                          :hide-default-footer="true"
                          class="elevation-1 student-fines-table"
                          dark
                          hide-default-header
                        >
                          <template v-slot:item="{ item }">
                            <tr>
                              <td class="col-fname text-center">{{ item.fname }}</td>
                              <td class="col-mi text-center">{{ item.mi }}</td>
                              <td class="col-lname text-center">{{ item.lname }}</td>
                              <td class="col-course text-center">{{ item.course }}</td>
                              <td class="col-year text-center">{{ item.year }}</td>
                              <td class="col-status text-center">
                                <v-chip small :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
                              </td>
                              <td class="col-actions text-center">
                                <div class="action-buttons">
                                  <v-btn small color="primary" @click="viewFine(item)" class="action-btn">
                                    {{ selectedStudent && selectedStudent.id === item.id ? 'Hide' : 'View' }}
                                  </v-btn>
                                  <v-btn small color="warning" @click="editStudent(item)" class="action-btn">
                                    Update
                                  </v-btn>
                                  <v-btn small color="teal" dark @click="openFingerprintDialog(item)" class="action-btn">
                                    Fingerprint
                                  </v-btn>
                                </div>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col v-if="selectedStudent" cols="4">
                    <v-card class="right-side-card">
                      <div class="details-header">
                        <v-card-title class="details-title">
                          {{ selectedStudent.fname }} {{ selectedStudent.lname }}'s Details
                        </v-card-title>
                      </div>
                      <v-card-text>
                        <v-form v-if="isEditing" @submit.prevent="saveStudent">
                          <v-text-field v-model="editForm.fname" label="First Name" outlined dense class="mb-2"></v-text-field>
                          <v-text-field v-model="editForm.lname" label="Last Name" outlined dense class="mb-2"></v-text-field>
                          <v-text-field v-model="editForm.mi" label="Middle Initial" outlined dense class="mb-2"></v-text-field>
                          <v-select
                            v-model="editForm.course"
                            :items="courses"
                            label="Course"
                            outlined
                            dense
                            class="mb-2"
                          ></v-select>
                          <v-select
                            v-model="editForm.year"
                            :items="yearLevels"
                            label="Year Level"
                            outlined
                            dense
                            class="mb-2"
                          ></v-select>
                          <v-select
                            v-model="editForm.status"
                            :items="statusOptions"
                            label="Status"
                            outlined
                            dense
                            class="mb-2"
                          ></v-select>
                          <v-btn type="submit" color="success" small>Save</v-btn>
                          <v-btn @click="cancelEdit" small class="ml-2">Cancel</v-btn>
                        </v-form>

                        <template v-else>
                          <div class="student-info mb-4">
                            <p><strong>Course:</strong> {{ selectedStudent.course }}</p>
                            <p><strong>Year Level:</strong> {{ selectedStudent.year }}</p>
                            <p><strong>Status:</strong> 
                              <v-chip small :color="getStatusColor(selectedStudent.status)">{{ selectedStudent.status }}</v-chip>
                            </p>
                          </div>

                          <div class="fine-details-header">
                            <span class="col-event">Event</span>
                            <span class="col-semester">Semester</span>
                            <span class="col-fine">Fine Amount</span>
                            <span class="col-date">Date</span>
                            <span class="col-actions">Actions</span>
                          </div>
                          <v-data-table
                            :headers="fineDetailsHeaders"
                            :items="fineDetails"
                            :hide-default-footer="true"
                            class="elevation-1 fine-details-table"
                            dark
                            hide-default-header
                          >
                            <template v-slot:item="{ item }">
                              <tr>
                                <td class="col-event">
                                  <v-edit-dialog
                                    v-model="item.event"
                                    @save="updateFineDetail"
                                    large
                                  >
                                    {{ item.event }}
                                    <template v-slot:input>
                                      <v-text-field
                                        v-model="item.event"
                                        label="Edit"
                                        single-line
                                      ></v-text-field>
                                    </template>
                                  </v-edit-dialog>
                                </td>
                                <td class="col-semester">
                                  <v-select
                                    v-model="item.semester"
                                    :items="['1st Semester', '2nd Semester']"
                                    @change="updateFineDetail"
                                    dense
                                    hide-details
                                  ></v-select>
                                </td>
                                <td class="col-fine">
                                  <v-edit-dialog
                                    v-model="item.fine"
                                    @save="updateFineDetail"
                                    large
                                  >
                                    {{ item.fine }}
                                    <template v-slot:input>
                                      <v-text-field
                                        v-model="item.fine"
                                        label="Edit"
                                        single-line
                                        type="number"
                                        prefix="₱"
                                      ></v-text-field>
                                    </template>
                                  </v-edit-dialog>
                                </td>
                                <td class="col-date">
                                  {{ formatDate(item.date) }}
                                </td>
                                <td class="col-actions">
                                  <v-btn 
                                    x-small 
                                    color="error" 
                                    @click="removeFine(item)"
                                  >
                                    Remove
                                  </v-btn>
                                </td>
                              </tr>
                            </template>
                          </v-data-table>
                          <div class="total-fines">
                            <strong>Total Fines: {{ calculateTotalFines() }}</strong>
                          </div>
                          <v-btn 
                            color="success" 
                            class="paid-btn mt-2"
                            @click="clearFines"
                            :disabled="fineDetails.length === 0"
                          >
                            Mark All as Paid
                          </v-btn>
                        </template>
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
                label="SELECT CSV FILE"
                accept=".csv"
                outlined
                prepend-icon="mdi-paperclip"
                @change="previewUpload"
                class="centered-file-input"
              ></v-file-input>
            </div>
            <v-data-table
              :headers="uploadHeaders"
              :items="uploadPreview"
              class="elevation-1 upload-table"
              dark
            ></v-data-table>
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
            Fingerprint Enrollment - {{ fingerprintStudent.fname }} {{ fingerprintStudent.lname }}
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
import { format } from 'date-fns';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      filter: {
        course: null,
        yearLevel: null,
      },
      selectedStudent: null,
      isEditing: false,
      editForm: {},
      uploadDialog: false,
      uploadFile: null,
      uploadPreview: [],
      uploadHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'First Name', value: 'fname' },
        { text: 'Last Name', value: 'lname' },
        { text: 'Course', value: 'course' },
        { text: 'Year Level', value: 'year' }
      ],
      fingerprintDialog: false,
      fingerprintStudent: {},
      fingerprintLoading: false,
      fingerprintMessage: 'Ready to enroll fingerprint',
      fingerprintProgress: 0,
      statusOptions: ['Regular', 'Irregular', 'Shifted', 'Graduated', 'Dropped'],
      fineDetails: [],
      courses: ['All', 'BSIT', 'BSIS', 'BSCS'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      studentFinesHeaders: [
        { text: 'First Name', value: 'fname', align: 'center', width: '15%' },
        { text: 'M.I.', value: 'mi', align: 'center', width: '5%' },
        { text: 'Last Name', value: 'lname', align: 'center', width: '15%' },
        { text: 'Course', value: 'course', align: 'center', width: '15%' },
        { text: 'Year Level', value: 'year', align: 'center', width: '15%' },
        { text: 'Status', value: 'status', align: 'center', width: '15%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '20%', sortable: false }
      ],
      studentFines: [
        { 
          id: 1, 
          fname: 'Al-shiolla', 
          mi: 'H.', 
          lname: 'Haron', 
          course: 'BSIT', 
          year: '3rd Year', 
          status: 'Regular',
          hasFine: true,
          hasFingerprint: true,
          fingerprintDate: '2023-05-15'
        },
        { 
          id: 2, 
          fname: 'Jane', 
          mi: 'A.', 
          lname: 'Batuhan', 
          course: 'BSIT', 
          year: '4th Year', 
          status: 'Graduated',
          hasFine: false,
          hasFingerprint: false
        },
        { 
          id: 3, 
          fname: 'Aiman', 
          mi: 'C.', 
          lname: 'Pumbaya', 
          course: 'BSIT', 
          year: '3rd Year', 
          status: 'Regular',
          hasFine: true,
          hasFingerprint: true,
          fingerprintDate: '2023-06-20'
        },
        { 
          id: 4, 
          fname: 'Sodais', 
          mi: 'M.', 
          lname: 'Macapantao', 
          course: 'BSIS', 
          year: '2nd Year', 
          status: 'Irregular',
          hasFine: false,
          hasFingerprint: false
        },
        { 
          id: 5, 
          fname: 'Abdulazis', 
          mi: 'D.', 
          lname: 'Mapandi', 
          course: 'BSCS', 
          year: '1st Year', 
          status: 'Regular',
          hasFine: true,
          hasFingerprint: false
        },
        { 
          id: 6, 
          fname: 'Faiz', 
          mi: 'A.', 
          lname: 'Rataban', 
          course: 'BSCS', 
          year: '3rd Year', 
          status: 'Shifted',
          hasFine: false,
          hasFingerprint: true,
          fingerprintDate: '2023-04-10'
        },
        { 
          id: 7, 
          fname: 'Doms', 
          mi: 'M.', 
          lname: 'Benito', 
          course: 'BSIS', 
          year: '2nd Year', 
          status: 'Regular',
          hasFine: true,
          hasFingerprint: false
        }
      ],
      fineDetailsHeaders: [
        { text: 'Event Name', value: 'event', width: '25%' },
        { text: 'Semester', value: 'semester', width: '15%' },
        { text: 'Fine Amount', value: 'fine', width: '20%' },
        { text: 'Date', value: 'date', width: '20%' },
        { text: 'Actions', value: 'actions', width: '20%' }
      ]
    };
  },
  computed: {
    filteredStudentFines() {
      return this.studentFines.filter((student) => {
        return (
          (this.filter.course === 'All' || !this.filter.course || student.course === this.filter.course) &&
          (this.filter.yearLevel === 'All' || !this.filter.yearLevel || student.year === this.filter.yearLevel)
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
    getStatusColor(status) {
      const colors = {
        'Regular': 'green',
        'Irregular': 'orange',
        'Shifted': 'blue',
        'Graduated': 'purple',
        'Dropped': 'red'
      };
      return colors[status] || 'gray';
    },
    calculateTotalFines() {
      const total = this.fineDetails.reduce((sum, item) => {
        return sum + parseFloat(item.fine.replace('₱', ''));
      }, 0);
      return `₱${total.toFixed(2)}`;
    },
    viewFine(student) {
      if (this.selectedStudent && this.selectedStudent.id === student.id) {
        this.selectedStudent = null;
        this.isEditing = false;
      } else {
        this.selectedStudent = student;
        this.isEditing = false;
        this.fineDetails = this.generateMockFineDetails();
      }
    },
    editStudent(student) {
      this.selectedStudent = student;
      this.isEditing = true;
      this.editForm = { ...student };
    },
    saveStudent() {
      const index = this.studentFines.findIndex(s => s.id === this.editForm.id);
      if (index !== -1) {
        this.studentFines[index] = { ...this.editForm };
      }
      this.isEditing = false;
      this.selectedStudent = { ...this.editForm };
    },
    cancelEdit() {
      this.isEditing = false;
    },
    clearFines() {
      this.fineDetails = [];
      if (this.$toast) {
        this.$toast.success(`${this.selectedStudent.fname} ${this.selectedStudent.lname}'s fines have been marked as paid!`);
      }
    },
    openUploadDialog() {
      this.uploadDialog = true;
      this.uploadFile = null;
      this.uploadPreview = [];
    },
    previewUpload() {
      if (this.uploadFile) {
        this.uploadPreview = [
          { id: '101', fname: 'New', lname: 'Student1', course: 'BSIT', year: '1st Year' },
          { id: '102', fname: 'New', lname: 'Student2', course: 'BSCS', year: '2nd Year' }
        ];
      } else {
        this.uploadPreview = [];
      }
    },
    uploadStudents() {
      if (this.$toast) {
        this.$toast.success('Students uploaded successfully');
      }
      this.uploadDialog = false;
    },
    openFingerprintDialog(student) {
      this.fingerprintStudent = { ...student };
      this.fingerprintDialog = true;
      this.fingerprintLoading = false;
      this.fingerprintMessage = 'Ready to enroll fingerprint';
      this.fingerprintProgress = 0;
    },
    startFingerprintProcess() {
      this.fingerprintLoading = true;
      this.fingerprintMessage = 'Place your finger on the sensor';
      
      const interval = setInterval(() => {
        this.fingerprintProgress += 10;
        if (this.fingerprintProgress >= 100) {
          clearInterval(interval);
          this.completeFingerprintEnrollment();
        }
      }, 500);
    },
    completeFingerprintEnrollment() {
      const index = this.studentFines.findIndex(s => s.id === this.fingerprintStudent.id);
      if (index !== -1) {
        this.studentFines[index].hasFingerprint = true;
        this.studentFines[index].fingerprintDate = new Date().toISOString();
        this.fingerprintStudent = { ...this.studentFines[index] };
        if (this.selectedStudent && this.selectedStudent.id === this.fingerprintStudent.id) {
          this.selectedStudent = { ...this.studentFines[index] };
        }
      }
      this.fingerprintMessage = 'Fingerprint enrolled successfully!';
      
      setTimeout(() => {
        this.fingerprintDialog = false;
        if (this.$toast) {
          this.$toast.success('Fingerprint enrollment completed');
        }
      }, 1500);
    },
    cancelFingerprintEnrollment() {
      this.fingerprintDialog = false;
      if (this.$toast) {
        this.$toast.info('Fingerprint enrollment canceled');
      }
    },
    updateFineDetail() {
      if (this.$toast) {
        this.$toast.success('Fine updated successfully');
      }
    },
    removeFine(fine) {
      try {
        this.fineDetails = this.fineDetails.filter(f => f !== fine);
        if (this.$toast) {
          this.$toast.success('Fine removed successfully');
        }
      } catch (error) {
        console.error('Error removing fine:', error);
        if (this.$toast) {
          this.$toast.error('Failed to remove fine');
        }
      }
    },
    generateMockFineDetails() {
      const events = ['Orientation', 'Seminar', 'Workshop', 'Meeting'];
      const semesters = ['1st Semester', '2nd Semester'];
      const details = [];
      
      for (let i = 0; i < 3; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomSemester = semesters[Math.floor(Math.random() * semesters.length)];
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
        
        details.push({
          event: randomEvent,
          semester: randomSemester,
          fine: '₱' + (Math.random() * 500).toFixed(2),
          date: randomDate.toISOString()
        });
      }
      
      return details;
    },
    formatDate(dateString) {
      return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : 'N/A';
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

.page-title {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  margin-top: 20px;
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
  color: white;
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

.fingerprint-dialog {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
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
}

.fine-details-header .col-event {
  width: 25%;
  text-align: left;
}

.fine-details-header .col-semester {
  width: 15%;
  text-align: center;
}

.fine-details-header .col-fine {
  width: 20%;
  text-align: right;
}

.fine-details-header .col-date {
  width: 20%;
  text-align: center;
}

.fine-details-header .col-actions {
  width: 20%;
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
  width: 25%;
  text-align: left;
  padding-left: 16px !important;
}

.fine-details-table .col-semester {
  width: 15%;
  text-align: center;
}

.fine-details-table .col-fine {
  width: 20%;
  text-align: right;
  padding-right: 16px !important;
}

.fine-details-table .col-date {
  width: 20%;
  text-align: center;
}

.fine-details-table .col-actions {
  width: 20%;
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