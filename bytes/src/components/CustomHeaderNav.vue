<template>
  <v-toolbar :elevation="8" dark prominent style="background-color: navy;">
    <!-- Left Side Buttons -->
    <v-toolbar-items>
        <v-btn @click="showNoteDialog = true" class="toolbar-btn">
      <v-badge
  :content="unreadCount"
  :value="unreadCount > 0"
  color="red"
  overlap
>
  
    <img src="https://img.icons8.com/ios-filled/50/ffffff/note.png" alt="Note Icon" class="icon">
    
  
</v-badge>
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

     
     <!-- Announcements Dialog -->
    <v-dialog v-model="showNoteDialog" max-width="700" @click:outside="markNotesRead">
      <v-card class="dark-card">
       <v-card-title class="d-flex justify-space-between align-center">
  <span>Announcements</span>
  <div>
    <v-btn
      v-if="unreadCount > 0"
      color="green"
      @click="markNotesRead"
      small
    >
      <v-icon left small>mdi-check</v-icon>
      Mark all as read
    </v-btn>
    <v-btn 
      v-if="isAdmin"
      color="primary"
      @click="showNewNoteDialog = true"
      small
    >
      <v-icon left small>mdi-plus</v-icon>
      New Note
    </v-btn>
  </div>
</v-card-title>
        
        <v-divider class="mb-4"></v-divider>
        
        <v-card-text v-if="notes.length === 0" class="text-center py-8">
          <v-icon size="64" color="#289bb8">mdi-inbox</v-icon>
          <p class="text-h6 mt-4">No announcements yet</p>
          <p class="text-caption">Check back later for updates</p>
        </v-card-text>
        
       <v-list v-else dense class="transparent pa-0">
  <v-list-item 
    v-for="note in notes" 
    :key="note.id"
    class="mb-2 note-item"
    :class="{'unread-note': isUnread(note)}"
    @click="viewNote(note)"
  >
    <v-list-item-title class="d-flex align-center">
      <v-icon small left color="#289bb8">mdi-account</v-icon>
      <strong>{{ note.author.username }}</strong>
      <v-spacer></v-spacer>
      <span class="text-caption">{{ formatDate(note.createdAt) }}</span>
    </v-list-item-title>
    <v-list-item-subtitle class="mt-2 note-content">
      {{ truncateText(note.content, 100) }}
    </v-list-item-subtitle>
  </v-list-item>
</v-list>

      </v-card>
    </v-dialog>

    <!-- New Note Dialog -->
    <v-dialog v-model="showNewNoteDialog" max-width="500">
      <v-card class="dark-card">
        <v-card-title>Create New Announcement</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="newNoteContent"
            outlined
            placeholder="Type your announcement here..."
            counter="500"
            :rules="[v => !!v || 'Content is required']"
            background-color="#1a1a2e"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="createNote">Create</v-btn>
          <v-btn @click="showNewNoteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Note Detail Dialog -->
    <v-dialog v-model="viewNoteDialog" max-width="700">
      <v-card class="dark-card">
        <v-card-title class="d-flex align-center">
          <v-icon left color="#289bb8">mdi-note-text</v-icon>
          Announcement Details
          <v-spacer></v-spacer>
          <span class="text-caption">{{ formatDate(selectedNote.createdAt) }}</span>
        </v-card-title>
        
        <v-divider class="mb-4"></v-divider>
        
        <v-card-text>
          <div class="author-info mb-4">
            <v-icon small left color="#289bb8">mdi-account</v-icon>
            <strong>{{ selectedNote.author.username }}</strong>
          </div>
          
          <div class="note-content-full">
            {{ selectedNote.content }}
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="viewNoteDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ResponseDialog -->
    <v-dialog v-model="responseDialog" max-width="400">
  <v-card
    :class="{
      'response-card': true,
      'response-success': responseType === 'success',
      'response-error': responseType === 'error',
      'response-info': responseType === 'info'
    }"
  >
    <v-card-title class="d-flex align-center">
      <v-icon left class="mr-2">{{ responseIcon }}</v-icon>
      <span class="text-subtitle-1">{{ responseTitle }}</span>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="py-4">
      {{ responseMessage }}
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="responseDialog = false">OK</v-btn>
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
          <v-btn color="primary" :loading="isLoggingOut" :disabled="isLoggingOut" @click="confirmLogout">
  <span v-if="!isLoggingOut">Logout</span>
  <span v-else>Logging out...</span>
</v-btn>
          <v-btn @click="showLogoutDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    
  </v-toolbar>
</template>

