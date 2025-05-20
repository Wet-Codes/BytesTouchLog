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
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="selectedAttendanceEvent"
                          :items="attendanceEvents"
                          label="Select Event"
                          outlined
                          dense
                          dark
                          class="event-selector"
                          hide-details
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="selectedFineEvent"
                          :items="attendanceEvents"
                          label="Select Event"
                          outlined
                          dense
                          dark
                          class="event-selector"
                          hide-details
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card class="graph-card improved-chart">
                      <v-card-title class="chart-title">
                        <v-icon color="#2196F3" class="mr-2">mdi-chart-bar</v-icon>
                        Attendance Statistics
                      </v-card-title>
                      <v-card-text class="chart-container">
                        <BarChart 
                          :data="attendanceBarData" 
                          :options="barChartOptions"
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card class="graph-card improved-chart">
                      <v-card-title class="chart-title">
                        <v-icon color="#2196F3" class="mr-2">mdi-chart-pie</v-icon>
                        Fines Distribution
                      </v-card-title>
                      <v-card-text class="chart-container">
                        <PieChart 
                          :data="pieChartData" 
                          :options="pieChartOptions"
                        />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Student List Section -->
                <v-row v-if="showStudentList">
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
                          <span class="col-status">Status</span>
                          <span class="col-actions">Actions</span>
                        </div>
                        <v-data-table
                          :headers="studentFinesHeaders"
                          :items="filteredStudentFines"
                          :search="search"
                          :items-per-page="10"
                          v-model:page="page"
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
                          {{ selectedStudent.fname }} {{ selectedStudent.lname }}'s Fines
                        </v-card-title>
                      </div>
                      <v-card-text>
                        <div class="fine-details-header">
                          <span class="col-event">Event</span>
                          <span class="col-semester">Semester</span>
                          <span class="col-fine">Fine Amount</span>
                          <span class="col-date">Date</span>
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
                              <td class="col-semester">{{ item.semester }}</td>
                              <td class="col-fine">{{ item.fine }}</td>
                              <td class="col-date">{{ formatDate(item.date) }}</td>
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
import { format } from 'date-fns';

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
      search: '',
      selectedStudent: null,
      showStudentList: false,
      page: 1,
      pageCount: 1,
      selectedAttendanceEvent: 'Today',
      selectedFineEvent: 'Today',
      fineDetailsHeaders: [
        { text: 'Event Name', value: 'event', width: '30%' },
        { text: 'Semester', value: 'semester', width: '20%' },
        { text: 'Fine Amount', value: 'fine', width: '25%' },
        { text: 'Date', value: 'date', width: '25%' }
      ],
      fineDetails: [],
      courses: ['All', 'BSIT', 'BSIS', 'BSCS'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      statusOptions: ['Regular', 'Irregular', 'Shifted', 'Graduated', 'Dropped'],
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
      attendanceEvents: ['Today', 'Event A', 'Event B'],
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#2196F3',
            bodyColor: 'white',
            borderColor: '#2196F3',
            borderWidth: 1
          }
        }
      },
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'white',
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#2196F3',
            bodyColor: 'white',
            borderColor: '#2196F3',
            borderWidth: 1
          }
        }
      }
    };
  },
  computed: {
    filteredStudentFines() {
      return this.studentFines.filter((student) => {
        return (
          (this.filter.course === 'All' || !this.filter.course || student.course === this.filter.course) &&
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
    },
    attendanceBarData() {
      return {
        labels: ['BSIT', 'BSIS', 'BSCS'],
        datasets: [
          {
            label: 'Attended',
            backgroundColor: '#2196F3',
            data: [42, 28, 35],
            borderRadius: 6
          },
          {
            label: 'Absent',
            backgroundColor: '#F44336',
            data: [8, 12, 5],
            borderRadius: 6
          }
        ]
      };
    },
    pieChartData() {
      return {
        labels: ['No Fines', 'With Fines'],
        datasets: [{
          data: [60, 40],
          backgroundColor: ['#2196F3', '#F44336'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      };
    }
  },
  watch: {
    selectedFineEvent(newVal) {
      this.updateFineData(newVal);
    },
    selectedAttendanceEvent(newVal) {
      this.updateAttendanceData(newVal);
    },
    filteredStudentFines() {
      this.updatePagination();
    }
  },
  created() {
    this.updatePagination();
  },
  methods: {
    updatePagination() {
      this.pageCount = Math.ceil(this.filteredStudentFines.length / 10);
    },
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
    toggleStudentList() {
      this.showStudentList = !this.showStudentList;
      if (!this.showStudentList) {
        this.selectedStudent = null;
      }
    },
    updateFineData(event) {
      const baseValue = event === 'Today' ? 40 : 
                       event === 'Event A' ? 35 : 45;
      this.pieChartData.datasets[0].data = [100 - baseValue, baseValue];
    },
    updateAttendanceData(event) {
      const attended = event === 'Today' ? [42, 28, 35] :
                      event === 'Event A' ? [38, 25, 32] : [45, 30, 28];
      const absent = event === 'Today' ? [8, 12, 5] :
                     event === 'Event A' ? [12, 15, 8] : [5, 10, 12];
      
      this.attendanceBarData.datasets[0].data = attended;
      this.attendanceBarData.datasets[1].data = absent;
    },
    viewFine(student) {
      if (this.selectedStudent && this.selectedStudent.id === student.id) {
        this.selectedStudent = null;
      } else {
        this.selectedStudent = student;
        this.fineDetails = this.generateMockFineDetails();
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

.improved-chart {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(40, 155, 184, 0.5);
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.improved-chart:hover {
  box-shadow: 0 8px 25px rgba(40, 155, 184, 0.3) !important;
  transform: translateY(-2px);
}

.chart-title {
  color: white !important;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  padding: 16px 20px !important;
  border-bottom: 1px solid rgba(40, 155, 184, 0.3);
}

.chart-container {
  padding: 16px !important;
  height: 350px;
}

.event-selector {
  width: 100%;
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
  width: 30%;
  text-align: left;
}

.fine-details-header .col-semester {
  width: 20%;
  text-align: center;
}

.fine-details-header .col-fine {
  width: 25%;
  text-align: right;
}

.fine-details-header .col-date {
  width: 25%;
  text-align: right;
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
}

.fine-details-table .col-fine {
  width: 25%;
  text-align: right;
  padding-right: 16px !important;
}

.fine-details-table .col-date {
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

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
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

  .details-title {
    font-size: 1.2rem !important;
    padding: 12px !important;
  }
}
</style>