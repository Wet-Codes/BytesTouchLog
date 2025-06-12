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
            <v-card-title class="d-flex justify-space-between align-center flex-wrap">
  <h1 class="table-title">STUDENT MANAGEMENT</h1>
  <div class="d-flex align-center flex-wrap" style="gap: 12px;">
  <v-select
    v-model="selectedReader"
    :items="readers"
    item-title="name"
    item-value="serialNumber"
    label="Select Reader"
    density="compact"
    hide-details
    outlined
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


              <!-- Student Table -->
              <v-card-text>
                <v-row>
                  <v-col :cols="selectedStudent ? 8 : 12">
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

                  <v-col v-if="selectedStudent || isNewStudent" cols="4">

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
                         <div class="mt-4 fingerprint-section">
                          <v-alert
                             v-if="statusMessage"
                             :color="fingerprintCaptured ? 'success' : 'info'"
                             dense
                             outlined
                            class="mb-2"
                            >
                         {{ statusMessage }}
                          </v-alert>

                          <v-btn 
                            color="primary"
                            :disabled="enrollmentStarted"
                            @click="startFingerprintEnrollment"
                            class="mb-2"
                            block
                          >
                            <v-icon left>mdi-fingerprint</v-icon>
                                Start Fingerprint Enrollment
                     </v-btn>

                               <v-progress-linear
                            v-if="enrollmentStarted || fingerprintCaptured"
                            :value="fingerprintProgress"
                            height="20"
                            color="teal"
                            class="mb-2"
                          >
                           <strong>{{ fingerprintProgress }}%</strong>
                            </v-progress-linear>
                    </div>
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
        <v-card class="fingerprint-dialog dark-card">
          <v-card-title class="text-center">
        <h2>Fingerprint Enrollment</h2>
            <div class="subtitle">{{ fingerprintStudent.firstName }} {{ fingerprintStudent.lastName }}</div>
          </v-card-title>    
          <v-card-text class="text-center">
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
  // COMPONENTS USED IN THIS VIEW
  components: {
    PageHeader
  },

  // COMPONENT STATE DATA
  data() {
    return {
      // Fingerprint device & enrollment
      availableReaders: [],
      reader: null,
      readers: [],
      selectedReader: null,
      enrollmentStarted: false,
      enrollScanStep: 0,
      indexFingerSamples: [],
      middleFingerSamples: [],
      currentEnrollFinger: 'index',

      // Fingerprint modal UI
      fingerprintCaptured: false,
      fingerprintDialog: false,
      fingerprintStudent: {},
      fingerprintLoading: false,
      fingerprintMessage: 'Ready to enroll fingerprint',
      fingerprintProgress: 0,

      // UI visuals and layout
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      isNewStudent: false,
      responseDialog: false,
      responseType: 'success',
      responseTitle: '',
      responseMessage: '',
      responseIcon: '',

      // Student Data
      students: [],
      selectedStudent: null,
      editForm: {
        firstName: '',
        lastName: '',
        middleInitial: '',
        course: '',
        yearLevel: ''
      },
      filter: {
        course: null,
        yearLevel: null
      },
      search: '',

      // CSV Upload
      uploadDialog: false,
      uploadFile: null,
      statusMessage: '',

      // Dropdown Options & Table Config
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

  // LIFECYCLE: FETCH STUDENTS + INIT SDK
  async mounted() {
    await this.fetchStudents();
    try {
      if (!window.Fingerprint?.WebApi) throw new Error("Fingerprint SDK not available");
      console.log("✅ SDK available");

      this.reader = new window.Fingerprint.WebApi();

      // SDK Event Listeners
      this.reader.onDeviceConnected = () => this.statusMessage = "Device connected. Ready to scan.";
      this.reader.onDeviceDisconnected = () => this.statusMessage = "Device disconnected.";
      this.reader.onCommunicationFailed = () => this.statusMessage = "Communication with reader failed.";
      this.reader.onSamplesAcquired = this.handleEnrollmentSample;

      // List Available Readers
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

  // COMPUTED PROPERTIES
  computed: {
    // Filtered list for search and dropdown filters
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
    // Background image styling
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

  // METHODS
  methods: {
    // Fetch student list from backend
    async fetchStudents() {
      try {
        const response = await Auth.getStudents();
        this.students = response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },

    // UI - Open and cancel registration panel
    openRegistrationDialog() {
      this.selectedStudent = {}; // triggers panel
      this.isNewStudent = true;
      this.editForm = {
        firstName: '',
        middleInitial: '',
        lastName: '',
        course: '',
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

    // UI - File upload modal
    openUploadDialog() {
      this.uploadDialog = true;
      this.uploadFile = null;
    },

    // UI - Open fingerprint dialog for existing student
    openFingerprintDialog(student) {
      this.fingerprintStudent = { ...student };
      this.fingerprintDialog = true;
      this.fingerprintLoading = false;
      this.fingerprintMessage = 'Ready to enroll fingerprint';
      this.fingerprintProgress = 0;
    },

    // UI - Fingerprint enrollment complete
    completeFingerprintEnrollment() {
      this.fingerprintMessage = 'Fingerprint enrolled successfully!';
      setTimeout(() => {
        this.fingerprintDialog = false;
        if (this.$toast) {
          this.$toast.success('Fingerprint enrollment completed');
        }
      }, 1500);
    },

    // UI - Toast / Modal response display
    showResponse(type, title, message) {
      this.responseType = type;
      this.responseTitle = title;
      this.responseMessage = message;
      this.responseIcon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
      this.responseDialog = true;
    },

    // Registration submission logic
    async handleRegistration() {
  if (!this.fingerprintCaptured) {
    this.showResponse('error', 'Missing Fingerprint', 'Please complete fingerprint enrollment first.');
    return;
  }

  // Cleaned-up and correctly structured payload
  const studentPayload = {
    ...this.editForm,
    middleInitial: this.editForm.middleInitial?.trim().charAt(0).toUpperCase() || '',
    enrolled_index_finger_data: this.indexFingerSamples,
    enrolled_middle_finger_data: this.middleFingerSamples
  };
console.log(studentPayload)
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

    // Form validation logic
    validateRegistrationForm() {
      return (
        this.editForm.firstName.trim() &&
        this.editForm.lastName.trim() &&
        this.editForm.course &&
        this.editForm.yearLevel
      );
    },

    // Form reset
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

    // Upload CSV student list
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

    // Fingerprint enrollment for new students
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

    // Handle new student fingerprint scan data
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

    // Fingerprint enrollment for existing student
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

  try {
    const reader = this.reader;
    const format = window.Fingerprint.SampleFormat.Intermediate;
    await reader.startAcquisition(format, this.selectedReader);

    reader.onSamplesAcquired = async (event) => {
      const sampleData = JSON.parse(event.samples)[0].Data; // ✅ EXACTLY LIKE WORKING METHOD

      if (this.currentEnrollFinger === 'index') {
        this.indexFingerSamples.push(sampleData);
      } else {
        this.middleFingerSamples.push(sampleData);
      }

      this.enrollScanStep++;
      this.fingerprintMessage = `Scan ${this.enrollScanStep}/4 for ${this.currentEnrollFinger} finger`;

      if (this.enrollScanStep === 4) {
        if (this.currentEnrollFinger === 'index') {
          this.currentEnrollFinger = 'middle';
          this.enrollScanStep = 0;
          this.fingerprintMessage = 'Now scan 1/4 for middle finger';
        } else {
          await reader.stopAcquisition();
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
              return;
            }

            this.showResponse('success', 'Enrollment Complete', 'Fingerprint enrolled for student successfully');
            await this.fetchStudents();
            this.completeFingerprintEnrollment(); // ✅ <-- HERE
            this.resetForm();
          } catch (error) {
            const message = error.response?.data?.message || 'Registration failed due to server error';
            this.showResponse('error', 'Error', message);
          }
        }
      }
    };
  } catch (err) {
    this.showResponse('error', 'Acquisition Failed', err.message || 'Error during fingerprint acquisition');
    this.resetFingerprintState();
  }
},

    // Reset fingerprint modal UI state
    resetFingerprintState() {
      this.fingerprintLoading = false;
      this.fingerprintProgress = 0;
      this.fingerprintMessage = 'Ready to enroll fingerprint';
    },

    // Cancel ongoing fingerprint modal
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

/* === GLOBAL STYLES === */
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

/* === CARD STYLES === */
.fine-card {
  background: rgba(0, 0, 0, .5) !important;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6) !important;
  border-radius: 10px !important;
  color: white;
}

.student-list-card,
.right-side-card {
  background: rgba(0, 0, 0, 0.3) !important;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .4) !important;
  border-radius: 10px !important;
}

.fingerprint-dialog,
.upload-dialog {
  background: rgba(0, 0, 0, 0.8) !important;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .8) !important;
  border-radius: 10px !important;
}

.dark-card {
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
}

/* === TABLE STYLES === */
.student-list-header {
  display: grid;
  grid-template-columns: 20% 8% 20% 17% 15% 20%;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  border-radius: 4px 4px 0 0;
}

.student-table >>> tbody tr {
  display: grid;
  grid-template-columns: 20% 8% 20% 17% 15% 20%;
}

.student-table >>> td {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px !important;
  color: white !important;
  background: rgba(0, 0, 0, 0.76) !important;
  text-align: center !important;
}

/* === ACTION BUTTONS === */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.action-btn {
  min-width: 100px;
  height: 32px;
  font-size: 12px;
}

/* === FINGERPRINT SECTION === */
.fingerprint-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
}

.fingerprint-icon {
  font-size: 64px;
  color: #289bb8;
}

.fingerprint-message {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

/* === RESPONSIVE ADJUSTMENTS === */
@media (max-width: 960px) {
  .student-list-header,
  .student-table >>> tbody tr {
    grid-template-columns: 22% 8% 22% 18% 15% 15%;
  }
  
  .action-btn {
    min-width: 80px;
    font-size: 0.7rem;
    padding: 0 4px;
  }
  
  .details-title {
    font-size: 1.2rem !important;
    padding: 12px !important;
  }
}

@media (max-width: 600px) {
  .student-list-header,
  .student-table >>> tbody tr {
    grid-template-columns: 25% 8% 25% 20% 22%;
    grid-template-areas: 
      "fname mi lname course year"
      "actions actions actions actions actions";
  }
  
  .col-actions { grid-area: actions; }
  
  .action-buttons {
    justify-content: space-around;
    margin-top: 10px;
  }
}
</style>