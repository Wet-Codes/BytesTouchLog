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
                <div>
                  <v-btn color="primary" dark @click="openEventDialog">
                    <v-icon left>mdi-calendar-plus</v-icon>
                    Add Event
                  </v-btn>
                </div>
              </v-card-title>

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
                          hide-default-footer
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
          (this.filter.course === 'All' || !this.filter.course || student.department === this.filter.course) &&
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
        console.log(`Fetching attendance for event: ${eventId}`);
        this.attendanceRecords = {};
      } catch (error) {
        console.error('Error fetching attendance:', error);
        alert('Failed to load attendance records: ' + (error.response?.data?.message || error.message));
      }
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
      this.attendanceRecords = {
        ...this.attendanceRecords,
        [student.id]: status
      };
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

/* === FIXED ALIGNMENT === */
.student-list-header {
  display: grid;
  grid-template-columns: 20% 5% 20% 20% 35%;
  padding: 12px 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  text-align: center;
}

.student-table >>> tbody tr {
  display: grid;
  grid-template-columns: 20% 5% 20% 20% 35%;
  text-align: center;
}

.student-table >>> td {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0 !important;
}

/* === WHITE TEXT IN TABLE === */
.student-table >>> td {
  color: rgb(255, 255, 255) !important;
  background: rgba(0, 0, 0, 0.76) !important;
}

/* === TRANSPARENT BACKGROUNDS === */
.fine-card {
  background: rgba(0, 0, 0, 0.5) !important;
}

.student-list-card {
  background: rgba(0, 0, 0, 0.3) !important;
}

.event-dialog {
  background: rgba(0, 0, 0, 0.8) !important;
}

/* === BUTTON COLORS PRESERVED === */
.v-btn--success {
  background-color: #4CAF50 !important;
}

.v-btn--primary {
  background-color: #1976D2 !important;
}

.v-btn--teal {
  background-color: #009688 !important;
}

/* === TEXT AND UI ELEMENTS === */
.v-card-title, 
.v-card-text {
  color: white !important;
}

.student-table tr.present-row {
  background-color: rgba(76, 175, 80, 0.2) !important;
}

.student-table tr.absent-row {
  background-color: rgba(244, 67, 54, 0.2) !important;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.action-btn {
  min-width: 100px;
}

.table-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 10px 0;
}

/* === PAGINATION STYLES === */
.v-pagination {
  background: transparent !important;
}

.v-pagination__navigation,
.v-pagination__item {
  background: rgba(40, 155, 184, 0.3) !important;
  color: white !important;
}

.v-pagination__item--active {
  background: #289bb8 !important;
  color: white !important;
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