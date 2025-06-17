<template>
  <v-app>
    <!-- Page Header -->
    <page-header />
    
    <!-- Main Layout with Sidebar -->
    <v-layout>
      <!-- Left Sidebar Navigation - Overlapping -->
      <v-navigation-drawer
        permanent
        width="250"
        class="sidebar overlapping-sidebar"
      >
        <div class="sidebar-header">
          <v-icon size="40" color="white">mdi-account-circle</v-icon>
        </div>
        
        <v-list class="sidebar-buttons">
          <v-list-item
            v-for="button in sidebarButtons"
            :key="button.route"
            class="sidebar-button-wrapper"
            @click="navigateTo(button.route)"
          >
            <div class="sidebar-button-content">
              <v-icon size="30" class="sidebar-icon">{{ button.icon }}</v-icon>
              <span class="sidebar-text">{{ button.text }}</span>
            </div>
            <div class="border-animation"></div>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content Area -->
      <v-main>
        <div :style="backgroundStyle">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-card class="fine-card" elevation="2">
                  <v-card-title class="d-flex justify-space-between align-center">
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
                  <v-card-text>
                    <v-row>

                      <v-col :cols="(selectedStudent || isNewStudent) ? 8 : 12">
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
                              <span class="col-status">Status</span>
                              <span class="col-actions">Actions</span>
                            </div>

                            <!-- Student Table -->
                            <v-data-table
                              :headers="studentFinesHeaders"
                              :items="filteredStudentFines"
                              :search="search"
                              :items-per-page="10"
                              class="elevation-1 student-fines-table"
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
                                  <td class="col-status text-center">
                                    <v-chip small :color="getStatusColor(item.status)">{{ item.status }}</v-chip>
                                  </td>

                                     <!-- The buttons -->

                                  <!-- View button -->
                                  <td class="col-actions text-center">
                                    <div class="action-buttons">
                                      <v-btn 
                                        small 
                                        color="primary" 
                                        @click="viewFine(item);" 
                                        class="action-btn"
                                        :disabled="isStudentLocked(item)"
                                      >
                                        {{ selectedStudent && selectedStudent.id === item.id ? 'Hide' : 'View' }}
                                      </v-btn>

                                      <!-- Update button -->
                                      <v-btn 
                                        small 
                                        color="warning" 
                                        @click="editStudent(item);" 
                                        class="action-btn"
                                        :disabled="isStudentLocked(item)"
                                      >
                                        Update
                                      </v-btn>

                                      <!-- Finger button -->
                                      <v-btn 
                                        small 
                                        color="teal" 
                                        dark 
                                        @click="openFingerprintDialog(item)" 
                                        class="action-btn"
                                        :disabled="isStudentLocked(item)"
                                      >
                                        Fingerprint
                                      </v-btn>
                                    </div>
                                  </td>
                                </tr>
                              </template>

                              <!-- footer -->

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

                      <!-- Register side Card -->
                       <v-col v-if="isNewStudent" cols="4">

                      <v-card class="right-side-card">
                      <div class="details-header">
                        <v-card-title class="details-title">
                         {{ isNewStudent ? 'New Student Registration' : selectedStudent.firstName + ' ' + selectedStudent.lastName }}
                       
                      </v-card-title>
                      </div>

                      <v-card-text>
                        <v-form @submit.prevent="handleRegistration">
                          <v-text-field 
                            v-model="RegForm.firstName" 
                            label="First Name" 
                            outlined 
                            dense 
                            class="mb-2"
                            required
                          ></v-text-field>
                          <v-text-field 
                            v-model="RegForm.middleInitial" 
                            label="Middle Initial" 
                            outlined 
                            dense 
                            class="mb-2"
                            maxlength="1"
                          ></v-text-field>
                          <v-text-field 
                            v-model="RegForm.lastName" 
                            label="Last Name" 
                            outlined 
                            dense 
                            class="mb-2"
                            required
                          ></v-text-field>
                          <v-select
                          v-model="RegForm.department" 
                          :items="courses.filter(c => c !== 'All')"
                          label="Department"
                          outlined
                          dense
                          class="mb-2"
                          required
                          ></v-select>
                          <v-select
                            v-model="RegForm.yearLevel"
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


                       <!-- Update side Card -->
                      <v-col v-if="selectedStudent" cols="4">
                        <v-card class="right-side-card">
                          <div class="details-header">
                            <v-card-title class="details-title">
                              {{ selectedStudent.firstName }} {{ selectedStudent.lastName }}'s Details
                            </v-card-title>
                          </div>
                          <v-card-text>
                            <v-form v-if="isEditing && !isStudentLocked(selectedStudent)" @submit.prevent="checkStatusBeforeSave">
                              <v-text-field v-model="editForm.firstName" label="First Name" outlined dense class="mb-2"></v-text-field>
                              <v-text-field v-model="editForm.lastName" label="Last Name" outlined dense class="mb-2"></v-text-field>
                              <v-text-field v-model="editForm.middleInitial" label="Middle Initial" outlined dense class="mb-2"></v-text-field>
                              <v-select
                                v-model="editForm.department"
                                :items="courses.filter(c => c !== 'All')"
                                label="Course"
                                outlined
                                dense
                                class="mb-2"
                              ></v-select>
                              <v-select
                                v-model="editForm.yearLevel"
                                :items="yearLevels.filter(y => y !== 'All')"
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

                              <div class="regular-buttons">
                                <v-btn type="submit" color="success">Save Changes</v-btn>
                                <v-btn @click="cancelEdit" class="ml-2">Cancel</v-btn>
                              </div>
                            </v-form>

                            <template v-else>
                              <div class="student-info mb-4">
                                <p><strong>Course:</strong> {{ selectedStudent.course }}</p>
                                <p><strong>Year Level:</strong> {{ selectedStudent.year }}</p>
                                <p><strong>Status:</strong> 
                                  <v-chip small :color="getStatusColor(selectedStudent.status)">{{ selectedStudent.status }}</v-chip>
                                </p>
                              </div>

                              <div v-if="isStudentLocked(selectedStudent)" class="locked-notice mb-4">
                                <v-alert type="info" dense>
                                  This student record is locked and cannot be modified.
                                </v-alert>
                              </div>


                              <!-- Fine Side Card -->

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
                                        :disabled="isStudentLocked(selectedStudent)"
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
                                      {{ item.semester }}
                                    </td>
                                    <td class="col-fine">
                                      <v-edit-dialog
                                        v-model="item.fine"
                                        @save="updateFineDetail"
                                        large
                                        :disabled="isStudentLocked(selectedStudent)"
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
                                        :disabled="isStudentLocked(selectedStudent)"
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
                                :disabled="fineDetails.length === 0 || isStudentLocked(selectedStudent)"
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

          <!-- Confirmation Dialog -->
          <v-dialog v-model="confirmDialog" max-width="400">
            <v-card class="confirm-dialog">
              <v-card-title class="headline">Warning!</v-card-title>
              <v-card-text>
                Changing status to <strong>{{ editForm.status }}</strong> will permanently lock this student record.
                Are you sure you want to proceed?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" @click="confirmDialog = false">Cancel</v-btn>
                <v-btn  color="red darken-1" @click="confirmAndSave">Yes, Save and Lock</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

            <!-- Upload Dialog -->
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
  <v-btn color="error" @click="clearStudentTable">Clear Table</v-btn>
  <v-btn color="primary" @click="uploadStudents">Upload</v-btn>
  <v-btn text @click="uploadDialog = false">Cancel</v-btn>
