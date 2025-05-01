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
                <v-btn 
                  color="teal" 
                  dark
                  @click="toggleStudentList"
                >
                  {{ showStudentList ? 'Show Graphs' : 'Show Student List' }}
                </v-btn>
              </v-card-title>
              <v-card-text>
                <!-- Graphs Section -->
                <v-row v-if="!showStudentList" class="mb-4">
                  <v-col cols="12" md="6">
                    <v-card class="graph-card">
                      <v-card-title>
                        <v-select
                          v-model="selectedAttendanceEvent"
                          :items="attendanceEvents"
                          label="Select Event"
                          outlined
                          dense
                          dark
                          class="event-selector"
                        />
                      </v-card-title>
                      <v-card-text>
                        <BarChart :data="attendanceBarData" />
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card class="graph-card">
                      <v-card-title>
                        <v-select
                          v-model="selectedFineEvent"
                          :items="attendanceEvents"
                          label="Select Event"
                          outlined
                          dense
                          dark
                          class="event-selector"
                        />
                      </v-card-title>
                      <v-card-text>
                        <PieChart :data="fineData" />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Student List Section -->
                <v-row v-if="showStudentList">
                  <v-col :cols="selectedStudent ? 8 : 12">
                    <v-card class="student-list-card">
                      <v-card-text>
                        <v-row class="mb-4" align="center">
                          <!-- Filters -->
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

                        <!-- Student Fines Table -->
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
                                </div>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Student Fine Details -->
                  <v-col v-if="selectedStudent" cols="4">
                    <v-card class="right-side-card">
                      <div class="details-header">
                        <v-card-title>
                          {{ selectedStudent.fname }} {{ selectedStudent.lname }}'s Fines
                        </v-card-title>
                        <v-btn 
                          color="success" 
                          class="paid-btn"
                          @click="clearFines"
                        >
                          Mark as Paid
                        </v-btn>
                      </div>
                      <v-card-text>
                        <div class="fine-details-header">
                          <span class="col-event">Event</span>
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
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';

export default {
  components: {
    PageHeader,
    PieChart,
    BarChart
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      filter: {
        course: null,
        yearLevel: null,
      },
      selectedStudent: null,
      showStudentList: false,
      selectedAttendanceEvent: 'Today',
      selectedFineEvent: 'Today',
      fineDetailsHeaders: [
        { text: 'Event Name', value: 'event' },
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
        { id: 1, fname: 'Al-shiolla', mi: 'H.', lname: 'Haron', course: 'BSIT', year: '3rd Year', hasFine: true },
        { id: 2, fname: 'Jane', mi: 'A.', lname: 'Batuhan', course: 'BSIT', year: '4th Year', hasFine: false },
        { id: 3, fname: 'Aiman', mi: 'C.', lname: 'Pumbaya', course: 'BSIT', year: '3rd Year', hasFine: true },
        { id: 4, fname: 'Sodais', mi: 'M.', lname: 'Macapantao', course: 'BSIS', year: '2nd Year', hasFine: false },
        { id: 5, fname: 'Abdulazis', mi: 'D.', lname: 'Mapandi', course: 'BSCS', year: '1st Year', hasFine: true },
        { id: 6, fname: 'Faiz', mi: 'A.', lname: 'Rataban', course: 'BSCS', year: '3rd Year', hasFine: false },
        { id: 7, fname: 'Doms', mi: 'M.', lname: 'Benito', course: 'BSIS', year: '2nd Year', hasFine: true }
      ],
      attendanceEvents: ['Today', 'Event A', 'Event B'],
      attendanceBarData: {
        labels: ['BSIT', 'BSIS', 'BSCS'],
        datasets: [
          {
            label: 'Attended',
            backgroundColor: '#4CAF50',
            data: [42, 28, 35]
          },
          {
            label: 'Absent',
            backgroundColor: '#F44336',
            data: [8, 12, 5]
          }
        ]
      },
      fineData: [
        { name: 'With Fines', value: 40, color: '#FF9800' },
        { name: 'No Fines', value: 60, color: '#2196F3' }
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
  watch: {
    selectedFineEvent(newVal) {
      this.updateFineData(newVal);
    },
    selectedAttendanceEvent(newVal) {
      this.updateAttendanceData(newVal);
    }
  },
  methods: {
    calculateTotalFines() {
      const total = this.fineDetails.reduce((sum, item) => {
        return sum + parseFloat(item.fine.replace('₱', ''));
      }, 0);
      return `₱${total.toFixed(2)}`;
    },
    toggleStudentList() {
      this.showStudentList = !this.showStudentList;
      if (!this.showStudentList) {
        this.selectedStudent = null;
      }
    },
    updateFineData(event) {
      // Simulate different data for different events
      const baseValue = event === 'Today' ? 40 : 
                       event === 'Event A' ? 35 : 45;
      this.fineData = [
        { name: 'With Fines', value: baseValue, color: '#FF9800' },
        { name: 'No Fines', value: 100 - baseValue, color: '#2196F3' }
      ];
    },
    updateAttendanceData(event) {
      // Simulate different data for different events
      const attended = event === 'Today' ? [42, 28, 35] :
                      event === 'Event A' ? [38, 25, 32] : [45, 30, 28];
      const absent = event === 'Today' ? [8, 12, 5] :
                     event === 'Event A' ? [12, 15, 8] : [5, 10, 12];
      
      this.attendanceBarData = {
        labels: ['BSIT', 'BSIS', 'BSCS'],
        datasets: [
          {
            label: 'Attended',
            backgroundColor: '#4CAF50',
            data: attended
          },
          {
            label: 'Absent',
            backgroundColor: '#F44336',
            data: absent
          }
        ]
      };
    },
    viewFine(student) {
      if (this.selectedStudent && this.selectedStudent.id === student.id) {
        this.selectedStudent = null;
      } else {
        this.selectedStudent = student;
        this.fineDetails = this.generateMockFineDetails();
      }
    },
    clearFines() {
      this.fineDetails = [];
      alert(`${this.selectedStudent.fname} ${this.selectedStudent.lname}'s fines have been marked as paid!`);
    },
    generateMockFineDetails() {
      const events = ['Orientation', 'Seminar', 'Workshop', 'Meeting'];
      const details = [];
      
      for (let i = 0; i < 3; i++) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
        
        details.push({
          event: randomEvent,
          fine: '₱' + (Math.random() * 500).toFixed(2)
        });
      }
      
      return details;
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

.graph-card {
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .4);
  border-radius: 10px;
  color: white;
  margin-bottom: 20px;
  height: 100%;
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
  width: 70%;
  text-align: left;
}

.fine-details-header .col-fine {
  width: 30%;
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
  width: 70%;
  text-align: left;
  padding-left: 16px !important;
}

.fine-details-table .col-fine {
  width: 30%;
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

.paid-btn {
  background-color: #4CAF50 !important;
  color: white !important;
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

.event-selector {
  max-width: 250px;
}
</style>