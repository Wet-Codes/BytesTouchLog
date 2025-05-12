<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <h1 class="table-title">Event Management</h1>
                <v-btn 
                  color="teal" 
                  dark
                  @click="openCreateDialog"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Create New Event
                </v-btn>
              </v-card-title>
              <v-card-text>
                <div class="filter-container">
                  <v-select
                    v-model="filter.semester"
                    :items="semesters"
                    label="Filter by Semester"
                    outlined
                    dense
                    dark
                    hide-details
                    style="max-width: 200px;"
                  ></v-select>
                </div>
                <div class="event-list-header">
                  <span class="col-name">Event Name</span>
                  <span class="col-semester">Semester</span>
                  <span class="col-fee">Fee Amount</span>
                  <span class="col-date">Date</span>
                  <span class="col-actions">Actions</span>
                </div>
                <v-data-table
                  :headers="tableHeaders"
                  :items="filteredEvents"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                  class="elevation-1 event-table"
                  dark
                  hide-default-header
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td class="col-name text-left">{{ item.name }}</td>
                      <td class="col-semester text-left">{{ item.semester }}</td>
                      <td class="col-fee text-left">₱{{ item.fee.toFixed(2) }}</td>
                      <td class="col-date text-left">{{ formatDate(item.date) }}</td>
                      <td class="col-actions text-center">
                        <div class="action-buttons">
                          <v-btn small color="teal" @click="openAttendanceDialog(item)">
                            <v-icon small left>mdi-fingerprint</v-icon>
                            Attendance
                          </v-btn>
                          <v-btn small color="primary" @click="initiateEdit(item)">
                            <v-icon small left>mdi-pencil</v-icon>
                            Edit
                          </v-btn>
                          <v-btn small color="error" @click="confirmDeletion(item)">
                            <v-icon small left>mdi-delete</v-icon>
                            Remove
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Create Event Dialog -->
      <v-dialog v-model="createDialog" max-width="600" persistent>
        <v-card class="fine-card">
          <v-card-title>Create New Event</v-card-title>
          <v-card-text>
            <v-form ref="creationForm" @submit.prevent="submitNewEvent">
              <v-text-field 
                v-model="newEvent.name" 
                label="Event Name"
                outlined
                dark
                :rules="[v => !!v || 'Event name is required']"
                required
              ></v-text-field>
              <v-select
                v-model="newEvent.semester"
                :items="semesters.filter(s => s !== 'All')"
                label="Semester"
                outlined
                dense
                dark
                hide-details
                :rules="[v => !!v || 'Semester is required']"
                required
              ></v-select>
              <v-text-field 
                v-model="newEvent.fee" 
                label="Fee Amount" 
                type="number" 
                prefix="₱"
                outlined
                dark
                :rules="[
                  v => !!v || 'Fee is required',
                  v => v >= 0 || 'Fee must be positive'
                ]"
                required
              ></v-text-field>
              <v-text-field 
                v-model="newEvent.date" 
                label="Date" 
                type="date"
                outlined
                dark
                :rules="[v => !!v || 'Date is required']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="closeCreateDialog">Cancel</v-btn>
            <v-btn color="teal" dark @click="submitNewEvent">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Edit Event Dialog -->
      <v-dialog v-model="editDialog" max-width="600" persistent>
        <v-card class="fine-card">
          <v-card-title>Edit Event</v-card-title>
          <v-card-text>
            <v-form ref="editForm" @submit.prevent="updateEvent">
              <v-text-field 
                v-model="editingEvent.name" 
                label="Event Name"
                outlined
                dark
                :rules="[v => !!v || 'Event name is required']"
                required
              ></v-text-field>
              <v-select
                v-model="editingEvent.semester"
                :items="semesters.filter(s => s !== 'All')"
                label="Semester"
                outlined
                dense
                dark
                hide-details
                :rules="[v => !!v || 'Semester is required']"
                required
              ></v-select>
              <v-text-field 
                v-model="editingEvent.fee" 
                label="Fee Amount" 
                type="number" 
                prefix="₱"
                outlined
                dark
                :rules="[
                  v => !!v || 'Fee is required',
                  v => v >= 0 || 'Fee must be positive'
                ]"
                required
              ></v-text-field>
              <v-text-field 
                v-model="editingEvent.date" 
                label="Date" 
                type="date"
                outlined
                dark
                :rules="[v => !!v || 'Date is required']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
            <v-btn color="teal" dark @click="updateEvent">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Attendance Dialog -->
      <v-dialog v-model="attendanceDialog" max-width="500" persistent>
        <v-card class="fingerprint-dialog">
          <v-card-title class="headline text-center">
            Biometric Attendance - {{ currentEvent.name }}
          </v-card-title>
          <v-card-text class="text-center">
            <div class="fingerprint-sensor">
              <p class="instruction">{{ instructionText }}</p>
              <div class="fingerprint-image-container" @click="startScan">
                <v-icon 
                  x-large
                  class="fingerprint-icon"
                  :class="{ 'scanning': isScanning }"
                >
                  {{ isScanning ? 'mdi-fingerprint-off' : 'mdi-fingerprint' }}
                </v-icon>
                <div class="fingerprint-animation" v-if="isScanning">
                  <div class="scan-line"></div>
                </div>
              </div>
              
              <v-progress-linear
                v-if="isScanning"
                indeterminate
                color="#FFA000"
                height="5"
                class="progress-bar"
              ></v-progress-linear>
              
              <div v-if="scanResult" class="scan-result">
                <v-icon large :color="scanResult.success ? 'green' : 'red'">
                  {{ scanResult.success ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                </v-icon>
                <p>{{ scanResult.message }}</p>
                <v-btn 
                  v-if="!scanResult.success"
                  color="orange" 
                  small
                  @click="startScan"
                  class="retry-btn"
                >
                  Try Again
                </v-btn>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="secondary" 
              @click="closeAttendanceDialog"
            >
              Close
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
      createDialog: false,
      editDialog: false,
      attendanceDialog: false,
      filter: {
        semester: 'All'
      },
      semesters: ['All', '1st Semester', '2nd Semester'],
      newEvent: {
        name: '',
        semester: '1st Semester',
        fee: 0,
        date: ''
      },
      editingEvent: {
        id: null,
        name: '',
        semester: '',
        fee: 0,
        date: ''
      },
      currentEvent: {
        id: null,
        name: ''
      },
      // Attendance scanner data
      isScanning: false,
      scanResult: null,
      instructionText: "Place your finger on the sensor to scan",
      // Sample events data with semester
      events: [
        { id: 1, name: 'Orientation', semester: '1st Semester', fee: 100.00, date: '2023-06-15' },
        { id: 2, name: 'Seminar', semester: '2nd Semester', fee: 150.00, date: '2023-07-20' }
      ],
      tableHeaders: [
        { text: 'Event Name', value: 'name' },
        { text: 'Semester', value: 'semester' },
        { text: 'Fee Amount', value: 'fee' },
        { text: 'Date', value: 'date' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
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
    filteredEvents() {
      return this.events.filter(event => 
        this.filter.semester === 'All' || event.semester === this.filter.semester
      );
    }
  },
  methods: {
    formatDate(dateString) {
      return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : 'N/A';
    },
    openCreateDialog() {
      this.createDialog = true;
    },
    closeCreateDialog() {
      this.createDialog = false;
      this.$refs.creationForm?.reset();
      this.newEvent = { 
        name: '', 
        semester: '1st Semester',
        fee: 0, 
        date: '' 
      };
    },
    async submitNewEvent() {
      if (!this.$refs.creationForm.validate()) return;
      
      const newId = this.events.length > 0 
        ? Math.max(...this.events.map(e => e.id)) + 1 
        : 1;
      
      this.events.push({
        id: newId,
        name: this.newEvent.name,
        semester: this.newEvent.semester,
        fee: parseFloat(this.newEvent.fee),
        date: this.newEvent.date
      });
      
      this.closeCreateDialog();
    },
    initiateEdit(item) {
      this.editingEvent = { ...item };
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
      this.$refs.editForm?.reset();
      this.editingEvent = { 
        id: null, 
        name: '', 
        semester: '',
        fee: 0, 
        date: '' 
      };
    },
    async updateEvent() {
      if (!this.$refs.editForm.validate()) return;
      
      const index = this.events.findIndex(e => e.id === this.editingEvent.id);
      if (index !== -1) {
        this.events.splice(index, 1, { 
          ...this.editingEvent,
          fee: parseFloat(this.editingEvent.fee)
        });
      }
      this.closeEditDialog();
    },
    confirmDeletion(item) {
      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        this.events = this.events.filter(e => e.id !== item.id);
      }
    },
    // Attendance methods
    openAttendanceDialog(item) {
      this.currentEvent = {
        id: item.id,
        name: item.name
      };
      this.attendanceDialog = true;
      this.resetScanner();
    },
    closeAttendanceDialog() {
      this.attendanceDialog = false;
      this.resetScanner();
    },
    resetScanner() {
      this.isScanning = false;
      this.scanResult = null;
      this.instructionText = "Place your finger on the sensor to scan";
    },
    startScan() {
      if (this.isScanning) return;
      
      this.isScanning = true;
      this.scanResult = null;
      this.instructionText = "Scanning in progress...";
      
      // Simulate fingerprint scan process
      setTimeout(() => {
        this.isScanning = false;
        // Randomly determine if scan was successful (80% success rate)
        const isSuccess = Math.random() > 0.2;
        
        this.scanResult = {
          success: isSuccess,
          message: isSuccess 
            ? 'Attendance recorded successfully!' 
            : 'Scan failed. Fingerprint not recognized.'
        };
        
        this.instructionText = isSuccess 
          ? "Scan completed successfully" 
          : "Scan failed. Please try again.";
        
        // Clear result after 3 seconds if successful
        if (isSuccess) {
          setTimeout(() => {
            this.scanResult = null;
            this.instructionText = "Place your finger on the sensor to scan";
          }, 3000);
        }
      }, 2000);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');

.fine-card {
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  color: white;
}

.table-title {
  color: white;
  font-size: 2rem;
  margin: 0;
}

.filter-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

/* Event List Header */
.event-list-header {
  display: flex;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  border-radius: 4px 4px 0 0;
}

.event-list-header span {
  padding: 0 8px;
}

.event-list-header .col-name {
  width: 25%;
  text-align: left;
}

.event-list-header .col-semester {
  width: 15%;
  text-align: left;
}

.event-list-header .col-fee {
  width: 15%;
  text-align: left;
}

.event-list-header .col-date {
  width: 15%;
  text-align: left;
}

.event-list-header .col-actions {
  width: 30%;
  text-align: center;
}

/* Event Table Styling */
.event-table {
  background-color: rgba(0, 0, 0, 0.3) !important;
  color: white !important;
  border-radius: 0 0 4px 4px;
}

.event-table tr {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.event-table tr:hover {
  background-color: rgba(40, 155, 184, 0.2) !important;
}

.event-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 12px 8px !important;
  vertical-align: middle !important;
}

.event-table .col-name {
  width: 25%;
  text-align: left;
  padding-left: 16px !important;
}

.event-table .col-semester {
  width: 15%;
  text-align: left;
}

.event-table .col-fee {
  width: 15%;
  text-align: left;
}

.event-table .col-date {
  width: 15%;
  text-align: left;
}

.event-table .col-actions {
  width: 30%;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
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

.v-card .v-btn.primary {
  background: #1976D2 !important;
  color: white !important;
}

.v-card .v-btn.error {
  background: #D32F2F !important;
  color: white !important;
}

.v-card .v-btn.teal {
  background: #009688 !important;
  color: white !important;
}

.v-card .v-btn.secondary {
  background: #616161 !important;
  color: white !important;
}

.v-card .v-btn .v-icon {
  margin-right: 6px;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
}

/* Ensure white text in dialogs */
.v-card__title, .v-card__text, .v-text-field input, .v-text-field label {
  color: white !important;
}

.v-text-field input::placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}

/* Ensure table text is white */
.v-data-table tr td {
  color: white !important;
}

.event-table >>> .v-data-footer {
  display: none;
}

/* Fingerprint scanner styles */
.fingerprint-dialog {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
}

.fingerprint-sensor {
  padding: 30px;
  margin-top: 20px;
}

.instruction {
  color: #fff;
  font-size: 18px;
  margin-bottom: 30px;
  font-family: 'Poppins', sans-serif;
  min-height: 27px;
}

.fingerprint-image-container {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 180px;
  height: 180px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.fingerprint-image-container:hover {
  background: rgba(255, 255, 255, 0.15);
}

.fingerprint-icon {
  font-size: 80px;
  color: #FFA000;
  z-index: 1;
  transition: all 0.3s ease;
}

.fingerprint-icon.scanning {
  color: #FFC107;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

.fingerprint-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 3px;
  background: rgba(255, 160, 0, 0.7);
  animation: scan 1.5s linear infinite;
  box-shadow: 0 0 10px rgba(255, 160, 0, 0.8);
}

@keyframes scan {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.progress-bar {
  margin-top: 20px;
  border-radius: 5px;
}

.scan-result {
  margin-top: 20px;
  color: white;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

.scan-result p {
  margin: 10px 0;
}

.retry-btn {
  margin-top: 10px;
}
</style>