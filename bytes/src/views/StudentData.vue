<template>
  <div>
    <page-header />
    <div class="content">
      <v-container>
        <v-row>
          <!-- Student Accounts Table -->
          <v-col cols="6">
            <v-card>
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
                >
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Student FA Table -->
          <v-col cols="6">
            <v-card>
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Student FA</span>
                <v-btn color="success" @click="openFormDialog">Upload</v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="studentFAHeaders"
                  :items="studentFA"
                  class="elevation-1"
                  :header-props="{ color: 'white', class: 'blue-grey darken-1' }"
                >
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Form Dialog for Adding New Account -->
      <v-dialog v-model="formDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add New Student FA</span>
          </v-card-title>
          <v-card-text>
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveNewFA">Save</v-btn>
            <v-btn color="secondary" @click="closeFormDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      ]
    };
  },
  methods: {
    openFormDialog() {
      this.formDialog = true;
    },
    closeFormDialog() {
      this.formDialog = false;
      this.resetForm();
    },
    saveNewFA() {
      this.studentFA.push({ ...this.newFA });
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
    }
  }
};
</script>

<style scoped>
.content {
  padding: 20px;
}
</style>
