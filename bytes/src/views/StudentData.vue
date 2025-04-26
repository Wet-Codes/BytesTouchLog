<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <span class="page-title">DASHBOARD</span>
                <v-btn color="error" class="mt-2" @click="goBack">
                  Back
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-row class="mb-4" align="center">
                  <!-- Left Side - Filters -->
                  <v-col cols="6" class="d-flex">
                    <v-col v-if="!showGraph && !showAddStudent && !selectedStudent" cols="6">
                      <v-select
                        v-model="filter.course"
                        :items="courses"
                        label="Select Course"
                        outlined
                        dense
                        dark
                      />
                    </v-col>
                    <v-col v-if="!showGraph && !showAddStudent && !selectedStudent" cols="6">
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

                  <!-- Right Side - Action Buttons -->
                  <v-col cols="6" class="d-flex justify-end">
                    <v-btn 
                      v-if="!showAddStudent && !showGraph && !selectedStudent" 
                      @click="showUploadStudentForm" 
                      class="mr-2"
                      color="primary"
                    >
                      Upload Student
                    </v-btn>
                    <v-btn 
                      @click="toggleGraph"
                      :disabled="!!selectedStudent"
                      color="teal"
                      dark
                    >
                      {{ showGraph ? 'Hide Attendance Graph' : 'Attendance Graph' }}
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Main Content Area -->
                <v-row>
                  <!-- Student Fines Table (Left Side) -->
                  <v-col :cols="showGraph || selectedStudent || showAddStudent ? 6 : 12">
                    <div class="student-list-header">
                      <span class="col-fname">First Name</span>
                      <span class="col-lname">Last Name</span>
                      <span class="col-mi">M.I.</span>
                      <span class="col-course">Course</span>
                      <span class="col-year">Year Level</span>
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
                          <td class="col-fname text-left">{{ item.fname }}</td>
                          <td class="col-lname text-left">{{ item.lname }}</td>
                          <td class="col-mi text-center">{{ item.mi }}</td>
                          <td class="col-course text-left">{{ item.course }}</td>
                          <td class="col-year text-left">{{ item.year }}</td>
                          <td class="col-actions text-center">
                            <div class="action-buttons">
                              <v-btn small color="primary" @click="viewFine(item)">
                                {{ selectedStudent && selectedStudent.id === item.id ? 'Hide Details' : 'View Fine' }}
                              </v-btn>
                              <v-btn small color="teal" dark @click="editStudent(item)">
                                Update
                              </v-btn>
                            </div>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-col>

                  <!-- Right Side Content -->
                  <v-col v-if="showGraph || selectedStudent || showAddStudent" cols="6">
                    <!-- Upload Student Form -->
                    <v-card v-if="showAddStudent && !editingStudent" class="right-side-card">
                      <v-card-title>Upload New Student</v-card-title>
                      <v-card-text>
                        <v-form @submit.prevent="addStudent">
                          <v-row>
                            <v-col cols="6">
                              <v-text-field
                                v-model="newStudent.fname"
                                label="First Name"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                v-model="newStudent.lname"
                                label="Last Name"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                v-model="newStudent.mi"
                                label="Middle Initial"
                                outlined
                                dark
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-select
                                v-model="newStudent.course"
                                :items="courses.filter(c => c !== 'All')"
                                label="Course"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-select
                                v-model="newStudent.year"
                                :items="yearLevels.filter(y => y !== 'All')"
                                label="Year Level"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-btn 
                                block 
                                color="primary" 
                                @click="showFingerprintDialog = true"
                              >
                                Enter Fingerprint
                              </v-btn>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <v-btn 
                                color="error" 
                                class="mr-2" 
                                @click="cancelAddStudent"
                              >
                                Cancel
                              </v-btn>
                              <v-btn 
                                color="success" 
                                type="submit"
                              >
                                Upload Student
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-card-text>
                    </v-card>

                    <!-- Update Student Form -->
                    <v-card v-if="showAddStudent && editingStudent" class="right-side-card">
                      <v-card-title>Update Student</v-card-title>
                      <v-card-text>
                        <v-form @submit.prevent="updateStudent">
                          <v-row>
                            <v-col cols="6">
                              <v-text-field
                                v-model="newStudent.fname"
                                label="First Name"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                v-model="newStudent.lname"
                                label="Last Name"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                v-model="newStudent.mi"
                                label="Middle Initial"
                                outlined
                                dark
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-select
                                v-model="newStudent.course"
                                :items="courses.filter(c => c !== 'All')"
                                label="Course"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-select
                                v-model="newStudent.year"
                                :items="yearLevels.filter(y => y !== 'All')"
                                label="Year Level"
                                outlined
                                dark
                                required
                              />
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <v-btn 
                                color="error" 
                                class="mr-2" 
                                @click="cancelAddStudent"
                              >
                                Cancel
                              </v-btn>
                              <v-btn 
                                color="success" 
                                type="submit"
                              >
                                Update
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-card-text>
                    </v-card>

                    <!-- Graph -->
                    <v-card v-if="showGraph" class="right-side-card">
                      <v-card-title>
                        <v-select
                          v-model="selectedEvent"
                          :items="attendanceEvents"
                          label="Select Event"
                          outlined
                          dense
                          dark
                          class="event-selector"
                        />
                      </v-card-title>
                      <v-card-text>
                        <BarChart :data="attendanceStats[selectedEvent]" />
                      </v-card-text>
                    </v-card>

                    <!-- Student Fine Details -->
                    <v-card v-if="selectedStudent" class="right-side-card">
                      <div class="details-header">
                        <v-card-title>
                          {{ selectedStudent.fname }} {{ selectedStudent.lname }}'s Fine Breakdown
                        </v-card-title>
                        <v-btn 
                          color="teal" 
                          dark
                          class="update-fine-btn"
                          @click="editFine(selectedStudent)"
                        >
                          Update Fine
                        </v-btn>
                      </div>
                      <v-card-text>
                        <div class="fine-details-header">
                          <span class="col-event">Event</span>
                          <span class="col-date">Date</span>
                          <span class="col-login">Log In</span>
                          <span class="col-logout">Log Out</span>
                          <span class="col-fine">Fine Amount</span>
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
                              <td class="col-event">{{ item.event }}</td>
                              <td class="col-date">{{ item.date }}</td>
                              <td class="col-login">{{ item.login }}</td>
                              <td class="col-logout">{{ item.logout }}</td>
                              <td class="col-fine">{{ item.fine }}</td>
                            </tr>
                          </template>
                        </v-data-table>
                        <div class="total-fines">
                          <strong>Total Fines: {{ calculateTotalFines() }}</strong>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Fingerprint Dialog -->
    <v-dialog v-model="showFingerprintDialog" max-width="500">
      <v-card class="fingerprint-dialog">
        <v-card-title>Fingerprint Registration</v-card-title>
        <v-card-text class="text-center">
          <div class="fingerprint-sensor">
            <v-icon x-large>mdi-fingerprint</v-icon>
            <p>Place your finger on the sensor</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showFingerprintDialog = false">Cancel</v-btn>
          <v-btn color="success" @click="simulateFingerprintScan">Complete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Fine Dialog -->
    <v-dialog v-model="showUpdateFineDialog" max-width="600">
      <v-card class="update-fine-dialog">
        <v-card-title>Update Fine Details</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveFineUpdates">
            <v-row>
              <v-col cols="12" v-for="(fine, index) in fineDetails" :key="index">
                <v-card class="mb-4">
                  <v-card-title>Event: {{ fine.event }}</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model="fine.date"
                          label="Date"
                          outlined
                          dense
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="fine.login"
                          label="Log In Time"
                          outlined
                          dense
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="fine.logout"
                          label="Log Out Time"
                          outlined
                          dense
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="fine.fine"
                          label="Fine Amount"
                          outlined
                          dense
                          prefix="₱"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn 
                  color="error" 
                  class="mr-2" 
                  @click="showUpdateFineDialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn 
                  color="teal" 
                  dark
                  type="submit"
                >
                  Save Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';
