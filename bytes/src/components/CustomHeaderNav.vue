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

    <v-toolbar-items>
      <v-chip class="ma-2" :color="roleColor" text-color="white">
        <v-icon left>mdi-account</v-icon>
        {{ roleText }}
      </v-chip>
    </v-toolbar-items>


    <v-spacer></v-spacer>

    <!-- Right Side Buttons -->
   <v-toolbar-items>
      <v-btn :to="{ name: 'AccountList' }" class="toolbar-btn">
      <v-icon>mdi-account</v-icon> <!-- Updated to About icon -->
      <span class="toolbar-text">Account List</span>
      </v-btn>
    </v-toolbar-items>
      
     

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
          <p>Bytes Touchlog is an efficient attendance system designed for Bytes officers to streamline student attendance tracking during events. This user-friendly system simplifies the check-in process, ensuring accurate and real-time recording of participants. With Bytes Touchlog, officers can quickly verify attendance, reduce manual errors, and generate reports effortlessly, making event management smoother and more organized. Ideal for tech-driven environments, it enhances accountability and saves time, allowing officers to focus on delivering a seamless event experience<span 
            class="secret-link"
            @click="handleSecretClick"
          >.</span></p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showAboutDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <v-dialog v-model="showDevAuthDialog" max-width="500">
      <v-card class="dark-card">
        <v-card-title>Dev Authentication Required</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="devPassword"
            type="password"
            label="Enter Dev Password"
            outlined
            @keyup.enter="verifyDevAccess"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="showDevAuthDialog = false">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="verifyDevAccess">Verify</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <!-- logout dialog-->
    <v-dialog v-model="showLogoutDialog" max-width="500">
      <v-card class="dark-card">
        <v-card-title>Confirm Logout</v-card-title>
        <v-card-text>
          Are you sure you want to log out?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmLogout">Logout</v-btn>
          <v-btn @click="showLogoutDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    
  </v-toolbar>
</template>

<script>
import AuthServices from '../services/AuthServices';
export default {
   computed: {
      roleText() {
      if (!this.$store.getters.isAuthenticated) return 'Guest';
      return this.$store.getters.userRole === 'admin' ? 'Administrator' : 'User';
    },
    roleColor() {
      if (!this.$store.getters.isAuthenticated) return 'grey';
      return this.$store.getters.userRole === 'admin' ? 'green' : 'blue';
    }
  },
  data() {
    return {
      showDevAuthDialog: false,
      showLogoutDialog: false,
      showNoteDialog: false,
      showAboutDialog: false,
      note: '',
       devPassword: '',
    };
  },
  
  methods: {
    logout() {
      this.showLogoutDialog = true;
    },
    async confirmLogout(){
      try {
        await this.$store.dispatch('logout');
        this.showLogoutDialog = false;
        this.$router.push({ name: 'login' });
        window.location.reload(); // Clear cached state
      } catch (error) {
        console.error('Logout failed:', error);
      }
    
    },
    
    
    saveNote() {
      alert('Note saved successfully!');
      this.showNoteDialog = false;
    },

    handleSecretClick() {
      if (this.$store.getters.currentUser?.username === 'dev') {
        this.showDevAuthDialog = true;
      } else {
      alert('⚠️ Restricted Feature\nOnly dev account can access this');
      this.$router.push('/home');
    }
    },

    async verifyDevAccess() {
      try {
        const cleanPassword = this.devPassword.trim();
        
        if (!cleanPassword) {
          alert('Please enter dev password');
          return;
        }

        await AuthServices.verifyDevPassword(cleanPassword);
        
        sessionStorage.setItem('devVerified', 'true');
        this.showDevAuthDialog = false;
        this.devPassword = '';
        this.$router.push({ name: 'AccountManagement' });
      } catch (error) {
        this.devPassword = '';
        const message = error.response?.data?.error || error.message;
        console.error('Dev verification error:', error);
        alert(`🚫 Verification Failed\n${message}`);
        this.showDevAuthDialog = false;
      }
    },
  }
};
</script>

<style scoped>
.role-status {
  display: flex;
  align-items: center;
  margin: 0 15px;
  font-size: 0.9rem;
}
.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
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

.v-card-text .v-messages__message {
  color: #ff5252 !important;
  font-size: 0.8rem;
}

.secret-link {
  cursor: pointer;
  color: transparent !important;
  position: relative;
}

.secret-link:hover::after {
  content: "🔒";
  position: absolute;
  color: #289bb8;
  right: -5px;
  bottom: -5px;
  font-size: 0.8em;
}

</style>