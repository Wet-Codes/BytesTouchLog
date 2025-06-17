<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center flex-wrap">
                <h1 class="table-title">ATTENDANCE MANAGEMENT</h1>
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
                    dark
                    :placeholder="'No Reader'"
                    class="reader-select"
                    style="min-width: 220px;"
                  />
                
                  <!-- ADD FINGERPRINT BUTTON HERE -->
                  <v-btn 
                    @click="startFingerprintIdentification" 
                    color="primary" 
                    class="mb-4"
                    :disabled="!selectedEvent"
                  >
                    <v-icon left>mdi-fingerprint</v-icon>
                    Identify via Fingerprint
                  </v-btn>
                </div>
              </v-card-title>

               <!-- ADD FINGERPRINT DIALOG -->
              <v-dialog v-model="fingerprintDialog" max-width="600" persistent>
  <v-card class="fingerprint-dialog">
    <v-card-title class="headline">Fingerprint Identification</v-card-title>
    <v-card-text>
      <div v-if="fingerprintStatusMessage" class="status-message">
        {{ fingerprintStatusMessage }}
      </div>

      <div class="fingerprint-animation">
        <div class="fingerprint-icon" :class="{ scanning: isScanning }">
          <i class="fas fa-fingerprint"></i>
        </div>
        <div class="loading-dots" v-if="isScanning">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div v-if="identificationResult" class="result-display">
        <div v-if="identificationResult.success" class="success-result">
          <h3><i class="fas fa-check-circle"></i> Student Attended</h3>
         
        </div>
        <div v-else class="error-result">
          <h3><i class="fas fa-times-circle"></i>Failed, Try Again</h3>
          <p>{{ identificationResult.message || "No matching fingerprint found." }}</p>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="closeFingerprintDialog">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

                <!-- Student Table -->
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-card class="student-list-card">
                      <v-card-text>
                        <v-row class="mb-1" align="center">
                          <v-col cols="12" class="d-flex">
                            <v-col cols="4">
                              <v-select
                                v-model="selectedEvent"
                                :items="events"
                                label="Select Event"
                                outlined
                                dense
                                dark
                                return-object
                                :item-title="event => event.name + ' (' + formatDate(event.date) + ')'"
                              ></v-select>
                            </v-col>
                            <v-col cols="4">
                              <v-select
                                v-model="filter.course"
                                :items="courses"
                                label="Select Course"
                                outlined
                                dense
                                dark
                              />
                            </v-col>
                            <v-col cols="4">
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
                          <span class="col-actions">Attendance</span>
                        </div>
                        <v-data-table
                          :headers="studentHeaders"
                          :items="filteredStudents"
                          :items-per-page="itemsPerPage"
                          :v-model="page"
                          
                          class="elevation-1 student-table"
                          dark
                          hide-default-header
                        >
                          <template v-slot:item="{ item }">
                            <tr :class="getAttendanceClass(item)">
                              <td class="col-fname text-center">{{ item.firstName }}</td>
                              <td class="col-mi text-center">{{ item.middleInitial }}</td>
                              <td class="col-lname text-center">{{ item.lastName }}</td>
                              <td class="col-course text-center">{{ item.department }}</td>
                              <td class="col-actions text-center">
                                <div v-if="!attendanceRecords[item.id]" class="action-buttons">
                                  <v-btn 
                                    small 
                                    color="success" 
                                    @click="markPresent(item)"
                                    class="action-btn"
                                    :disabled="!selectedEvent"
                                  >
                                    <v-icon small left>mdi-check</v-icon>
                                    Present
                                  </v-btn>
                                  <v-btn 
                                    small 
                                    color="error" 
                                    @click="markAbsent(item)"
                                    class="action-btn"
                                    :disabled="!selectedEvent"
                                  >
                                    <v-icon small left>mdi-close</v-icon>
                                    Absent
                                  </v-btn>
                                </div>
                                <div v-else>
                                  <v-icon :color="attendanceRecords[item.id] === 'present' ? 'green' : 'red'">
                                    {{ attendanceRecords[item.id] === 'present' ? 'mdi-check' : 'mdi-close' }}
                                  </v-icon>
                                  <div class="mt-1">
                                    {{ attendanceRecords[item.id] === 'present' ? 'Present' : 'Absent' }}
                                  </div>
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
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="eventDialog" max-width="600">
        <v-card class="event-dialog">
          <v-card-title class="headline">Add New Event</v-card-title>
          <v-card-text>
            <v-form ref="eventForm">
              <v-text-field
                v-model="newEvent.name"
                label="Event Name"
                outlined
                dense
                class="mb-2"
                :rules="[v => !!v || 'Event name is required']"
              ></v-text-field>
              
              <v-select
                v-model="newEvent.semester"
                :items="semesters"
                label="Semester"
                outlined
                dense
                class="mb-2"
                :rules="[v => !!v || 'Semester is required']"
              ></v-select>
              
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ props: activatorProps }">
                  <v-text-field
                    v-model="newEvent.date"
                    label="Event Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="activatorProps"
                    :rules="[v => !!v || 'Date is required']"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="newEvent.date"
                  no-title
                  @input="dateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveEvent">Save</v-btn>
            <v-btn text @click="eventDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>



   <!-- Add error dialog -->
  <v-dialog v-model="errorDialog" max-width="500">
    <v-card class="error-dialog">
      <v-card-title class="headline">Error</v-card-title>
      <v-card-text>
        <div class="error-message">{{ errorMessage }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="errorDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>



</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';
import apiService from '@/services/AuthServices';

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

      // ADD FINGERPRINT DATA
      readers: [],
      fingerprintDialog: false,
      isScanning: false,
      fingerprintStatusMessage: "",
      identificationResult: null,
      reader: null,
      selectedReader: null,

       errorDialog: false,
      errorMessage: '',
      eventDialog: false,
      dateMenu: false,
      selectedEvent: null,
      events: [],
      semesters: ['1st Semester', '2nd Semester', 'Summer'],
      newEvent: {
        name: '',
        semester: null,
        date: null
      },
      courses: ['All', 'BSIT', 'BSIS', 'BSCS', 
               'BS Information Technology (Network Systems)', 
               'BS Information Technology (Database Systems)'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      studentHeaders: [
        { text: 'First Name', value: 'firstName', align: 'center', width: '20%' },
        { text: 'M.I.', value: 'mi', align: 'center', width: '5%' },
        { text: 'Last Name', value: 'lastName', align: 'center', width: '20%' },
        { text: 'Course', value: 'course', align: 'center', width: '20%' },
        { text: 'Attendance', value: 'actions', align: 'center', width: '35%', sortable: false }
      ],
      students: [],
      attendanceRecords: {},
      // Pagination properties
      page: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px 0'
      };
    },
    filteredStudents() {
      return this.students.filter((student) => {
        return (
          (this.filter.department === 'All' || !this.filter.department || student.department === this.filter.department) &&
          (this.filter.yearLevel === 'All' || !this.filter.yearLevel || student.yearLevel === this.filter.yearLevel)
        );
      });
    },
    // Calculate page count for pagination
    pageCount() {
      return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    }
  },
  watch: {
    selectedEvent(newEvent) {
      if (newEvent) {
        this.fetchAttendanceForEvent(newEvent.eventId);
      }
    }
  },
  async mounted() {
    try {
      if (!window.Fingerprint?.WebApi) throw new Error("Fingerprint SDK not available");
      console.log("✅ SDK available");

      this.reader = new window.Fingerprint.WebApi();

      // Bind SDK events
      this.reader.onDeviceConnected = () => {
        this.statusMessage = "Device connected. Ready to scan.";
      };
      this.reader.onDeviceDisconnected = () => {
        this.statusMessage = "Device disconnected.";
        this.isScanning = false;
      };
      this.reader.onCommunicationFailed = () => {
        this.statusMessage = "Communication with reader failed.";
        this.isScanning = false;
      };
      this.reader.onSamplesAcquired = this.handleEnrollmentSample;

      // Load devices
      const devices = await this.reader.enumerateDevices();
      this.readers = devices;
      this.statusMessage = devices.length ? "Select a reader" : "No fingerprint readers found";
      console.log("📡 Available readers:", devices);
    } catch (err) {
      console.error("❌ SDK init error:", err);
      this.statusMessage = `SDK error: ${err.message}`;
      this.showLiteClientLink = true;
    }

    await this.fetchEvents();
    await this.fetchStudents();
  },
  methods: {
    getAttendanceClass(student) {
      const status = this.attendanceRecords[student.id];
      if (status === 'present') return 'present-row';
      if (status === 'absent') return 'absent-row';
      return '';
    },
    openEventDialog() {
      this.newEvent = {
        name: '',
        semester: null,
        date: null
      };
      this.eventDialog = true;
      if (this.$refs.eventForm) {
        this.$refs.eventForm.resetValidation();
      }
    },
    
    async fetchStudents() {
      try {
        const response = await apiService.getStudents();
        this.students = response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
        alert('Failed to load students: ' + (error.response?.data?.message || error.message));
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    async fetchEvents() {
      try {
        const response = await apiService.getEvents();
        this.events = response.data.map(event => ({
          ...event,
          _id: event.eventId,
          name: event.name,
          date: event.date,
          semester: event.semester
        }));
      } catch (error) {
        console.error('Error fetching events:', error);
        alert('Failed to load events: ' + (error.response?.data?.message || error.message));
      }
    },
    async fetchAttendanceForEvent(eventId) {
      try {
        if (!eventId) return;
        const response = await apiService.getAttendanceForEvent(eventId);
        this.attendanceRecords = response.data;
      } catch (error) {
        this.showError('Failed to load attendance records', error);
      }
    },
    
    

    showError(message, error = null) {
      this.errorMessage = message;
      if (error) {
        this.errorMessage += `: ${error.response?.data?.error || error.message}`;
      }
      this.errorDialog = true;
    },
    
    async saveEvent() {
      if (this.$refs.eventForm.validate()) {
        try {
          const payload = {
            name: this.newEvent.name,
            semester: this.newEvent.semester,
            date: this.newEvent.date
          };
          
          const response = await apiService.createEvent(payload);
          const newEvent = {
            ...response.data,
            _id: response.data.eventId,
            name: response.data.name,
            date: response.data.date,
            semester: response.data.semester
          };
          
          this.events.push(newEvent);
          alert('Event created successfully');
          this.eventDialog = false;
        } catch (error) {
          console.error('Error creating event:', error);
          alert('Failed to create event: ' + (error.response?.data?.error || error.message));
        }
      }
    },
    async markPresent(student) {
      if (!this.selectedEvent) {
        alert('Please select an event first');
        return;
      }
      try {
        await this.updateAttendance(student, 'present');
      } catch (error) {
        console.error('Error marking present:', error);
        alert('Failed to mark student as present: ' + (error.message || 'Unknown error'));
      }
    },
    async markAbsent(student) {
      if (!this.selectedEvent) {
        alert('Please select an event first');
        return;
      }
      try {
        await this.updateAttendance(student, 'absent');
      } catch (error) {
        console.error('Error marking absent:', error);
        alert('Failed to mark student as absent: ' + (error.message || 'Unknown error'));
      }
    },
    async updateAttendance(student, status) {
  if (!this.selectedEvent) {
    this.showError('Please select an event first');
    return;
  }
  
  try {
    await apiService.updateAttendance({
      studentId: student.id,
      eventId: this.selectedEvent.eventId,
      status
    });

    // This works fine in Vue 3
    this.attendanceRecords[student.id] = status;

  } catch (error) {
    this.showError('Failed to update attendance', error);
  }
},



  async startFingerprintIdentification() {
      if (!this.selectedEvent) {
        this.showError('Please select an event first');
        return;
      }
      
      this.fingerprintDialog = true;
      this.fingerprintStatusMessage = "Initializing fingerprint scanner...";
      this.identificationResult = null;
      
      try {
        // Initialize fingerprint SDK
        if (!window.Fingerprint?.WebApi) throw new Error("Fingerprint SDK not available");
        
        this.reader = new window.Fingerprint.WebApi();
        
        // Get available readers
        const devices = await this.reader.enumerateDevices();
        if (devices.length === 0) {
          throw new Error("No fingerprint readers found");
        }
        
        // Use the first available reader
        this.selectedReader = devices[0];
        this.fingerprintStatusMessage = "Ready to scan. Place your finger on the scanner";
        
        // Start acquisition
        this.isScanning = true;
        await this.reader.startAcquisition(
          window.Fingerprint.SampleFormat.Intermediate, 
          this.selectedReader
        );
        
        // Handle samples
        this.reader.onSamplesAcquired = this.handleFingerprintSample;
      } catch (err) {
        console.error("Fingerprint error:", err);
        this.fingerprintStatusMessage = `Error: ${err.message}`;
        this.isScanning = false;
      }
    },
    
    async handleFingerprintSample(event) {
  try {
    this.isScanning = false;
    this.fingerprintStatusMessage = "Processing fingerprint...";

    const raw = JSON.parse(event.samples);
    const base64Sample = raw[0].Data;

    // Send to backend for identification
    const response = await apiService.identifyFingerprint2({ fmd: base64Sample });

    if (response.data.success) {
      const student = this.students.find(s => s.id === response.data.student.id);

      if (student) {
        await this.markPresent(student);

        this.identificationResult = {
          success: true,
          name: `${student.firstName} ${student.lastName}`
        };
        this.fingerprintStatusMessage = `✅ ${this.identificationResult.name} marked present!`;
      } else {
        this.identificationResult = {
          success: false,
          error: "Student not found in the list"
        };
        this.fingerprintStatusMessage = "❌ Student not found in the list";
      }

      // Restart scanning after a short delay
      setTimeout(() => {
        this.identificationResult = null;
        this.fingerprintStatusMessage = "Place your finger on the scanner";
        this.isScanning = true;
      }, 2000);
    } else {
      this.identificationResult = {
        success: false,
        error: response.data.message || "Identification failed"
      };
      this.fingerprintStatusMessage = "❌ Identification failed. Please try again.";

      setTimeout(() => {
        this.identificationResult = null;
        this.fingerprintStatusMessage = "Place your finger on the scanner";
        this.isScanning = true;
      }, 2000);
    }
  } catch (err) {
    console.error("Identification error:", err);
    this.fingerprintStatusMessage = `Error: ${err.message}`;
    this.isScanning = false;
  }
}

,
    
    closeFingerprintDialog() {
      this.fingerprintDialog = false;
      this.isScanning = false;
      this.identificationResult = null;
      
      // Stop acquisition if active
      if (this.reader && this.reader.isAcquisitionStarted) {
        this.reader.stopAcquisition();
      }
    },
  

  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');
/* ADD FINGERPRINT STYLES */
.fingerprint-dialog {
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  color: #fff;
  padding: 20px;
}

.fingerprint-animation {
  text-align: center;
  margin: 30px 0;
}

.fingerprint-icon {
  font-size: 5rem;
  color: #4fc3f7;
  transition: all 0.3s ease;
}

.fingerprint-icon.scanning {
  color: #28a745;
  animation: pulse 1.5s infinite;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

.loading-dots span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4fc3f7;
  animation: bounce 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

.status-message {
  text-align: center;
  font-weight: 500;
  color: #fff;
  font-size: 1.2rem;
  margin: 20px 0;
}

.result-display {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.success-result {
  color: #a5d6a7;
}

.error-result {
  color: #ffab91;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
.error-dialog {
  background: rgba(30, 30, 30, 0.9) !important;
  backdrop-filter: blur(10px);
  border-radius: 16px;
  color: #fff;
}

.error-message {
  padding: 15px;
  background: rgba(200, 50, 50, 0.2);
  border-radius: 8px;
  font-size: 1.1rem;
}


::v-deep .v-dialog {
  background: transparent !important;
  box-shadow: none !important;
}


.fine-card {
  background: rgba(33, 33, 33, 0.65); /* dark glass effect */
  backdrop-filter: blur(8px);
  border-radius: 16px;
  color: #fff;
}

.student-list-card {
  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 16px;
  color: #fff;
}

.student-list-header {
  display: flex;
  justify-content: space-between;
  background: rgba(40, 40, 40, 0.75);
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

.student-list-header span {
  flex: 1;
  text-align: center;
}

.col-fname, .col-mi, .col-lname, .col-course, .col-year, .col-actions {
  text-align: center;
  justify-content: center;
  color: #e0e0e0;
  padding: 12px;
}

/* Row highlight based on attendance */
.present-row {
  background-color: rgba(56, 142, 60, 0.2); /* green tint */
}

.absent-row {
  background-color: rgba(211, 47, 47, 0.2); /* red tint */
}

.v-data-table {
  background-color: transparent !important;
  color: #fff;
}

.v-pagination {
  margin-top: 8px;
}

/* Style for dialog */
.event-dialog {
  background: rgba(30, 30, 30, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  color: #fff;
}

.v-text-field input,
.v-select input {
  color: #fff !important;
}

.v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.v-select__selections {
  color: #fff !important;
}

.theme--dark.v-input input,
.theme--dark.v-select input {
  border-color: rgba(255, 255, 255, 0.3);
}
@media (max-width: 960px) {
  .student-list-header,
  .student-table >>> tbody tr {
    grid-template-columns: 25% 5% 25% 20% 25%;
  }
  
  .action-btn {
    min-width: 70px;
    font-size: 0.7rem;
  }
}
</style>