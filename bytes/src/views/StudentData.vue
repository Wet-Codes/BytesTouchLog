<template>
  <div>
    <page-header />
    <div :style="mainContentStyle">
      <v-container>
        <v-row>
          <!-- Student Accounts Table -->
          <v-col cols="6">
            <v-card class="form idle" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Student Accounts</span>
                <v-btn color="primary" @click="editStudentAccounts">Edit</v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="studentAccountHeaders"
                  :items="studentAccounts"
                  class="elevation-1"
                  :header-props="{ color: 'white', class: 'blue-grey darken-1' }"
                  @click:row="selectStudent"
                >
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Student FA Table -->
          <v-col cols="6">
            <v-card v-if="selectedStudent" class="form idle" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Student FA {{ selectedStudent.fname }} {{ selectedStudent.lname }}</span>
                <div>
                  <v-btn color="primary" @click="editStudentFA">Edit</v-btn>
                  <v-btn color="success" @click="openFormDialog" class="ml-2">Upload</v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="studentFAHeaders"
                  :items="selectedStudent.studentFA"
                  class="elevation-1"
                  :header-props="{ color: 'white', class: 'blue-grey darken-1' }"
                >
                </v-data-table>
                <!-- Generate Attendance Table Button -->
                <v-btn color="primary" @click="openGenerateTableDialog" class="mt-4">
                  Generate Attendance Table
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Info Tab for Description -->
        <v-row no-gutters>
          <v-col cols="12">
            <v-card class="info-tab form idle" elevation="2">
              <v-card-title class="text-h6 white-text">
                System Information
              </v-card-title>
              <v-card-text>
                <p class="white-text">
                  <strong>Student Accounts:</strong> This section provides an overview of all student accounts, displaying essential information such as the student's name, course, and year level.
                </p>
                <p class="white-text">
                  <strong>Student FA:</strong> This section tracks the attendance and participation of individual students in various events. It ensures accurate records of student activities and their engagement levels.
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Form Dialog for Adding New Account -->
        <v-dialog v-model="formDialog" max-width="500px">
          <v-card class="form idle" elevation="2">
            <v-card-title>
              <span class="text-h5 white-text">{{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text v-if="dialogType === 'upload'">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <!-- Upload fingerprint -->
                    <v-btn icon large color="primary">
                      <v-icon>mdi-fingerprint</v-icon>
                    </v-btn>
                    <span class="text-h6 white--text">Upload fingerprint</span>
                  </v-col>
                  <v-col cols="12">
                    <!-- Upload student data -->
                    <v-btn icon large color="primary">
                      <v-icon>mdi-file</v-icon>
                    </v-btn>
                    <span class="text-h6 white--text">Upload student data</span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-text v-else-if="dialogType === 'generateTable'">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <span class="text-h6 white--text">Select your fines:</span>
                    <!-- List of fines/events -->
                    <v-select v-model="selectedFine" :items="fineOptions" label="Select fines" outlined></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-text v-else>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="newFA.event" label="Event"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="newFA.date" label="Date"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="newFA.login" label="Login"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="newFA.logout" label="Logout"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="newFA.allFund" label="All-Fund"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions v-if="dialogType !== 'upload'">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="dialogType === 'generateTable' ? generateAttendanceTable() : saveNewFA">
                {{ dialogType === 'generateTable' ? 'Generate Table' : 'Save' }}
              </v-btn>
              <v-btn color="secondary" @click="closeFormDialog">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      formDialog: false,
      newFA: {
        event: '',
        date: '',
        login: '',
        logout: '',
        allFund: ''
      },
      studentAccountHeaders: [
        { text: 'Fname', value: 'fname', align: 'start' },
        { text: 'M.I', value: 'mi', align: 'start' },
        { text: 'Lname', value: 'lname', align: 'start' },
        { text: 'Course', value: 'course', align: 'start' },
        { text: 'Year', value: 'year', align: 'start' }
      ],
      studentAccounts: [
        { fname: 'Al-shiolla', mi: 'H.', lname: 'Haron', course: 'IT', year: '3rd' },
        { fname: 'Aiman', mi: 'C.', lname: 'Pumbaya', course: 'IT', year: '3rd' },
        { fname: 'Sodais', mi: 'M.', lname: 'Macapantao', course: 'IT', year: '3rd' }
      ],
      studentFAHeaders: [
        { text: 'Event', value: 'event', align: 'start' },
        { text: 'Date', value: 'date', align: 'start' },
        { text: 'Login', value: 'login', align: 'start' },
        { text: 'Logout', value: 'logout', align: 'start' },
        { text: 'All-Fund', value: 'allFund', align: 'start' }
      ],
      studentFA: [
        { event: 'Orientation', date: '2024-06-01', login: '08:00 AM', logout: '10:00 AM', allFund: '100' },
        { event: 'Acquaintance', date: '2024-06-15', login: '09:00 AM', logout: '11:00 AM', allFund: '200' },
        { event: 'Kasadya', date: '2024-06-20', login: '10:00 AM', logout: '12:00 PM', allFund: '150' }
      ],
      selectedStudent: null,
      dialogType: 'upload', // Set default dialog type to upload
      fineOptions: ['Orientation', 'Acquaintance', 'Kasadya'], // Example list of fines/events
      selectedFine: null,
    };
  },
  computed: {
    mainContentStyle() {
      return {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
      };
    },
    dialogTitle() {
      return this.dialogType === 'upload' ? 'Upload Options' : 'Add New Student FA';
    }
  },
  methods: {
    openFormDialog() {
      this.dialogType = 'upload';
      this.formDialog = true;
    },
    openGenerateTableDialog() {
      this.dialogType = 'generateTable';
      this.formDialog = true;
    },
    closeFormDialog() {
      this.formDialog = false;
      this.resetForm();
    },
    saveNewFA() {
      this.selectedStudent.studentFA.push({ ...this.newFA });
      this.closeFormDialog();
    },
    resetForm() {
      this.newFA = {
        event: '',
        date: '',
        login: '',
        logout: '',
        allFund: ''
      };
    },
    editStudentAccounts() {
      console.log('Editing student accounts logic here');
    },
    selectStudent(student) {
      this.selectedStudent = student;
    },
    generateAttendanceTable() {
      // Logic to generate attendance table based on selected fines
      console.log('Generating attendance table with fines:', this.selectedFine);
      this.closeFormDialog();
    },
    editStudentFA() {
      console.log('Editing student FA logic here');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

html, body {
  height: 50%;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(#30142b, #2772a1);
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.v-card {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
}

.v-card-title {
  color: white;
}

.v-card-text {
  color: white;
}

.info-tab .v-card-title,
.info-tab .v-card-text {
  color: white;
}

.v-card-title span {
  font-weight: 600;
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

.v-card .v-btn span {
  position: absolute;
  display: block;
}

.v-card .v-btn span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #289bb8);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

.v-card .v-btn span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #289bb8);
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%, 100% {
    top: 100%;
  }
}

.v-card .v-btn span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #289bb8);
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%, 100% {
    right: 100%;
  }
}

.v-card .v-btn span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #289bb8);
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%, 100% {
    bottom: 100%;
  }
}
</style>