//import BarChart from '@/components/BarChart.vue';

export default {
  components: {
    PageHeader,
    
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      filter: {
        course: null,
        yearLevel: null,
      },
      selectedStudent: null,
      showGraph: false,
      showAddStudent: false,
      showFingerprintDialog: false,
      showUpdateFineDialog: false,
      editingStudent: false,
      selectedEvent: 'Today',
      newStudent: {
        id: null,
        fname: '',
        lname: '',
        mi: '',
        course: '',
        year: '',
        fingerprint: null
      },
      fineDetailsHeaders: [
        { text: 'Event Name', value: 'event' },
        { text: 'Event Date', value: 'date' },
        { text: 'Login Time', value: 'login' },
        { text: 'Logout Time', value: 'logout' },
        { text: 'Fine Amount', value: 'fine', align: 'end' }
      ],
      fineDetails: [],
      courses: ['All', 'BSIT', 'BSIS', 'BSCS'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      studentFinesHeaders: [
        { text: 'First Name', value: 'fname', align: 'start', width: '20%' },
        { text: 'Last Name', value: 'lname', align: 'start', width: '20%' },
        { text: 'M.I.', value: 'mi', align: 'center', width: '5%' },
        { text: 'Course', value: 'course', align: 'start', width: '20%' },
        { text: 'Year Level', value: 'year', align: 'start', width: '15%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '20%', sortable: false }
      ],
      studentFines: [
        { id: 1, fname: 'Al-shiolla', mi: 'H.', lname: 'Haron', course: 'BSIT', year: '3rd Year' },
        { id: 2, fname: 'Jane', mi: 'A.', lname: 'Batuhan', course: 'BSIT', year: '4th Year' },
        { id: 3, fname: 'Aiman', mi: 'C.', lname: 'Pumbaya', course: 'BSIT', year: '3rd Year' },
        { id: 4, fname: 'Sodais', mi: 'M.', lname: 'Macapantao', course: 'BSIS', year: '2nd Year' },
        { id: 5, fname: 'Abdulazis', mi: 'D.', lname: 'Mapandi', course: 'BSCS', year: '1st Year' },
        { id: 6, fname: 'Faiz', mi: 'A.', lname: 'Rataban', course: 'BSCS', year: '3rd Year' },
        { id: 7, fname: 'Doms', mi: 'M.', lname: 'Benito', course: 'BSIS', year: '2nd Year' }
      ],
      attendanceEvents: ['Today', 'Event A', 'Event B'],
      attendanceStats: {
        Today: [
          { name: 'BSIT', value: 42 },
          { name: 'BSIS', value: 28 },
          { name: 'BSCS', value: 35 }
        ],
        'Event A': [
          { name: 'BSIT', value: 33 },
          { name: 'BSIS', value: 21 },
          { name: 'BSCS', value: 30 }
        ],
        'Event B': [
          { name: 'BSIT', value: 38 },
          { name: 'BSIS', value: 25 },
          { name: 'BSCS', value: 32 }
        ]
      }
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
    calculateTotalFines() {
      const total = this.fineDetails.reduce((sum, item) => {
        return sum + parseFloat(item.fine.replace('₱', ''));
      }, 0);
      return `₱${total.toFixed(2)}`;
    },
    toggleGraph() {
      this.showGraph = !this.showGraph;
      if (this.showGraph) {
        this.selectedStudent = null;
        this.showAddStudent = false;
      }
    },
    showUploadStudentForm() {
      this.showAddStudent = true;
      this.editingStudent = false;
      this.showGraph = false;
      this.selectedStudent = null;
      this.newStudent = {
        id: null,
        fname: '',
        lname: '',
        mi: '',
        course: '',
        year: '',
        fingerprint: null
      };
    },
    editStudent(student) {
      this.newStudent = {...student};
      this.showAddStudent = true;
      this.editingStudent = true;
      this.showGraph = false;
      this.selectedStudent = null;
    },
    cancelAddStudent() {
      this.showAddStudent = false;
      this.editingStudent = false;
      this.newStudent = {
        id: null,
        fname: '',
        lname: '',
        mi: '',
        course: '',
        year: '',
        fingerprint: null
      };
    },
    addStudent() {
      if (!this.newStudent.fingerprint) {
        alert('Please register fingerprint first!');
        return;
      }
      
      const newId = Math.max(...this.studentFines.map(s => s.id), 0) + 1;
      this.studentFines.push({
        id: newId,
        ...this.newStudent
      });
      this.cancelAddStudent();
    },
    updateStudent() {
      const index = this.studentFines.findIndex(s => s.id === this.newStudent.id);
      if (index !== -1) {
        this.studentFines.splice(index, 1, {...this.newStudent});
      }
      this.cancelAddStudent();
    },
    editFine(student) {
      this.selectedStudent = student;
      this.showUpdateFineDialog = true;
    },
    saveFineUpdates() {
      this.showUpdateFineDialog = false;
      alert('Fine details updated successfully!');
    },
    viewFine(student) {
      if (this.selectedStudent && this.selectedStudent.id === student.id) {
        this.selectedStudent = null;
      } else {
        this.selectedStudent = student;
        this.showGraph = false;
        this.showAddStudent = false;
        this.fineDetails = this.generateMockFineDetails();
      }
    },
    simulateFingerprintScan() {
      this.showFingerprintDialog = false;
      this.newStudent.fingerprint = `fingerprint-data-${Date.now()}`;
      alert('Fingerprint registered successfully!');
    },
    generateMockFineDetails() {
      const events = ['Orientation', 'Seminar', 'Workshop', 'Meeting'];
      const details = [];
      
      for (let i = 0; i < 5; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
        
        details.push({
          event: randomEvent,
          date: randomDate.toLocaleDateString(),
          login: '08:' + Math.floor(Math.random() * 60).toString().padStart(2, '0'),
          logout: '17:' + Math.floor(Math.random() * 60).toString().padStart(2, '0'),
          fine: '₱' + (Math.random() * 500).toFixed(2)
        });
      }
      
      return details;
    },
    goBack() {
      this.filter.course = null;
      this.filter.yearLevel = null;
      this.selectedStudent = null;
      this.showGraph = false;
      this.showAddStudent = false;
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

.fine-card {
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  color: white;
}

.right-side-card {
  margin-left: 15px;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .4);
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
}

.fingerprint-dialog,
.update-fine-dialog {
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.fingerprint-sensor {
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin: 20px 0;
}

.fingerprint-sensor p {
  margin-top: 15px;
}

/* Student List Header */
.student-list-header {
  display: flex;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  border-radius: 4px 4px 0 0;
}

.student-list-header span {
  padding: 0 8px;
}

.student-list-header .col-fname {
  width: 20%;
  text-align: left;
}

.student-list-header .col-lname {
  width: 20%;
  text-align: left;
}

.student-list-header .col-mi {
  width: 5%;
  text-align: center;
}

.student-list-header .col-course {
  width: 20%;
  text-align: left;
}

.student-list-header .col-year {
  width: 15%;
  text-align: left;
}

.student-list-header .col-actions {
  width: 20%;
  text-align: center;
}

/* Fine Details Header */
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

.fine-details-header .col-date {
  width: 20%;
  text-align: left;
}

.fine-details-header .col-login {
  width: 15%;
  text-align: left;
}

.fine-details-header .col-logout {
  width: 15%;
  text-align: left;
}

.fine-details-header .col-fine {
  width: 25%;
  text-align: right;
}

/* Student Fines Table Styling */
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
}

.student-fines-table .col-fname {
  width: 20%;
  text-align: left;
  padding-left: 16px !important;
}

.student-fines-table .col-lname {
  width: 20%;
  text-align: left;
}

.student-fines-table .col-mi {
  width: 5%;
  text-align: center;
}

.student-fines-table .col-course {
  width: 20%;
  text-align: left;
}

.student-fines-table .col-year {
  width: 15%;
  text-align: left;
}

.student-fines-table .col-actions {
  width: 20%;
  text-align: center;
}

/* Fine Details Table Styling */
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

.fine-details-table .col-date {
  width: 20%;
  text-align: left;
}

.fine-details-table .col-login {
  width: 15%;
  text-align: left;
}

.fine-details-table .col-logout {
  width: 15%;
  text-align: left;
}

.fine-details-table .col-fine {
  width: 25%;
  text-align: right;
  padding-right: 16px !important;
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
  gap: 8px;
}

.action-buttons .v-btn {
  margin: 0;
  min-width: 100px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.update-fine-btn {
  background-color: #26A69A !important;
  color: white !important;
  margin-right: 16px;
}

.student-fines-table >>> .v-data-footer {
  display: none;
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
</style>