<template>
  <div>
    <page-header />
    <div class="content">
      <h1>Student Fines</h1>
      <v-container>
        <v-row>
          <v-col cols="4" v-for="(fine, index) in studentFines" :key="index">
            <v-card>
              <v-card-title>{{ fine.name }}</v-card-title>
              <v-card-text>
                <div>Event: {{ fine.event }}</div>
                <div>Fee per Entry: {{ fine.feePerEntry }}</div>
                <div>Total Fee: {{ fine.totalFee }}</div>
                <div>Date: {{ fine.date }}</div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="editFine(index)">Edit</v-btn>
                <v-btn color="error" @click="deleteFine(index)">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <!-- Add new fine box -->
          <v-col cols="4">
            <v-card class="d-flex align-center justify-center flex-column" @click="openAddDialog" style="height: 150px;">
              <v-icon large>mdi-plus</v-icon>
              <div>Create</div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- Add Fine Dialog -->
      <v-dialog v-model="addDialog" width="50%">
        <v-sheet>
          <v-card>
            <v-card-title>Add Student Fine</v-card-title>
            <v-card-text>
              <v-form ref="form">
                <v-text-field label="Name" v-model="newFine.name"></v-text-field>
                <v-text-field label="Event" v-model="newFine.event"></v-text-field>
                <v-text-field label="Fee per Entry" v-model="newFine.feePerEntry"></v-text-field>
                <v-text-field label="Total Fee" v-model="newFine.totalFee"></v-text-field>
                <v-text-field label="Date" v-model="newFine.date"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="addFine">Add</v-btn>
              <v-btn color="secondary" @click="closeAddDialog">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-dialog>
      <!-- Edit Fine Dialog -->
      <v-dialog v-model="editDialog" width="50%">
        <v-sheet>
          <v-card>
            <v-card-title>Edit Student Fine</v-card-title>
            <v-card-text>
              <v-form ref="editForm">
                <v-text-field label="Name" v-model="editedFine.name"></v-text-field>
                <v-text-field label="Event" v-model="editedFine.event"></v-text-field>
                <v-text-field label="Fee per Entry" v-model="editedFine.feePerEntry"></v-text-field>
                <v-text-field label="Total Fee" v-model="editedFine.totalFee"></v-text-field>
                <v-text-field label="Date" v-model="editedFine.date"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="updateFine">Update</v-btn>
              <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
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
      addDialog: false,
      editDialog: false,
      newFine: {
        name: '',
        event: '',
        feePerEntry: '',
        totalFee: '',
        date: ''
      },
      editedFine: {
        name: '',
        event: '',
        feePerEntry: '',
        totalFee: '',
        date: ''
      },
      studentFines: [
        { name: 'Al-shiolla Haron', event: 'Orientation', feePerEntry: '100', totalFee: '1000', date: '2024-06-01' },
        { name: 'Aiman Pumbaya', event: 'Acquaintance', feePerEntry: '200', totalFee: '2000', date: '2024-06-15' },
        { name: 'Sodais Macapantao', event: 'Kasadya', feePerEntry: '150', totalFee: '1500', date: '2024-06-20' }
      ],
      editIndex: null
    };
  },
  methods: {
    openAddDialog() {
      this.addDialog = true;
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    addFine() {
      this.studentFines.push({ ...this.newFine });
      this.newFine = { name: '', event: '', feePerEntry: '', totalFee: '', date: '' };
      this.closeAddDialog();
    },
    editFine(index) {
      this.editIndex = index;
      this.editedFine = { ...this.studentFines[index] };
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
    },
    updateFine() {
      if (this.editIndex !== null) {
        this.studentFines.splice(this.editIndex, 1, { ...this.editedFine });
        this.editIndex = null;
        this.closeEditDialog();
      }
    },
    deleteFine(index) {
      this.studentFines.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.content {
  padding: 20px;
}
</style>
