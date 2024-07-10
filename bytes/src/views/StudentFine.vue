<template>
  <div>
    <page-header />
    <div :style="mainContentStyle">
      <h1 class="page-title">Student Fines</h1>
      <v-container>
        <v-row>
          <v-col cols="4" v-for="(fine, index) in studentFines" :key="index">
            <v-card class="fine-card">
              <v-card-title class="white--text">{{ fine.name }}</v-card-title>
              <v-card-text class="white--text">
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
            <v-card class="d-flex align-center justify-center flex-column fine-card" @click="openAddDialog" style="height: 150px;">
              <v-icon large>mdi-plus</v-icon>
              <div class="white--text">Create</div>
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
  computed: {
    mainContentStyle() {
      return {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        backgroundImage: `url('https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20px',
      };
    }
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
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(#30142b, #2772a1);
}

.page-title {
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  margin-top: 20px; /* Adjust this value to control the space from the top */
}

.fine-card {
  background: rgba(0, 0, 0, .5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;
  color: white;
}

.v-card-title {
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
