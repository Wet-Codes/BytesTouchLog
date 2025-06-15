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
                  <v-card-title class="text-left d-flex justify-space-between align-center">
                    <h1 class="table-title">STUDENT MANAGEMENT</h1>
                    <v-btn 
                      color="primary" 
                      @click="showStudentList = !showStudentList"
                      class="show-list-btn"
                    >
                      {{ showStudentList ? 'Show Graph' : 'Show List' }}
                    </v-btn>
                  </v-card-title>
                  
                  <v-card-text>
                    <!-- Charts Grid -->
                    <v-row v-if="!showStudentList" class="charts-grid">
                      <!-- Top Row - Charts -->
                      <v-col cols="12" md="6">
                        <v-card class="chart-card">
                          <div class="chart-header">
                            <v-card-title class="chart-title">
                              <v-icon left color="white">mdi-chart-pie</v-icon>
                              Fines Distribution
                            </v-card-title>
                            <v-select
                              v-model="selectedFineEvent"
                              :items="fineEvents"
                              label="Select Event"
                              outlined
                              dense
                              dark
                              class="event-selector"
                              @update:modelValue="updateFineData"
                            ></v-select>
                          </div>
                          <v-card-text class="chart-container">
                            <PieChart 
                              :data="pieChartData" 
                              :options="pieChartOptions"
                            />
                            <div class="pie-percentage-box">
                              <div class="percentage-item">
                                <span class="percentage-value">{{ 100 - currentFinePercentage }}%</span>
                                <span class="percentage-label">No Fines</span>
                              </div>
                              <div class="percentage-item">
                                <span class="percentage-value">{{ currentFinePercentage }}%</span>
                                <span class="percentage-label">With Fines</span>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-card class="chart-card">
                          <div class="chart-header">
                            <v-card-title class="chart-title">
                              <v-icon left color="white">mdi-chart-areaspline</v-icon>
                              Fines Over Time
                            </v-card-title>
                            <v-select
                              v-model="selectedSchoolYear"
                              :items="schoolYears"
                              label="School Year"
                              outlined
                              dense
                              dark
                              class="event-selector area-selector"
                              @update:modelValue="updateAreaChartData"
                            ></v-select>
                          </div>
                          <v-card-text class="chart-container">
                            <AreaChart 
                              :data="areaChartData" 
                              :options="areaChartOptions"
                            />
                            <div class="area-percentage-container">
                              <div class="area-percentage-box current">
                                <div class="percentage-value">{{ currentSemesterData.percentage }}%</div>
                                <div class="percentage-label">{{ currentSemesterData.semester }}</div>
                                <div class="percentage-year">{{ selectedSchoolYear }}</div>
                              </div>
                              <div class="area-percentage-box previous-1">
                                <div class="percentage-value">{{ previousYear1Data.percentage }}%</div>
                                <div class="percentage-label">{{ previousYear1Data.year }}</div>
                              </div>
                              <div class="area-percentage-box previous-2">
                                <div class="percentage-value">{{ previousYear2Data.percentage }}%</div>
                                <div class="percentage-label">{{ previousYear2Data.year }}</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      
                      <!-- Bottom Row - Charts -->
                      <v-col cols="12" md="6">
                        <v-card class="chart-card">
                          <div class="chart-header">
                            <v-card-title class="chart-title">
                              <v-icon left color="white">mdi-chart-bar</v-icon>
                              Attendance by Course
                            </v-card-title>
                            <v-select
                              v-model="selectedAttendanceEvent"
                              :items="attendanceEvents"
                              label="Select Event"
                              outlined
                              dense
                              dark
                              class="event-selector"
                              @update:modelValue="updateAttendanceData"
                            ></v-select>
                          </div>
                          <v-card-text class="chart-container">
                            <BarChart 
                              :data="attendanceBarData" 
                              :options="barChartOptions"
                            />
                          </v-card-text>
                        </v-card>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-card class="chart-card">
                          <div class="chart-header">
                            <v-card-title class="chart-title">
                              <v-icon left color="white">mdi-account-group</v-icon>
                              Total Students of CICS
                            </v-card-title>
                          </div>
                          <v-card-text class="chart-container">
                            <DonutChart 
                              :data="donutChartData" 
                              :options="donutChartOptions"
                            />
                            <div class="donut-text-container">
                              <div class="donut-percentage-box">
                                <div class="percentage-item">
                                  <span class="percentage-percent">45%</span>
                                  <span class="percentage-value">1,350 students</span>
                                  <span class="percentage-course">BSIT</span>
                                </div>
                                <div class="percentage-item">
                                  <span class="percentage-percent">30%</span>
                                  <span class="percentage-value">900 students</span>
                                  <span class="percentage-course">BSIS</span>
                                </div>
                                <div class="percentage-item">
                                  <span class="percentage-percent">25%</span>
                                  <span class="percentage-value">750 students</span>
                                  <span class="percentage-course">BSCS</span>
                                </div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>

                    <!-- Student List Section -->
                    <v-row v-if="showStudentList" class="student-list-section">
                      <v-col :cols="showFineDetails ? 8 : 12">
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
                              :items="filteredStudents"
                              :search="search"
                              :items-per-page="10"
                              v-model:page="page"
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
                                  <td class="col-actions text-center">
                                    <div class="action-buttons">
                                      <v-btn 
                                        small 
                                        color="primary" 
                                        @click="toggleFineDetails(item)" 
                                        class="action-btn"
                                      >
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

                      <!-- Fine Details Column -->
                      <v-col v-if="showFineDetails" cols="4">
                        <v-card class="fine-details-card">
                          <div class="details-header">
                            <v-card-title class="details-title">
                              {{ selectedStudent.fname }} {{ selectedStudent.lname }}'s Details
                            </v-card-title>
                          </div>
                          <v-card-text>
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
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import PageHeader from '@/components/CustomHeaderNav.vue';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
import DonutChart from '@/components/DonutChart.vue';
import AreaChart from '@/components/AreaChart.vue';
import { format } from 'date-fns';
import Auth from '../services/AuthServices'