<script>
import AuthServices from '../services/AuthServices';
import { getClientIP } from '@/services/ipService';
export default {
   computed: {
      roleText() {
      if (!this.$store.getters.isAuthenticated) return 'Guest';
      return this.$store.getters.userRole === 'admin' ? 'Administrator' : 'User';
    },
    roleColor() {
      if (!this.$store.getters.isAuthenticated) return 'grey';
      return this.$store.getters.userRole === 'admin' ? 'green' : 'blue';
    },
     isAdmin() {
      return this.$store.getters.userRole === 'admin';
    },
    unreadCount() {
      return this.notes.filter(note => 
        new Date(note.createdAt) > new Date(this.lastRead)
      ).length;
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
       isLoggingOut: false, // <- new state
       isCreatingNote: false,
      showNewNoteDialog: false,
      newNoteContent: '',
      notes: [],
      lastRead: null,
      viewNoteDialog: false,
      responseDialog: false,
      responseType: '',
      responseTitle: '',
      responseMessage: '',
      responseIcon: '',
      selectedNote: {
        id: null,
        content: '',
        createdAt: new Date(),
        author: { username: '' }
      }
    };
  },
   mounted() {
    this.fetchNotes().then(() => {
      this.lastRead = this.$store.getters.currentUser?.lastNoteReadAt || new Date();

      if (this.$socket) {
        this.$socket.on('new-note', this.handleNewNote);
      }
    });
  },
  beforeUnmount() {
    if (this.$socket) {
      this.$socket.off('new-note', this.handleNewNote);
    }
  },
  methods: {

  handleNewNote(note) {
  this.notes.unshift(note);

  if (!this.showNoteDialog) {
    this.showResponse('info', 'New Announcement', 'A new announcement has been posted');
  }

  this.$nextTick(() => {
    const dialogContent = document.querySelector('.v-card-text');
    if (dialogContent) dialogContent.scrollTop = 0;
  });
},
    showResponse(type, title, message) {
  this.responseType = type;
  this.responseTitle = title;
  this.responseMessage = message;
  this.responseIcon = type === 'success'
    ? 'mdi-check-circle'
    : type === 'error'
    ? 'mdi-alert-circle'
    : 'mdi-bell-ring-outline'; // Custom icon for 'info'
  this.responseDialog = true;
}
,
    async fetchNotes() {
      try {
        const response = await AuthServices.getNotes();
        this.notes = response.data;
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    },
    async markNotesRead() {
      if (this.unreadCount > 0) {
        try {
          await AuthServices.markNotesRead();
          this.lastRead = new Date();
        } catch (error) {
          console.error('Error marking notes read:', error);
        }
      }
      
    },
    
    async createNote() {
  if (!this.newNoteContent.trim()) return;
       this.isCreatingNote = true;
  try {
    const response = await AuthServices.createNote(this.newNoteContent);
    const createdNote = response.data;

    this.notes.unshift(createdNote); // 💥 Show instantly for creator
    this.$socket.emit('new-note', createdNote); // 💥 Still emit to others

    this.showNewNoteDialog = false;
    this.newNoteContent = '';
    this.showResponse('success', 'Success', 'Announcement created successfully!');
  } catch (error) {
    console.error('Error creating note:', error);
    this.showResponse('error', 'Error', 'Failed to create announcement');
  }
},
    viewNote(note) {
      this.selectedNote = note;
      this.viewNoteDialog = true;
      
      // Mark as read if it's unread
      if (this.isUnread(note)) {
        this.markNotesRead();
      }
    },
    isUnread(note) {
      return new Date(note.createdAt) > new Date(this.lastRead);
    },
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    logout() {
      this.showLogoutDialog = true;
    },
       async confirmLogout() {
         this.isLoggingOut = true;
  try {
    const deviceInfo = {
      ip: await getClientIP(),
      device: navigator.userAgent
    };

    await AuthServices.recordLogout({
      ip: deviceInfo.ip,
      device: deviceInfo.device
    });

    await this.$store.dispatch('logout');

    this.showLogoutDialog = false;
    // this.$router.push({ name: 'login' }); ← optional
   } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.isLoggingOut = false;
    }
  },
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


/* Dialog Card Styling */
.dark-card {
  background: #121212 !important;
  color: #e0f7fa !important;
  border: 1px solid #1e3a5f;
  border-radius: 8px;
}
.dark-card .v-card-text {
  max-height: 400px; /* or more */
  overflow-y: auto;
}


/* Transparent List */
.v-list.transparent {
  background-color: transparent !important;
  padding: 0 !important;
}

/* List Item Styles */
.v-list-item {
  background-color: rgba(15, 23, 42, 0.8) !important;
  color: #cfd8dc !important;
  border-radius: 6px;
  padding: 8px !important;
  transition: background 0.3s;
}

.v-list-item-title,
.v-list-item-subtitle {
  color: #cfd8dc !important;
}
.v-list-item-title,
.v-list-item-subtitle {
  color: #cfd8dc !important;
}

.note-item {
  background: rgba(26, 58, 95, 0.6) !important;
  border-left: 3px solid #289bb8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.note-item:hover {
  background: rgba(40, 155, 184, 0.2) !important;
  transform: translateY(-2px);
}

.unread-note {
  background: rgba(26, 58, 95, 0.9) !important;
  border-left: 3px solid #ff5252;
}

/* Note Content Styling */
.note-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #b0e0e6 !important;
}

.note-content-full {
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1.1rem;
  padding: 12px;
  background: rgba(10, 25, 41, 0.7);
  border-radius: 6px;
  border: 1px solid #1a3a5f;
  color: #e0f7fa;
}

/* Author Styling */
.author-info {
  display: flex;
  align-items: center;
  color: #289bb8;
  font-size: 1.1rem;
  margin-bottom: 15px; 
}

/* Textarea dark input fix */
.v-textarea input,
.v-textarea textarea {
  color: #e0f7fa !important;
  background-color: #1a1a2e !important;
}

/* Badge Fix (if used) */
.v-badge__badge {
  top: -5px !important;
  right: -5px !important;
}

/* Optional: Darken dialog overlay background */
.v-dialog__content {
  background-color: rgba(10, 10, 10, 0.9) !important;
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

.response-card {
  background-color: #121212 !important;
  color: #e0f7fa !important;
  border: 1px solid #1e3a5f;
  border-radius: 10px;
}

.response-success .v-icon {
  color: #4caf50;
}

.response-error .v-icon {
  color: #f44336;
}

.response-info .v-icon {
  color: #289bb8;
}

.response-info .v-card-title,
.response-info .v-card-text {
  color: #b0e0e6 !important;
}
</style>