help me with this:
<template>
  <div>
    <page-header />
    <v-container>
      <v-card>
        <v-tabs v-model="tab" grow>
          <v-tab v-for="item in tabs" :key="item.key">
            <v-icon left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <!-- Add/Update Students Tab -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-form @submit.prevent="saveStudent">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="studentForm.id" label="Student ID" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="studentForm.firstName" label="First Name" outlined required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="studentForm.lastName" label="Last Name" outlined required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="studentForm.course"
                        :items="courses"
                        label="Course"
                        outlined
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="studentForm.yearLevel"
                        :items="yearLevels"
                        label="Year Level"
                        outlined
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-btn type="submit" color="primary" large :loading="loading">
                        {{ studentForm.id ? 'Update' : 'Add' }} Student
                      </v-btn>
                      <v-btn @click="resetForm" class="ml-2" outlined>Reset</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Update Status Tab -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-data-table
                  :headers="studentHeaders"
                  :items="students"
                  :loading="loading"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template #[`item.status`]="{ item }">
                    <v-chip :color="getStatusColor(item.status)" dark>
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template #[`item.actions`]="{ item }">
                    <v-select
                      v-model="item.status"
                      :items="statusOptions"
                      dense
                      @change="updateStatus(item)"
                    ></v-select>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Update Profile Tab -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="selectedStudent"
                      :items="students"
                      item-text="fullName"
                      item-value="id"
                      label="Select Student"
                      outlined
                      return-object
                    ></v-select>
                  </v-col>
                </v-row>
                <v-form v-if="selectedStudent" @submit.prevent="updateProfile">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="selectedStudent.email" label="Email" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="selectedStudent.phone" label="Phone Number" outlined></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-btn type="submit" color="primary" :loading="loading">Update Profile</v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Fingerprint Tab -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="fingerprintStudent"
                      :items="students"
                      item-text="fullName"
                      item-value="id"
                      label="Select Student"
                      outlined
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6" class="text-center">
                    <v-btn 
                      color="primary" 
                      large
                      @click="enrollFingerprint"
                      :disabled="!fingerprintStudent"
                      :loading="loading"
                    >
                      <v-icon left>mdi-fingerprint</v-icon>
                      {{ fingerprintStudent?.hasFingerprint ? 'Re-enroll' : 'Enroll' }} Fingerprint
                    </v-btn>
                  </v-col>
                  <v-col cols="12" v-if="fingerprintStudent && fingerprintStudent.hasFingerprint">
                    <v-alert type="success" outlined>
                      Fingerprint enrolled on {{ formatDate(fingerprintStudent.fingerprintDate) }}
                    </v-alert>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- Fines Management Tab -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-data-table
                  :headers="fineHeaders"
                  :items="studentsWithFines"
                  :loading="loading"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template #[`item.fineAmount`]="{ item }">
                    <v-edit-dialog
                     v-model:return-value="item.fineAmount"
                      @save="updateFine(item)"
                      large
                    >
                      ₱{{ item.fineAmount.toFixed(2) }}
                      <template v-slot:input>
                        <v-text-field
                          v-model.number="item.fineAmount"
                          type="number"
                          label="Amount"
                          single-line
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template #[`item.actions`]="{ item }">
                    <v-btn 
                      small 
                      color="success"
                      @click="markAsPaid(item)"
                    >
                      Mark as Paid
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeaderNav.vue';
import { format } from 'date-fns';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      tab: null,
      tabs: [
        { key: 'add', title: 'Add/Update Students', icon: 'mdi-account-plus' },
        { key: 'status', title: 'Update Status', icon: 'mdi-school' },
        { key: 'profile', title: 'Update Profile', icon: 'mdi-account-cog' },
        { key: 'fingerprint', title: 'Fingerprint', icon: 'mdi-fingerprint' },
        { key: 'fines', title: 'Manage Fines', icon: 'mdi-cash-multiple' }
      ],
      studentForm: {
        id: null,
        firstName: '',
        lastName: '',
        course: '',
        yearLevel: ''
      },
      courses: ['BSIT', 'BSCS', 'BSIS', 'BSECE', 'BSME'],
      yearLevels: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
      students: [],
      selectedStudent: null,
      fingerprintStudent: null,
      loading: false,
      error: null,
      studentHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Full Name', value: 'fullName' },
        { text: 'Course', value: 'course' },
        { text: 'Year', value: 'yearLevel' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      statusOptions: ['Regular', 'Irregular', 'Shifted', 'Graduated', 'Dropped'],
      fineHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'fullName' },
        { text: 'Fine Amount', value: 'fineAmount' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    studentsWithFines() {
      return this.students.filter(student => student.fineAmount > 0);
    }
  },
  created() {
    this.loadStudents();
  },
  methods: {
    async loadStudents() {
      this.loading = true;
      try {
        // Replace with actual API call
        const response = await this.$api.get('/students');
        this.students = response.data.map(student => ({
          ...student,
          fullName: `${student.firstName} ${student.lastName}`,
          fineAmount: student.fines || 0,
          hasFingerprint: !!student.fingerprintId,
          fingerprintDate: student.fingerprintDate || null
        }));
      } catch (error) {
        this.error = 'Failed to load students';
        console.error('Error loading students:', error);
      } finally {
        this.loading = false;
      }
    },
    async saveStudent() {
      this.loading = true;
      try {
        const studentData = {
          ...this.studentForm,
          fines: 0,
          status: 'Regular'
        };

        if (this.studentForm.id) {
          await this.$api.put(`/students/${this.studentForm.id}`, studentData);
          this.$toast.success('Student updated successfully');
        } else {
          await this.$api.post('/students', studentData);
          this.$toast.success('Student added successfully');
        }
        this.resetForm();
        await this.loadStudents();
      } catch (error) {
        this.$toast.error('Error saving student');
        console.error('Error saving student:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(student) {
      this.loading = true;
      try {
        await this.$api.patch(`/students/${student.id}/status`, { 
          status: student.status 
        });
        this.$toast.success('Status updated successfully');
      } catch (error) {
        this.$toast.error('Error updating status');
        console.error('Error updating status:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateProfile() {
      this.loading = true;
      try {
        await this.$api.put(`/students/${this.selectedStudent.id}`, {
          email: this.selectedStudent.email,
          phone: this.selectedStudent.phone
        });
        this.$toast.success('Profile updated successfully');
        await this.loadStudents();
      } catch (error) {
        this.$toast.error('Error updating profile');
        console.error('Error updating profile:', error);
      } finally {
        this.loading = false;
      }
    },
    enrollFingerprint() {
      this.$router.push({
        name: 'fingerprint',
        params: { studentId: this.fingerprintStudent.id }
      });
    },
    async updateFine(student) {
      this.loading = true;
      try {
        await this.$api.patch(`/students/${student.id}/fines`, { 
          amount: student.fineAmount 
        });
        this.$toast.success('Fine updated successfully');
      } catch (error) {
        this.$toast.error('Error updating fine');
        console.error('Error updating fine:', error);
      } finally {
        this.loading = false;
      }
    },
    async markAsPaid(student) {
      this.loading = true;
      try {
        await this.$api.patch(`/students/${student.id}/fines`, { 
          amount: 0 
        });
        this.$toast.success('Fine marked as paid');
        await this.loadStudents();
      } catch (error) {
        this.$toast.error('Error updating fine');
        console.error('Error updating fine:', error);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.studentForm = {
        id: null,
        firstName: '',
        lastName: '',
        course: '',
        yearLevel: ''
      };
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
    formatDate(dateString) {
      return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : 'N/A';
    }
  }
};
</script>

<style scoped>
.v-tab {
  font-weight: 500;
  letter-spacing: 0.5px;
}
.v-card {
  border-radius: 8px;
  overflow: hidden;
}
.v-data-table {
  margin-top: 16px;
}
.v-alert {
  margin-top: 16px;
}


</style>