export default {
  components: {
    PageHeader,
    PieChart,
    BarChart,
    DonutChart,
    AreaChart
  },
  data() {
    return {

      //UI States
      showStudentList: false,
      showFineDetails: false,
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
     
      filter: {
        course: null,
        yearLevel: null,
      },

      search: '',
      selectedStudent: null,
      students: [],
      backgroundImage:"https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      page: 1,
      pageCount: 1,
      courses: ['All', 'BSIT', 'BSIS', 'BSCS'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      statusOptions: ['Enrolled', 'Shifted', 'Graduated', 'Dropped'],



      //Un-used 

      fineDetailsHeaders: [
        { text: 'Event Name', value: 'event', width: '30%' },
        { text: 'Semester', value: 'semester', width: '20%' },
        { text: 'Fine Amount', value: 'fine', width: '25%' },
        { text: 'Date', value: 'date', width: '25%' }
      ],
      fineDetails: [],
      selectedFineEvent: 'Orientation',
      selectedAttendanceEvent: 'Today',
      selectedSchoolYear: '2023-2024',
      currentFinePercentage: 40,
      currentGrowthRate: 12.5,
      fineEvents: ['Orientation', 'Seminar', 'Workshop', 'Meeting'],
      attendanceEvents: ['Today', 'Event A', 'Event B'],
      schoolYears: ['2022-2023', '2023-2024', '2024-2025'],

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
      pieChartData: {
        labels: ['No Fines', 'With Fines'],
        datasets: [{
          data: [60, 40],
          backgroundColor: ['#2196F3', '#F44336'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      areaChartData: {
        labels: ['1st Sem', '2nd Sem', 'Summer'],
        datasets: [
          {
            label: 'Fines Collected',
            data: [3200, 4800, 1200],
            backgroundColor: 'rgba(33, 150, 243, 0.3)',
            borderColor: '#2196F3',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }
        ]
      },
      attendanceBarData: {
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
      },
      donutChartData: {
        labels: ['BSIT', 'BSIS', 'BSCS'],
        datasets: [{
          data: [45, 30, 25],
          backgroundColor: ['#2196F3', '#4CAF50', '#FFC107'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      currentSemesterData: {
        semester: '2nd Sem',
        percentage: 12.5,
        year: '2023-2024'
      },
      previousYear1Data: {
        year: '2022-2023',
        percentage: 8.2
      },
      previousYear2Data: {
        year: '2021-2022',
        percentage: 5.5
      },
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
      },
      areaChartOptions: {
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
            display: false,
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
      donutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#2196F3',
            bodyColor: 'white',
            borderColor: '#2196F3',
            borderWidth: 1
          },
          doughnutlabel: {
            labels: [
              {
                text: 'CICS',
                font: {
                  size: 20,
                  weight: 'bold',
                  family: "'Poppins', sans-serif"
                },
                color: 'white'
              },
              {
                text: 'Students',
                font: {
                  size: 16,
                  family: "'Poppins', sans-serif"
                },
                color: 'rgba(255,255,255,0.8)'
              }
            ]
          }
        }
      }
    };
  },
  async mounted() {
    await this.fetchStudents();
  },

  computed: {

     //Fetch the uploaded Data
  

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


    navigateTo(route) {
      this.$router.push({ name: route });
    },
    updatePagination() {
      this.pageCount = Math.ceil(this.filteredStudents.length / 10);
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


//unused data

    calculateTotalFines() {
      const total = this.fineDetails.reduce((sum, item) => {
        return sum + parseFloat(item.fine.replace('₱', ''));
      }, 0);
      return `₱${total.toFixed(2)}`;
    },
    toggleFineDetails(student) {
      if (this.selectedStudent && this.selectedStudent.id === student.id) {
        this.selectedStudent = null;
        this.showFineDetails = false;
        this.fineDetails = [];
      } else {
        this.selectedStudent = student;
        this.showFineDetails = true;
        this.fineDetails = this.generateMockFineDetails();
      }
    },
    updateFineData(event) {
      const baseValue = event === 'Orientation' ? 40 : 
                       event === 'Seminar' ? 35 : 
                       event === 'Workshop' ? 25 : 45;
      this.currentFinePercentage = baseValue;
      this.pieChartData = {
        ...this.pieChartData,
        datasets: [{
          ...this.pieChartData.datasets[0],
          data: [100 - baseValue, baseValue]
        }]
      };
    },
    updateAttendanceData(event) {
      const attended = event === 'Today' ? [42, 28, 35] :
                      event === 'Event A' ? [38, 25, 32] : [45, 30, 28];
      const absent = event === 'Today' ? [8, 12, 5] :
                     event === 'Event A' ? [12, 15, 8] : [5, 10, 12];
      
      this.attendanceBarData = {
        ...this.attendanceBarData,
        datasets: [
          {
            ...this.attendanceBarData.datasets[0],
            data: attended
          },
          {
            ...this.attendanceBarData.datasets[1],
            data: absent
          }
        ]
      };
    },
    updateAreaChartData(year) {
      const data = year === '2022-2023' ? [2800, 3500, 800] :
                   year === '2023-2024' ? [3200, 4800, 1200] : [3800, 5200, 1500];
      
      this.currentSemesterData = {
        semester: '2nd Sem',
        percentage: this.yearGrowthRates[year] || 12.5,
        year: year
      };
      
      this.areaChartData = {
        ...this.areaChartData,
        datasets: [{
          ...this.areaChartData.datasets[0],
          data: data
        }]
      };
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
  },




  watch: {
    selectedFineEvent(newVal) {
      this.updateFineData(newVal);
    },
    selectedAttendanceEvent(newVal) {
      this.updateAttendanceData(newVal);
    },
    selectedSchoolYear(newVal) {
      this.updateAreaChartData(newVal);
    },
    filteredStudents() {
      this.updatePagination();
    }
  },
  created() {
    this.updatePagination();
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

/* Dashboard Styles */
.table-title {
  color: white;
  font-size: 2rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-align: left;
  padding-left: 16px;
}

.fine-card {
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  color: white;
}

.show-list-btn {
  margin-right: 16px;
}

/* Charts Grid */
.charts-grid {
  margin-top: 16px;
}

.chart-card {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 1px solid rgba(40, 155, 184, 0.5);
  border-radius: 12px !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chart-title {
  color: white !important;
  font-size: 1.1rem !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex;
  align-items: center;
}

.chart-container {
  padding: 12px !important;
  height: 250px;
  flex: 1;
  position: relative;
}

/* Percentage Boxes */
.pie-percentage-box {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.percentage-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.percentage-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
}

.percentage-label {
  font-size: 0.8rem;
  color: white;
}

/* Area Chart Percentage Container */
.area-percentage-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.area-percentage-box {
  background: rgba(40, 155, 184, 0.7);
  border-radius: 6px;
  padding: 6px 10px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 80px;
}

.area-percentage-box.current {
  background: rgba(40, 155, 184, 0.9);
}

.area-percentage-box .percentage-value {
  font-size: 0.9rem;
  font-weight: bold;
  color: white;
}

.area-percentage-box .percentage-label {
  font-size: 0.65rem;
  color: white;
}

.area-percentage-box .percentage-year {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

/* Donut Chart Text Container */
.donut-text-container {
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 140px;
}

.donut-percentage-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.percentage-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 8px;
}

.percentage-percent {
  font-size: 1rem;
  font-weight: bold;
  color: white;
}

.percentage-value {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.percentage-course {
  font-size: 0.85rem;
  color: white;
  font-weight: 500;
}

.event-selector {
  max-width: 180px;
  margin-left: 8px;
}

.event-selector.area-selector {
  max-width: 150px;
}

.event-selector >>> .v-input__slot {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  height: 36px !important;
}

.event-selector >>> .v-text-field__slot input {
  color: white !important;
  font-size: 0.9rem !important;
}

.event-selector >>> .v-label {
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 0.9rem !important;
}

.event-selector >>> .v-select__selection {
  color: white !important;
}

/* Student List Section */
.student-list-section {
  margin-top: 16px;
}

.student-list-card {
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  color: white;
}

.fine-details-card {
  background: rgba(0, 0, 0, 0.7) !important;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
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
  background-color: rgba(30, 30, 30, 0.6) !important;
  color: white !important;
  border-radius: 0 0 4px 4px;
  border: 1px solid rgba(40, 155, 184, 0.5);
}

.fine-details-table tr {
  background-color: rgba(0, 0, 0, 0.3) !important;
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

.student-info {
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 16px;
}

.student-info p {
  margin-bottom: 8px;
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
  position: relative;
  padding: 16px;
}

.details-title {
  font-size: 1.5rem !important;
  padding: 16px !important;
  white-space: normal;
  word-break: break-word;
  text-align: center;
  width: 100%;
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

  .chart-container {
    height: 200px;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .event-selector {
    margin-left: 0;
    margin-top: 8px;
    max-width: 100%;
    width: 100%;
  }

  .event-selector.area-selector {
    max-width: 100%;
  }

  .details-title {
    font-size: 1.2rem !important;
  }
  
  .pie-percentage-box,
  .donut-text-container {
    right: 10px;
    bottom: 10px;
    width: 120px;
  }
  
  .area-percentage-container {
    flex-direction: column;
    gap: 5px;
    width: 90px;
  }
  
  .area-percentage-box {
    padding: 5px 8px;
    min-width: auto;
    width: 100%;
  }
  
  .percentage-percent {
    font-size: 0.9rem;
  }
  
  .percentage-value {
    font-size: 0.7rem;
  }
  
  .percentage-course {
    font-size: 0.8rem;
  }
  
  .area-percentage-box .percentage-value {
    font-size: 0.8rem;
  }
  
  .area-percentage-box .percentage-label {
    font-size: 0.6rem;
  }
  
  .area-percentage-box .percentage-year {
    font-size: 0.5rem;
  }
}
</style>