</v-card-actions>
              
            </v-card>
          </v-dialog>

           <!-- Fingerprint Dialog -->

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
                    :disabled="isStudentLocked(fingerprintStudent)"
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
          
          <!-- Confirm and Save Dialog -->

          <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirm Update</v-card-title>
             <v-card-text>{{ confirmDialogMessage }}</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="confirmDialog = false">Cancel</v-btn>
                <v-btn color="primary" text @click="executeConfirmCallback">Yes, Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>



        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import PageHeader from '@/components/CustomHeaderNav.vue';
import Auth from '../services/AuthServices'
import { format } from 'date-fns';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      
      //Side Bar
      sidebarButtons: [
        { 
          text: 'Dashboard', 
          route: 'Home', 
          icon: 'mdi-view-dashboard' 
        },
        { 
          text: 'Manage Student', 
          route: 'manage-students', 
          icon: 'mdi-account-group' 
        },
        { 
          text: 'Manage Event', 
          route: 'manage-events', 
          icon: 'mdi-calendar-multiple' 
        },
        { 
          text: 'History Log', 
          route: 'history-log', 
          icon: 'mdi-history' 
        }

      ],

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
      
      //UI elements
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      page: 1,
      pageCount: 3,
      
      //UI Parts
      
      search: '',
      filter: {
        course: null,
        yearLevel: null
      },

      //Ui States
      isNewStudent: false,
      selectedStudent: null,
      isEditing: false,
      students: [],
      editForm: {
        firstName: '',
        lastName: '',
        middleInitial: '',
        course: '',
        yearLevel: ''
      },
        
       RegForm: {
        firstName: '',
        lastName: '',
        middleInitial: '',
        course: '',
        yearLevel: ''
      },
      
      //Dialogs
      uploadDialog: false,
      uploadFile: null,
      uploadHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'First Name', value: 'firstName' },
        { text: 'Last Name', value: 'lastName' },
        { text: 'Course', value: 'department' },
        { text: 'Year Level', value: 'yearLevel' }
      ],

      //Confirm
      confirmDialog: false,
      confirmDialogMessage: '',
      confirmDialogCallback: null,

      
      // for response dialog
      responseDialog: false,
      responseType: '',
      responseTitle: '',
      responseMessage: '',
      responseIcon: '',
  
      

      //Dialogs - Fingerprint
      fingerprintDialog: false,
      fingerprintStudent: {},
      fingerprintLoading: false,
      fingerprintMessage: 'Ready to enroll fingerprint',
      fingerprintProgress: 0,

      //other dialogs
      statusOptions: ['Enrolled', 'Graduated', 'Shifted', 'Dropped'],
      fineDetails: [],
      courses: ['All', 'BSIT', 'BSIS', 'BSCS'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      semesters: ['1st Semester', '2nd Semester'],

      //Student Header
      studentFinesHeaders: [
        { text: 'First Name', value: 'firstName', align: 'center', width: '15%' },
        { text: 'M.I.', value: 'middleInitial', align: 'center', width: '5%' },
        { text: 'Last Name', value: 'lastName', align: 'center', width: '15%' },
        { text: 'Course', value: 'department', align: 'center', width: '15%' },
        { text: 'Year Level', value: 'yearLevel', align: 'center', width: '15%' },
        { text: 'Status', value: 'status', align: 'center', width: '15%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '20%', sortable: false }
      ],

      //fine Header
      fineDetailsHeaders: [
        { text: 'Event Name', value: 'event', width: '30%' },
        { text: 'Semester', value: 'semester', width: '20%' },
        { text: 'Fine Amount', value: 'fine', width: '15%' },
        { text: 'Date', value: 'date', width: '20%' },
        { text: 'Actions', value: 'actions', width: '15%' }
      ],
      
      
    };
  },
      //mount first
    async mounted() {
    await this.fetchStudents();

     //FingerPrint API CHECKER
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

  computed: {

    filteredStudentFines() {
      return this.students.filter((student) => {
        return (
          (this.filter.department === 'All' || !this.filter.department || student.department === this.filter.department) &&
          (this.filter.yearLevel === 'All' || !this.filter.yearLevel || student.year === this.filter.yearLevel) &&
          (this.search === '' || 
           student.fname.toLowerCase().includes(this.search.toLowerCase()) || 
           student.lname.toLowerCase().includes(this.search.toLowerCase()) ||
           student.course.toLowerCase().includes(this.search.toLowerCase()) ||
           student.year.toLowerCase().includes(this.search.toLowerCase()))
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
    async clearStudentTable() {
      if (!confirm('Are you sure you want to delete all students? This action is irreversible.')) return;

      try {
        await Auth.clearStudents();
        this.uploadPreview = []; // optional: reset local preview
        alert('All student records have been cleared.');
      } catch (err) {
        console.error('[CLEAR STUDENTS ERROR]', err);
        alert('Failed to clear student table.');
      }
    },

    navigateTo(route) {
      this.$router.push({ name: route });
    },

    getStatusColor(status) {
      const colors = {
        'Enrolled': 'green',
        'Shifted': 'blue',
        'Graduated': 'purple',
        'Dropped': 'red'
      };
      return colors[status] || 'gray';
    },

    isStudentLocked(student) {
      return student.isLocked || ['Graduated', 'Shifted', 'Dropped'].includes(student.status);
    },

    editStudent(student) {
      if (this.isStudentLocked(student)) return;
      this.isNewStudent = false;
      this.selectedStudent = student;
      this.isEditing = true;
      this.editForm = { ...student };
    },

     confirmAndSave() {
  this.confirmDialog = false;
  this.saveStudent(true); // pass `shouldLock = true`
  },
    executeConfirmCallback() {
  if (this.confirmDialogCallback) {
    this.confirmDialog = false;
    this.confirmDialogCallback();
   }
  },
     async saveStudent(shouldLock = false) {
  try {
    const studentId = this.selectedStudent.id;

    const payload = {
      firstName: this.editForm.firstName,
      lastName: this.editForm.lastName,
      middleInitial: this.editForm.middleInitial,
      department: this.editForm.department,
      yearLevel: this.editForm.yearLevel,
      status: this.editForm.status
    };

    const response = await Auth.updateStudents(studentId, payload);

    this.selectedStudent = response.data.student || response.data;
    this.isEditing = false;

    if (shouldLock) {
      this.selectedStudent.isLocked = true; // optional depending on your logic
    }

    this.showResponse(
      'success',
      'Student Updated',
      `${this.selectedStudent.firstName} ${this.selectedStudent.lastName}'s record has been updated.`
    );
    await this.fetchStudents();
    this.resetForm();

  } catch (error) {
    console.error('Update failed:', error);
    this.showResponse(
      'error',
      'Update Failed',
      error.response?.data?.message || 'An error occurred during the update.'
    );
  }


},
    hasChanges() {
    const fields = ['firstName', 'lastName', 'middleInitial', 'department', 'yearLevel', 'status'];
    return fields.some(field => this.editForm[field] !== this.selectedStudent[field]);
    },

     cancelEdit() {
      this.isEditing = false;
      this.editForm = {};
    },

    // UI - Toast / Modal response display
    showResponse(type, title, message) {
      this.responseType = type;
      this.responseTitle = title;
      this.responseMessage = message;
      this.responseIcon = type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle';
      this.responseDialog = true;
    },


    checkStatusBeforeSave() {
  if (!this.hasChanges()) {
    this.showResponse(
      'info',
      'No Changes Detected',
      'You haven’t made any changes to the student record.'
    );
    return;
  }

  if (['Graduated', 'Shifted', 'Dropped'].includes(this.editForm.status)) {
    this.confirmDialogMessage = `Changing the status to "${this.editForm.status}" will lock this student. Proceed?`;
    this.confirmDialogCallback = () => this.saveStudent(true);
  } else {
    this.confirmDialogMessage = 'Are you sure you want to save these changes?';
    this.confirmDialogCallback = () => this.saveStudent();
  }

  this.confirmDialog = true;
  },

   
    //Upload 
    openUploadDialog() {
      this.uploadDialog = true;
      this.uploadFile = null;
      this.uploadPreview = [];
    },

    //Upload Function
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

    //Fetch the uploaded Data
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
      this.selectedStudent = null;
      this.isEditing = false; 
      this.isNewStudent = true;
      this.RegForm = {
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
      this.RegForm = {
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

    async handleRegistration() {
  if (!this.fingerprintCaptured) {
    this.showResponse('error', 'Missing Fingerprint', 'Please complete fingerprint enrollment first.');
    return;
  }

  // Cleaned-up and correctly structured payload
  const studentPayload = {
    ...this.RegForm,
    middleInitial: this.RegForm.middleInitial?.trim().charAt(0).toUpperCase() || '',
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

    validateRegistrationForm() {
      return (
        this.RegForm.firstName.trim() &&
        this.RegForm.lastName.trim() &&
        this.RegForm.course &&
        this.RegForm.yearLevel
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


    //enrollment Sample

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

    
    openFingerprintDialog(student) {
      this.fingerprintStudent = { ...student };
      this.fingerprintDialog = true;
      this.fingerprintLoading = false;
      this.fingerprintMessage = 'Ready to enroll fingerprint';
      this.fingerprintProgress = 0;
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
    },

    clearFines() {
      this.fineDetails = [];
      if (this.$toast) {
        this.$toast.success(`${this.selectedStudent.fname} ${this.selectedStudent.lname}'s fines have been marked as paid!`);
      }
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
        this.isNewStudent = false;
      } else {
        this.selectedStudent = student;
        this.isEditing = false;
        this.isNewStudent = false;
        this.fineDetails = this.generateMockFineDetails();
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
      const details = [];
      
      for (let i = 0; i < 3; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
        const randomSemester = this.semesters[Math.floor(Math.random() * this.semesters.length)];
        
        details.push({
          event: randomEvent,
          fine: '₱' + (Math.random() * 500).toFixed(2),
          date: randomDate.toISOString(),
          semester: randomSemester
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
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');

/* Sidebar Styles */
.overlapping-sidebar {
  position: absolute;
  z-index: 100;
  height: 100vh;
}

.sidebar {
  background: #0d003d !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.sidebar-buttons {
  padding: 15px 10px;
  background: transparent !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.sidebar-button-wrapper {
  position: relative;
  margin: 15px 0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.08);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-button-wrapper:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.border-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.border-animation::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: borderLight 3s linear infinite;
  transform: rotate(45deg);
}

@keyframes borderLight {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.sidebar-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  position: relative;
  z-index: 1;
}

.sidebar-icon {
  color: white !important;
  margin-bottom: 8px;
}

.sidebar-text {
  font-size: 16px;
  font-weight: 500;
  color: white;
  text-align: center;
  line-height: 1.3;
}

/* Main Content Styles */
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
  .sidebar {
    width: 200px !important;
  }
  
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
  
  .sidebar-text {
    font-size: 14px;
  }
  
  .sidebar-button-wrapper {
    height: 70px;
  }
  
  .sidebar-icon {
    font-size: 24px !important;
  }
}
</style>