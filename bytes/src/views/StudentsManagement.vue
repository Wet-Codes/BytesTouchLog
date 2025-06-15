<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
      

        <!-- Confirmation Dialog -->
        <v-dialog v-model="actionDialog" persistent max-width="500">
          <v-card class="dark-card">
            <v-card-title class="text-h5">{{ dialogTitle }}</v-card-title>
            <v-card-text>{{ dialogMessage }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" @click="actionDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="confirmAction">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Delete All Confirmation Dialog -->
        <v-dialog v-model="deleteAllDialog" persistent max-width="500">
          <v-card class="dark-card">
            <v-card-title class="text-h5">Confirm Delete All Students</v-card-title>
            <v-card-text>This will permanently delete all student records. Are you sure?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" @click="deleteAllDialog = false">Cancel</v-btn>
              <v-btn color="error" @click="removeAllStudents">Confirm Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <h1 class="table-title">Student Management</h1>
                <div>
                  <v-btn 
                    color="error" 
                    dark
                    @click="deleteAllDialog = true"
                    class="mr-2"
                  >
                    <v-icon left>mdi-delete</v-icon>
                    Remove All
                  </v-btn>
                  <v-btn 
                    color="primary" 
                    dark
                    @click="openUploadDialog"
                  >
                    <v-icon left>mdi-upload</v-icon>
                    Upload Students
                  </v-btn>
                </div>
              </v-card-title>
              
              <v-card-text>
                <v-row>
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

                        <!-- Student List Header -->
                        <div class="student-list-header">
                          <span class="col-fname">First Name</span>
                          <span class="col-lname">Last Name</span>
                          <span class="col-course">Course</span>
                          <span class="col-year">Year Level</span>
                          <span class="col-status">Status</span>
                          <span class="col-actions">Actions</span>
                        </div>

                        <!-- Student Table -->
                        <v-data-table
                          :headers="studentHeaders"
                          :items="filteredStudents"
                          :items-per-page="10"
                          class="elevation-1 student-fines-table"
                          dark
                          hide-default-header
                          :loading="loadingStudents"
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

                                     <!-- The buttons -->

                                  <!-- View button -->
                                  <td class="col-actions text-center">
                                    <div class="action-buttons">
                                      <v-btn 
                                        small 
                                        color="primary" 
                                        @click="viewStudent(item);" 
                                        class="action-btn"
                                        :disabled="isStudentLocked(item)"
                                      >
                                        {{ selectedStudent && selectedStudent.id === item.id ? 'Hide' : 'View' }}
                                      </v-btn>

                                      <!-- Update button -->
                                      <v-btn 
                                        small 
                                        color="warning" 
                                        @click="editStudent(item);" 
                                        class="action-btn"
                                        :disabled="isStudentLocked(item)"
                                      >
                                        Update
                                      </v-btn>

                                     
                                    </div>
                                  </td>
                                </tr>
                              </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Student Details Panel -->
                  <v-col v-if="selectedStudent" cols="4">
                    <v-card class="right-side-card">
                      <div class="details-header">
                        <v-card-title class="details-title">
                          {{ selectedStudent.fname }} {{ selectedStudent.lname }}'s Details
                        </v-card-title>
                      </div>
                      <v-card-text>
                        <!-- Student Info Edit Form -->
                        <v-form v-if="isEditing" @submit.prevent="saveStudent">
                          <v-text-field 
                            v-model="editForm.fname" 
                            label="First Name" 
                            outlined 
                            dense 
                            class="mb-2"
                            :rules="[v => !!v || 'First name is required']"
                          ></v-text-field>
                          <v-text-field 
                            v-model="editForm.lname" 
                            label="Last Name" 
                            outlined 
                            dense 
                            class="mb-2"
                            :rules="[v => !!v || 'Last name is required']"
                          ></v-text-field>
                          <v-text-field 
                            v-model="editForm.mi" 
                            label="Middle Initial" 
                            outlined 
                            dense 
                            class="mb-2"
                          ></v-text-field>
                          <v-select
                            v-model="editForm.course"
                            :items="courses.filter(c => c !== 'All')"
                            label="Course"
                            outlined
                            dense
                            class="mb-2"
                            :rules="[v => !!v || 'Course is required']"
                          ></v-select>
                          <v-select
                            v-model="editForm.year"
                            :items="yearLevels.filter(y => y !== 'All')"
                            label="Year Level"
                            outlined
                            dense
                            class="mb-2"
                            :rules="[v => !!v || 'Year level is required']"
                          ></v-select>
                          <v-select
                            v-model="editForm.status"
                            :items="statusOptions"
                            label="Status"
                            outlined
                            dense
                            class="mb-2"
                            :rules="[v => !!v || 'Status is required']"
                          ></v-select>
                          <div class="d-flex justify-end">
                            <v-btn type="submit" color="success" small :loading="savingStudent">Save</v-btn>
                            <v-btn @click="cancelEdit" small class="ml-2">Cancel</v-btn>
                          </div>
                        </v-form>

                        <!-- Student Info Display -->
                        <template v-else>
                          <div class="student-info mb-4">
                            <p><strong>Course:</strong> {{ selectedStudent.course }}</p>
                            <p><strong>Year Level:</strong> {{ selectedStudent.year }}</p>
                            <p><strong>Status:</strong> 
                              <v-chip small :color="getStatusColor(selectedStudent.status)">{{ selectedStudent.status }}</v-chip>
                            </p>
                          </div>

                          <!-- Fine Details -->
                          <div class="fine-details-header">
                            <span class="col-event">Event</span>
                            <span class="col-fine">Fine Amount</span>
                            <span class="col-status">Status</span>
                          </div>
                          <v-data-table
                            :headers="fineDetailsHeaders"
                            :items="fineDetails"
                            :hide-default-footer="true"
                            class="elevation-1 fine-details-table"
                            dark
                            hide-default-header
                            :loading="loadingFines"
                          >
                            <template #[`item.status`]="{ item }">
                              <v-chip small :color="item.paid ? 'green' : 'red'">
                                {{ item.paid ? 'Paid' : 'Unpaid' }}
                              </v-chip>
                            </template>
                            <template #[`item.actions`]="{ item }">
                              <v-btn 
                                x-small 
                                color="error" 
                                @click="initiateAction('removeFine', item)"
                                :loading="deletingFine === item._id"
                              >
                                Remove
                              </v-btn>
                            </template>
                          </v-data-table>
                          <div class="total-fines">
                            <strong>Total Unpaid Fines: ₱{{ calculateTotalUnpaidFines().toFixed(2) }}</strong>
                          </div>
                          <div class="d-flex mt-4">
                            <v-btn 
                              color="success" 
                              class="paid-btn"
                              @click="initiateAction('clearFines', selectedStudent)"
                              :disabled="fineDetails.length === 0 || !hasUnpaidFines"
                              :loading="clearingFines"
                            >
                              Mark All as Paid
                            </v-btn>
                          </div>
                        </template>
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
import StudentService from '@/services/AuthServices';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      search: '',
      welcomeDialog: false,
      actionDialog: false,
      deleteAllDialog: false,
      dialogTitle: '',
      dialogMessage: '',
      currentAction: null,
      selectedStudent: null,
      isEditing: false,
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      filter: {
        course: null,
        yearLevel: null,
      },
      editForm: {},
      statusOptions: ['Regular', 'Irregular', 'Shifted', 'Graduated', 'Dropped'],
      fineDetails: [],
      courses: ['All', 'BSIT', 'BSIS', 'BSCS', 
               'BS Information Technology (Network Systems)', 
               'BS Information Technology (Database Systems)'],
      yearLevels: ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'],
      //Student Header
      studentFinesHeaders: [
        { text: 'First Name', value: 'firstName', align: 'center', width: '15%' },
        { text: 'M.I.', value: 'middleInitial', align: 'center', width: '5%' },
        { text: 'Last Name', value: 'lastName', align: 'center', width: '15%' },
        { text: 'Course', value: 'department', align: 'center', width: '15%' },
        { text: 'Year Level', value: 'yearLevel', align: 'center', width: '15%' },
        { text: 'Status', value: 'status', align: 'center', width: '15%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '20%', sortable: false }
      ],
      fineDetailsHeaders: [
        { text: 'Event Name', value: 'event.name', align: 'center', width: '40%' },
        { text: 'Fine Amount', value: 'amount', align: 'center', width: '30%' },
        { text: 'Status', value: 'status', align: 'center', width: '20%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '10%' }
      ],
      students: [],
      loadingStudents: false,
      loadingFines: false,
      savingStudent: false,
      clearingFines: false,
      deletingFine: null
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
    hasUnpaidFines() {
      return this.fineDetails.some(fine => !fine.paid);
    }
  },
  async mounted() {
    await this.fetchStudents();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
     isStudentLocked(student) {
      return student.isLocked || ['Graduated', 'Shifted', 'Dropped'].includes(student.status);
    },
    async fetchStudents() {
      this.loadingStudents = true;
      try {
        // Log: Frontend is requesting all students
        console.log('Fetching all students from backend');
        const response = await StudentService.getStudents();
        this.students = response.data;
      } catch (error) {
        console.error('Error:', error);
        this.dialogTitle = 'Error';
        this.dialogMessage = 'Failed to load students';
        this.actionDialog = true;
      } finally {
        this.loadingStudents = false;
      }
    },
    
    async fetchFines(studentId) {
      this.loadingFines = true;
      try {
        // Log: Frontend is requesting fines for specific student
        console.log(`Fetching fines for student ID: ${studentId}`);
        const response = await StudentService.getStudentFines(studentId);
        this.fineDetails = response.data.filter(fine => 
          fine.status === 'absent' || fine.status === 'unpaid'
        );
      } catch (error) {
        console.error('Error fetching fines:', error);
        this.dialogTitle = 'Error';
        this.dialogMessage = 'Failed to load fines';
        this.actionDialog = true;
      } finally {
        this.loadingFines = false;
      }
    },

    initiateAction(actionType, item) {
      this.currentAction = { 
        type: actionType, 
        item: { ...item },
        id: item._id || item.id
      };
      
      const messages = {
        removeFine: `Remove fine for ${this.selectedStudent.fname} ${this.selectedStudent.lname}?`,
        clearFines: `Mark all fines as paid for ${this.selectedStudent.fname} ${this.selectedStudent.lname}?`,
        deleteAll: 'Permanently delete all student records? This cannot be undone!',
        edit: 'Save changes to this student?'
      };

      this.dialogTitle = `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Confirmation`;
      this.dialogMessage = messages[actionType];
      this.actionDialog = true;
    },

    async confirmAction() {
      this.actionDialog = false;

      if (!this.currentAction || !this.currentAction.type) {
        console.error('No valid currentAction provided.');
        this.dialogTitle = 'Error';
        this.dialogMessage = 'No action was selected or the action is invalid.';
        this.actionDialog = true;
        return;
      }

      try {
        switch (this.currentAction.type) {
          case 'removeFine':
            await this.removeFine();
            break;
          case 'clearFines':
            await this.clearFines();
            break;
          case 'deleteAll':
            await this.removeAllStudents();
            break;
          case 'edit':
            await this.saveStudent();
            break;
          default:
            this.dialogTitle = 'Error';
            this.dialogMessage = `Unknown action type: ${this.currentAction.type}`;
            this.actionDialog = true;
            break;
        }
      } catch (error) {
        console.error('Action failed:', error);
        this.dialogTitle = 'Error';
        this.dialogMessage = 'Action failed. Please try again.';
        this.actionDialog = true;
      }
    },

    async removeFine() {
      this.deletingFine = this.currentAction.id;
      try {
        // Log: Frontend is deleting a fine
        console.log(`Deleting fine ID: ${this.currentAction.id}`);
        await StudentService.deleteFine(this.currentAction.id);
        this.fineDetails = this.fineDetails.filter(f => f._id !== this.currentAction.id);
        this.dialogTitle = 'Success';
        this.dialogMessage = 'Fine removed successfully';
      } catch (error) {
        console.error('Error:', error);
        this.dialogTitle = 'Error';
        this.dialogMessage = 'Failed to remove fine';
      } finally {
        this.deletingFine = null;
        this.actionDialog = true;
      }
    },

    async clearFines() {
      this.clearingFines = true;
      try {
        // Log: Frontend is clearing fines for student
        console.log(`Clearing fines for student ID: ${this.currentAction.id}`);
        await StudentService.clearStudentFines(this.currentAction.id);
        await this.fetchFines(this.selectedStudent._id);
        this.dialogTitle = 'Success';
        this.dialogMessage = 'All fines marked as paid';
      } catch (error) {
        console.error('Error clearing fines:', error);
        this.dialogTitle = 'Error';
        this.dialogMessage = 'Failed to mark fines as paid';
      } finally {
        this.clearingFines = false;
        this.actionDialog = true;
      }
    },

    async removeAllStudents() {
      this.deleteAllDialog = false;
      try {
        // Log: Frontend is deleting all students
        console.log('Deleting all student records');
        await StudentService.deleteAllStudents();
        this.students = [];
        this.dialogTitle = 'Success';
        this.dialogMessage = 'All student data has been deleted';
      } catch (error) {
        console.error('Delete error:', error);
        this.dialogTitle = 'Error';
        this.dialogMessage = 'Failed to delete data';
      } finally {
        this.actionDialog = true;
      }
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
    
    calculateTotalUnpaidFines() {
      return this.fineDetails
        .filter(fine => !fine.paid)
        .reduce((sum, fine) => sum + fine.amount, 0);
    },
    
    viewStudent(student) {
      if (this.selectedStudent && this.selectedStudent._id === student._id) {
        this.selectedStudent = null;
        this.isEditing = false;
        this.fineDetails = [];
      } else {
        this.selectedStudent = student;
        this.isEditing = false;
        this.fetchFines(student._id);
      }
    },
    
    editStudent(student) {
      this.selectedStudent = student;
      this.isEditing = true;
      this.editForm = { ...student };
    },
    
    async saveStudent() {
      this.savingStudent = true;
      try {
        // Log: Frontend is updating student
        console.log(`Updating student ID: ${this.editForm._id}`, this.editForm);
        await StudentService.updateStudent(this.editForm._id, this.editForm);
        await this.fetchStudents();
        this.isEditing = false;
        this.dialogTitle = 'Success';
        this.dialogMessage = 'Student updated successfully';
      } catch (error) {
        console.error('Update error:', error);
        this.dialogTitle = 'Error';
        this.dialogMessage = 'Failed to update student';
      } finally {
        this.savingStudent = false;
        this.actionDialog = true;
      }
    },
    
    cancelEdit() {
      this.isEditing = false;
    },
    
    openUploadDialog() {
      // Implement similar to AccountList if needed
      console.log('Upload dialog would open here');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

.dark-card {
  background: rgba(0, 0, 0, 0.9);
  color: white;
}

.page-title {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  margin-top: 20px;
}

.table-title {
  color: white;
  font-size: 2rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.fine-card {
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  color: white;
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
}

.student-list-header span {
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  text-align: center !important;
  vertical-align: middle !important;
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
  text-align: center !important;
  vertical-align: middle !important;
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

.details-title {
  font-size: 1.5rem !important;
  padding: 16px !important;
  white-space: normal;
  word-break: break-word;
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

.student-info {
  padding: 16px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 16px;
}

.student-info p {
  margin-bottom: 8px;
}

.paid-btn {
  background-color: #4CAF50 !important;
  color: white !important;
}

@media (max-width: 960px) {
  .action-buttons {
    flex-direction: column;
    gap: 4px;
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