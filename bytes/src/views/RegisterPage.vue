<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center flex-wrap">
                <h1 class="table-title">STUDENT MANAGEMENT</h1>
                <div class="d-flex align-center flex-wrap" style="gap: 12px;">
                   <v-btn
    icon
    @click="refreshReaders"
    class="refresh-reader-btn"
    title="Refresh Readers"
  >
    <v-icon color="white">mdi-refresh</v-icon>
  </v-btn>

                   <v-select
    v-model="selectedReader"
    :items="readers"
    item-title="name"
    item-value="serialNumber"
    label="Select Reader"
    density="compact"
    hide-details
    outlined
    dark
    :placeholder="'No Reader'"
    class="reader-select"
    style="min-width: 220px;"
  />

 
                  
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
                  <v-col :cols="selectedStudent ? 8 : 12">
                    <v-card class="student-list-card">
                      <v-card-text>
                        <v-row class="mb-1" align="center">
                          <v-col cols="12" class="d-flex">
                            <v-col cols="6">
                              <v-select
                                v-model="filter.department"
                                :items="department"
                                label="Select Department"
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
                                class="custom-pagination"
                              ></v-pagination>
                            </div>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                 <v-col v-if="selectedStudent || isNewStudent" cols="4">
  <v-card class="fine-card">
    <div class="details-header">
      <v-card-title class="details-title white--text">
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
          class="mb-2 white--text"
          color="white"
        ></v-text-field>

        <v-text-field 
          v-model="editForm.middleInitial" 
          label="Middle Initial" 
          outlined 
          dense 
          class="mb-2 white--text"
          maxlength="1"
          color="white"
        ></v-text-field>

        <v-text-field 
          v-model="editForm.lastName" 
          label="Last Name" 
          outlined 
          dense 
          class="mb-2 white--text"
          color="white"
        ></v-text-field>

        <v-select
          v-model="editForm.department" 
          :items="department.filter(c => c !== 'All')"
          label="Department"
          outlined
          dense
          class="mb-2 white--text"
          color="white"
        ></v-select>

        <v-select
          v-model="editForm.yearLevel"
          :items="yearLevels.filter(y => y !== 'All')"
          label="Year Level"
          outlined
          dense
          class="mb-2 white--text"
          color="white"
        ></v-select>

        <!-- Fingerprint Section -->
        <div class="mt-4 fingerprint-section">
          <v-alert
            v-if="statusMessage"
            :color="fingerprintCaptured ? 'success' : 'info'"
            dense
            outlined
            class="mb-2"
            style="background-color: rgba(255, 255, 255, 0.05); color: white;"
          >
            {{ statusMessage }}
          </v-alert>

          <v-btn 
            color="cyan darken-2"
            :disabled="enrollmentStarted"
            @click="startFingerprintEnrollment"
            class="mb-2"
            block
            dark
          >
            <v-icon left>mdi-fingerprint</v-icon>
            Start Fingerprint Enrollment
          </v-btn>

          <v-progress-linear
            v-if="fingerprintLoading"
            :value="fingerprintProgress"
            height="25"
            color="teal lighten-2"
            class="mt-4 fingerprint-progress-bar"
            rounded
            background-color="rgba(255,255,255,0.1)"
          >
            <template v-slot:default>
              <div class="progress-label">{{ fingerprintProgress }}%</div>
            </template>
          </v-progress-linear>

                          </div>
                          <div class="regular-buttons">
                            <v-btn type="submit" color="success" dark>Complete Registration</v-btn>
                            <v-btn @click="cancelRegistration" class="ml-2" dark>Cancel</v-btn>
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

      <v-dialog v-model="responseDialog" max-width="400" class="response-dialog">
  <v-card :class="['pa-4', 'response-dialog-card', responseType === 'success' ? 'response-success' : 'response-error']">
    <v-card-title class="d-flex align-center">
      <v-icon :color="responseType === 'success' ? 'green' : 'red'" class="mr-2">
        {{ responseIcon }}
      </v-icon>
      <span class="text-h6">{{ responseTitle }}</span>
    </v-card-title>
    <v-card-text class="pt-2">
      <p class="text-body-2">{{ responseMessage }}</p>
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn text @click="responseDialog = false">OK</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

      <v-dialog v-model="uploadDialog" max-width="600" dark>
        <v-card class="upload-dialog dark-card">
          <v-card-title class="headline white--text">Upload Students</v-card-title>
          <v-card-text>
            <div class="file-input-container">
              <v-file-input
                v-model="uploadFile"
                label="SELECT FILE"
                accept=".xlsx"
                outlined
                dark
                prepend-icon="mdi-paperclip"
                class="centered-file-input"
              ></v-file-input>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark @click="uploadStudents">Upload</v-btn>
            <v-btn text dark @click="uploadDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="fingerprintDialog" max-width="500" persistent>
        <v-card class="fingerprint-dialog dark-card">
          <v-card-title class="text-center white--text">
            <h2>Fingerprint Enrollment</h2>
            <div class="subtitle">{{ fingerprintStudent.firstName }} {{ fingerprintStudent.lastName }}</div>
          </v-card-title>    
          <v-card-text class="text-center white--text">
            <v-icon x-large class="mb-4 fingerprint-icon">mdi-fingerprint</v-icon>
            <p class="fingerprint-message">{{ fingerprintMessage }}</p>
            
            <v-progress-linear
              v-if="fingerprintLoading"
              :value="fingerprintProgress"
              height="25"
              color="teal"
              class="mt-4"
            >
              <strong>{{ fingerprintProgress }}%</strong>
            </v-progress-linear>

            <v-btn 
              v-else
              color="primary" 
              class="mt-4"
              @click="startFingerprintProcess"
              block
              dark
            >
              Start Enrollment
            </v-btn>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="error" 
              @click="cancelFingerprintEnrollment"
              :disabled="fingerprintLoading"
              dark
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
      availableReaders: [],
      reader: null,
      readers: [],
      selectedReader: null,
      enrollmentStarted: false,
      enrollScanStep: 0,
      indexFingerSamples: [],
      middleFingerSamples: [],
      currentEnrollFinger: 'index',

      fingerprintCaptured: false,
      fingerprintDialog: false,
      fingerprintStudent: {},
      fingerprintLoading: false,
      fingerprintMessage: 'Ready to enroll fingerprint',
      fingerprintProgress: 0,

      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      isNewStudent: false,
      responseDialog: false,
      responseType: 'success',
      responseTitle: '',
      responseMessage: '',
      responseIcon: '',

      students: [],
      selectedStudent: null,
      editForm: {
        firstName: '',
        lastName: '',
        middleInitial: '',
        department: '',
        yearLevel: ''
      },
      filter: {
        course: null,
        yearLevel: null
      },
      search: '',

      uploadDialog: false,
      uploadFile: null,
      statusMessage: '',

      department: ['All', 'BSIT', 'BSIS', 'BSCS', 'BSIT-DB', 'BSIT-MM'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      studentHeaders: [
        { text: 'First Name', value: 'firstName', align: 'center', width: '20%' },
        { text: 'M.I.', value: 'middleInitial', align: 'center', width: '20%' },
        { text: 'Last Name', value: 'lastName', align: 'center', width: '20%' },
        { text: 'Course', value: 'department', align: 'center', width: '20%' },
        { text: 'Year Level', value: 'yearLevel', align: 'center', width: '20%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '20%', sortable: false }
      ],
      page: 1,
      pageCount: 3
    };
  },
  async mounted() {
    await this.fetchStudents();
    try {
      if (!window.Fingerprint?.WebApi) throw new Error("Fingerprint SDK not available");
      console.log("✅ SDK available");

      this.reader = new window.Fingerprint.WebApi();

      this.reader.onDeviceConnected = () => this.statusMessage = "Device connected. Ready to scan.";
      this.reader.onDeviceDisconnected = () => this.statusMessage = "Device disconnected.";
      this.reader.onCommunicationFailed = () => this.statusMessage = "Communication with reader failed.";
      this.reader.onSamplesAcquired = this.handleEnrollmentSample;

      const devices = await this.reader.enumerateDevices();
      this.readers = devices;
      this.selectedReader = devices[0]?.serialNumber || null;
      this.statusMessage = devices.length ? "Select a reader" : "No fingerprint readers found";
      console.log("📡 Available readers:", devices);
    } catch (err) {
      console.error("❌ SDK init error:", err);
      this.statusMessage = `SDK error: ${err.message}`;
      this.showLiteClientLink = true;
    }
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

      async refreshReaders() {
    try {
      if (!window.Fingerprint?.WebApi) throw new Error("Fingerprint SDK not available");
      console.log("✅ SDK available");

      this.reader = new window.Fingerprint.WebApi();

      this.reader.onDeviceConnected = () => {
        this.statusMessage = "Device connected. Ready to scan.";
      };
      this.reader.onDeviceDisconnected = () => {
        this.statusMessage = "Device disconnected.";
      };
      this.reader.onCommunicationFailed = () => {
        this.statusMessage = "Communication with reader failed.";
      };
      this.reader.onSamplesAcquired = this.handleEnrollmentSample;

      const devices = await this.reader.enumerateDevices();
      this.readers = devices;
      this.selectedReader = devices[0]?.serialNumber || null;
      this.statusMessage = devices.length
        ? "Select a reader"
        : "No fingerprint readers found";
      console.log("📡 Available readers:", devices);
    } catch (err) {
      console.error("❌ SDK init error:", err);
      this.statusMessage = `SDK error: ${err.message}`;
      this.showLiteClientLink = true;
    }
  },
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
        middleInitial: '',
        lastName: '',
        department: '',
        yearLevel: ''
      };
      this.fingerprintCaptured = false;
      this.statusMessage = '';
      this.fingerprintProgress = 0;
      this.enrollmentStarted = false;
    },
    cancelRegistration() {
      this.selectedStudent = null;
      this.isNewStudent = false;
      this.editForm = {
        firstName: '',
        middleInitial: '',
        lastName: '',
        department: '',
        yearLevel: ''
      };
      this.fingerprintCaptured = false;
      this.statusMessage = '';
      this.fingerprintProgress = 0;
      this.enrollmentStarted = false;
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

    // 🔁 Refresh the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 500); // Optional: allow toast to show before reload
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
      if (!this.fingerprintCaptured) {
        this.showResponse('error', 'Missing Fingerprint', 'Please complete fingerprint enrollment first.');
        return;
      }

      const studentPayload = {
        ...this.editForm,
        middleInitial: this.editForm.middleInitial?.trim().charAt(0).toUpperCase() || '',
        enrolled_index_finger_data: this.indexFingerSamples,
        enrolled_middle_finger_data: this.middleFingerSamples
      };
      
      if (!studentPayload.firstName || !studentPayload.lastName || !studentPayload.department || !studentPayload.yearLevel) {
        this.showResponse('error', 'Validation Error', 'Please fill all required fields');
        return;
      }

      try {
        const response = await Auth.createStudent(studentPayload);
        
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
        this.editForm.department &&
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
        department: '',
        yearLevel: ''
      };
    },
    async uploadStudents() {
      try {
        if (!this.uploadFile) {
          this.showResponse('error', 'Upload Error', 'Please select a file first');
          return;
        }

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

    
    async startFingerprintEnrollment() {
      if (!this.readers || !this.selectedReader) {
        this.statusMessage = 'No reader selected';
        return;
      }

      this.enrollScanStep = 0;
      this.indexFingerSamples = [];
      this.middleFingerSamples = [];
      this.currentEnrollFinger = 'index';
      this.enrollmentStarted = true;
      this.statusMessage = 'Starting enrollment... Scan 1/4 for index finger';
      this.fingerprintProgress = 0;

      try {
        await this.reader.startAcquisition(window.Fingerprint.SampleFormat.Intermediate, this.selectedReader);
      } catch (err) {
        this.statusMessage = `Failed to start acquisition: ${err.message}`;
      }
    },
    async handleEnrollmentSample(event) {
      const sampleData = JSON.parse(event.samples)[0].Data;

      if (this.currentEnrollFinger === 'index') {
        this.indexFingerSamples.push(sampleData);
      } else {
        this.middleFingerSamples.push(sampleData);
      }

      this.enrollScanStep++;
      this.fingerprintProgress = Math.floor((this.enrollScanStep / 4) * 100);
      this.statusMessage = `Scan ${this.enrollScanStep + 1}/4 for ${this.currentEnrollFinger} finger`;

      if (this.enrollScanStep === 4) {
        if (this.currentEnrollFinger === 'index') {
          this.currentEnrollFinger = 'middle';
          this.enrollScanStep = 0;
          this.statusMessage = 'Now scan 1/4 for middle finger';
        } else {
          await this.reader.stopAcquisition();
          this.enrollmentStarted = false;
          this.statusMessage = 'Fingerprint enrollment completed';
          this.fingerprintCaptured = true;
        }

        
      }
    },
  async startFingerprintProcess() {
  if (!this.readers || !this.selectedReader) {
    this.showResponse('Try again', 'No reader selected', 'Please Select a reader');
    return;
  }

  if (!this.fingerprintStudent?.id) {
    this.showResponse('error', 'Missing Student', 'Please select a valid student.');
    return;
  }

  this.fingerprintLoading = true;
  this.enrollScanStep = 0;
  this.indexFingerSamples = [];
  this.middleFingerSamples = [];
  this.currentEnrollFinger = 'index';
  this.fingerprintMessage = 'Starting fingerprint enrollment...';
  this.fingerprintProgress = 0;

  try {
    const reader = this.reader;
    const format = window.Fingerprint.SampleFormat.Intermediate;

    // Clean up any previous handler
    reader.onSamplesAcquired = null;

    await reader.startAcquisition(format, this.selectedReader);

    reader.onSamplesAcquired = async (event) => {
      const sampleData = JSON.parse(event.samples)[0].Data;

      if (this.currentEnrollFinger === 'index') {
        this.indexFingerSamples.push(sampleData);
      } else {
        this.middleFingerSamples.push(sampleData);
      }

      this.enrollScanStep++;

      // 👇 Update fingerprint progress out of 8 total scans
      const totalScans = (this.currentEnrollFinger === 'index')
        ? this.enrollScanStep
        : this.enrollScanStep + 4;

      this.fingerprintProgress = Math.floor((totalScans / 8) * 100);
      this.fingerprintMessage = `Scan ${this.enrollScanStep}/4 for ${this.currentEnrollFinger} finger`;

      if (this.enrollScanStep === 4) {
        if (this.currentEnrollFinger === 'index') {
          this.currentEnrollFinger = 'middle';
          this.enrollScanStep = 0;
          this.fingerprintMessage = 'Now scan 1/4 for middle finger';
        } else {
          try {
            await reader.stopAcquisition();
          } catch (stopError) {
            console.warn('Failed to stop acquisition:', stopError);
          }

          reader.onSamplesAcquired = null; // ✅ Ensure cleanup
          this.fingerprintMessage = 'Sending to backend...';

          const payload = {
            studentId: this.fingerprintStudent.id,
            enrolled_index_finger_data: this.indexFingerSamples,
            enrolled_middle_finger_data: this.middleFingerSamples
          };

          try {
            console.log('Enroll Payload:', payload);
            const response = await Auth.EnrollExist(payload);

            if (response.data?.error) {
              const errMsg = typeof response.data.error === 'string'
                ? response.data.error
                : 'Unknown error during enrollment';
              this.showResponse('error', 'Registration Failed', errMsg);
              this.resetFingerprintState();
              return;
            }

            this.showResponse('success', 'Enrollment Complete', 'Fingerprint enrolled successfully.');
            await this.fetchStudents();
          } catch (error) {
            const message = error.response?.data?.message || 'Registration failed due to server error';
            this.showResponse('error', 'Error', message);
          }
 await this.fetchStudents();

          // ✅ Final cleanup
          this.completeFingerprintEnrollment();
          this.resetFingerprintState();
          this.resetForm();
        }
      }
    };
  } catch (err) {
    this.showResponse('error', 'Acquisition Failed', err.message || 'Error during fingerprint acquisition');
    await this.safeStopAcquisition?.();
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
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');

/* === Refresh === */
.refresh-reader-btn {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: 0.3s;
}

.refresh-reader-btn:hover {
  background: #289bb8;
  box-shadow: 0 0 5px #289bb8, 0 0 10px #289bb8;
}
/* === GENERAL === */
body {
  font-family: 'Poppins', sans-serif;
  background: #0d003d;
  color: white;
  margin: 0;
  padding: 0;
}

/* === DARK GLASS CARD STYLES === */
.fine-card,
.student-list-card,
.fingerprint-dialog,
.upload-dialog,
.confirm-dialog {
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  padding: 16px;
}

/* === TITLES === */
.page-title,
.table-title {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin: 20px 0;
}

/* === HEADERS === */
.student-list-header,
.fine-details-header {
  display: flex;
  background: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 4px 4px 0 0;
}

.student-list-header span,
.fine-details-header span {
  flex: 1;
  text-align: center;
}

/* === TABLES === */
.student-table,
.student-fines-table,
.fine-details-table {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  border-collapse: collapse;
}

.student-table td,
.student-fines-table td,
.fine-details-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.student-table tr:hover,
.student-fines-table tr:hover,
.fine-details-table tr:hover {
  background-color: rgba(40, 155, 184, 0.2);
}

/* === PROGRESS BAR === */
.fingerprint-progress-bar {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.4s ease;
  font-weight: bold;
}

.v-progress-linear__content {
  color: white;
  font-weight: bold;
}

.progress-label {
  color: white;
  text-align: center;
  width: 100%;
}

/* === BUTTONS === */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.action-btn {
  min-width: 90px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin: 0 2px;
  transition: 0.3s;
}

.action-btn:hover {
  background: #289bb8;
  color: white;
  box-shadow: 0 0 5px #289bb8, 0 0 20px #289bb8;
}

.paid-btn {
  background-color: #4CAF50 !important;
  color: white !important;
}

/* === FILE INPUT === */
.centered-file-input >>> .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #289bb8;
}

.centered-file-input >>> .v-text-field__slot input {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

.centered-file-input >>> .v-label {
  color: #289bb8;
  font-size: 1.1rem;
  text-align: center;
  width: 100%;
}

/* === TOAST / RESPONSE DIALOG === */
.response-dialog-card.response-success {
  background: rgba(0, 0, 0, 0.7);
  border-left: 6px solid #4CAF50;
  color: white;
  border-radius: 12px;
}

.response-dialog-card.response-error {
  background: rgba(0, 0, 0, 0.7);
  border-left: 6px solid #F44336;
  color: white;
  border-radius: 12px;
}

.response-dialog-card .v-card-title,
.response-dialog-card .v-card-text,
.response-dialog-card .v-card-actions {
  color: white !important;
}

.response-dialog-card .v-btn--text {
  color: #90caf9 !important;
}

.v-dialog.response-dialog > .v-overlay__content {
  backdrop-filter: blur(6px);
}

/* === TABLE FOOTERS === */
.v-data-table .v-data-table__wrapper,
.v-data-table .v-data-footer {
  background: transparent !important;
}

/* === TOTAL FINES BOX === */
.total-fines {
  background: rgba(40, 155, 184, 0.3);
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  text-align: right;
  font-size: 1.1rem;
}

/* === STUDENT INFO / STATUS === */
.student-info,
.status-change-container {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
}

/* === CONFIRM DIALOG === */
.confirm-dialog .headline {
  color: #FF5252;
  font-weight: bold;
}

/* === PAGINATION === */
.v-pagination {
  justify-content: center;
  margin-top: 20px;
}

.v-pagination__item {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.v-pagination__item--active {
  background: #289bb8;
  color: white;
}

.v-pagination__navigation {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.custom-pagination {
  margin-top: 8px;
}

/* === RESPONSIVE === */
@media (max-width: 960px) {
  .student-list-header .col-status,
  .student-fines-table .col-status,
  .student-table .col-status {
    display: none;
  }

  .action-btn {
    min-width: 70px;
    font-size: 0.7rem;
  }
}
</style>
