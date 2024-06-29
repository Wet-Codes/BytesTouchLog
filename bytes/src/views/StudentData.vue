<template>
  <div>
    <page-header />
    <div class="content">
      <v-container>
        <v-row>
          <!-- Student Accounts Table -->
          <v-col cols="6">
            <v-card>
              <v-card-title>
                <div class="d-flex align-center justify-space-between">
                  <span>Student Accounts</span>
                  <v-btn small color="primary" @click="editStudentAccounts">Edit</v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="studentAccountHeaders"
                  :items="studentAccounts"
                  class="elevation-1"
                >
                  <template v-slot:item.action="{ item }">
                    <!-- No action buttons in the content -->
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Student FA Table -->
          <v-col cols="6">
            <v-card>
              <v-card-title>
                <div class="d-flex align-center justify-space-between">
                  <span>Student FA</span>
                  <v-btn small color="success" @click="uploadDocument">Upload</v-btn>
                </div>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="studentFAHeaders"
                  :items="studentFA"
                  class="elevation-1"
                >
                  <template v-slot:item.action="{ item }">
                    <!-- No action buttons in the content -->
                  </template>
                </v-data-table>
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

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      studentAccountHeaders: [
        { text: 'Fname', value: 'fname' },
        { text: 'M.I', value: 'mi' },
        { text: 'Lname', value: 'lname' },
        { text: 'Course', value: 'course' },
        { text: 'Year', value: 'year' },
        { text: 'Action', value: 'action', sortable: false }
      ],
      studentAccounts: [
        { fname: 'Al-shiolla', mi: 'H.', lname: 'Haron', course: 'IT', year: '3rd' },
        { fname: 'Aiman', mi: 'C.', lname: 'Pumbaya', course: 'IT', year: '3rd' },
        { fname: 'Sodais', mi: 'M.', lname: 'Macapantao', course: 'IT', year: '3rd' }
      ],
      studentFAHeaders: [
        { text: 'Event', value: 'event' },
        { text: 'Date', value: 'date' },
        { text: 'Login', value: 'login' },
        { text: 'Logout', value: 'logout' },
        { text: 'All-Fund', value: 'allFund' },
        { text: 'Action', value: 'action', sortable: false }
      ],
      studentFA: [
        { event: 'Orientation', date: '2024-06-01', login: '08:00 AM', logout: '10:00 AM', allFund: '100' },
        { event: 'Acquintance', date: '2024-06-15', login: '09:00 AM', logout: '11:00 AM', allFund: '200' },
        { event: 'Kasadya', date: '2024-06-20', login: '10:00 AM', logout: '12:00 PM', allFund: '150' }
      ]
    };
  },
  methods: {
    editStudentAccounts() {
      // Handle edit logic for student accounts
      console.log('Editing student accounts');
    },
    uploadDocument(item) {
      // Handle upload logic for student FA
      console.log('Uploading document for event:', item.event);
    }
  }
};
</script>

<style scoped>
.content {
  padding: 20px;
}

.align-center {
  display: flex;
  align-items: center;
}

.justify-space-between {
  justify-content: space-between;
}
</style>
