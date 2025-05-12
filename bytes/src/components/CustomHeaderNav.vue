<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <!-- Left Side Buttons -->
    <v-toolbar-items>
      <v-btn @click="showNoteDialog = true" class="toolbar-btn">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/note.png" alt="Note Icon" class="icon">
        <span class="toolbar-text">Note</span>
      </v-btn>
    </v-toolbar-items>

    <v-toolbar-items>
      <v-btn @click="showAboutDialog = true" class="toolbar-btn">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/info.png" alt="About Icon" class="icon">
        <span class="toolbar-text">About</span>
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <!-- Right Side Buttons -->
    <v-toolbar-items>
      <v-btn class="toolbar-btn" @click="logout">
        <img src="https://img.icons8.com/ios-filled/50/ffffff/logout-rounded-left.png" alt="Logout Icon" class="icon">
        <span class="toolbar-text">Logout</span>
      </v-btn>
    </v-toolbar-items>

    <!-- Note Dialog -->
    <v-dialog v-model="showNoteDialog" max-width="500">
      <v-card class="dark-card">
        <v-card-title>Quick Note</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="note"
            outlined
            placeholder="Type your notes here..."
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveNote">Save</v-btn>
          <v-btn @click="showNoteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- About Dialog -->
    <v-dialog v-model="showAboutDialog" max-width="500">
      <v-card class="dark-card">
        <v-card-title>About Bytes Touchlog</v-card-title>
        <v-card-text>
          <p>Bytes Touchlog is an efficient attendance system designed for Bytes officers to streamline student attendance tracking during events. This user-friendly system simplifies the check-in process, ensuring accurate and real-time recording of participants. With Bytes Touchlog, officers can quickly verify attendance, reduce manual errors, and generate reports effortlessly, making event management smoother and more organized. Ideal for tech-driven environments, it enhances accountability and saves time, allowing officers to focus on delivering a seamless event experience.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showAboutDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
export default {
  data() {
    return {
      showNoteDialog: false,
      showAboutDialog: false,
      note: ''
    };
  },
  methods: {
    logout() {
      this.$router.push({ name: 'login' });
    },
    saveNote() {
      alert('Note saved successfully!');
      this.showNoteDialog = false;
    }
  }
};
</script>

<style scoped>
.toolbar-btn {
  color: white !important;
  font-family: 'Times New Roman', Times, serif;
  margin: 0 8px;
}

.icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.dark-card {
  background: #1E1E1E;
  color: white;
}
</style>