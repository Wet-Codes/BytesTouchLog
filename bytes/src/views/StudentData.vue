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
                <v-btn small color="primary" @click="editStudent">Edit</v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="studentAccountHeaders"
                  :items="studentAccounts"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Student FA Table -->
          <v-col cols="6">
            <v-card>
              <v-card-title class="d-flex justify-space-between align-center">
                <span>Student FA</span>
                <v-btn small color="success" @click="openUploadDialog">Upload</v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="studentFAHeaders"
                  :items="studentFA"
                  class="elevation-1"
                ></v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Upload Dialog -->
      <v-dialog v-model="uploadDialog" width="50%">
        <v-sheet>
          <v-card>
            <v-card-title>Upload Document</v-card-title>
            <v-card-text>
              <v-form>
                <v-file-input label="Select File"></v-file-input>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="uploadDocument">Upload</v-btn>
              <v-btn color="secondary" @click="closeUploadDialog">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
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
      uploadDialog: false,
      studentAccountHeaders: [
        { text: 'Fname', value: 'fname' },
        { text: 'M.I', value: 'mi' },
        { text: 'Lname', value: 'lname' },
        { text: 'Course', value: 'course' },
        { text: 'Year', value: 'year' }
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
        { text: 'All-Fund', value: 'allFund' }
      ],
      studentFA: [
        { event: 'Orientation', date: '2024-06-01', login: '08:00 AM', logout: '10:00 AM', allFund: '100' },
        { event: 'Acquaintance', date: '2024-06-15', login: '09:00 AM', logout: '11:00 AM', allFund: '200' },
        { event: 'Kasadya', date: '2024-06-20', login: '10:00 AM', logout: '12:00 PM', allFund: '150' }
      ]
    };
  },
  methods: {
    editStudent() {
      // Handle edit logic here
      console.log('Editing student');
    },
    openUploadDialog() {
      this.uploadDialog = true;
    },
    closeUploadDialog() {
      this.uploadDialog = false;
    },
    uploadDocument() {
      // Handle upload logic here
      console.log('Uploading document...');
      this.closeUploadDialog();
    }
  }
};
</script>

<style scoped>
.content {
  padding: 20px;
}
</style>
