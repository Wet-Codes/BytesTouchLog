<template>
  <div>
      <page-header />
    <div :style="backgroundStyle">
        <v-container>
        <!-- Welcome Info Dialog -->
        <v-dialog v-model="welcomeDialog" persistent max-width="600">
        <v-card class="dark-card">
        <v-card-title class="text-h5">Important Information</v-card-title>
        <v-card-text>
        This is the account list interface. Please handle it with caution as it is strictly intended 
        for managing user accounts and passwords. Only authorized administrators should perform 
        actions here to ensure the security and privacy of user data.
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="welcomeDialog = false">Understood</v-btn>
        </v-card-actions>
        </v-card>
        </v-dialog>
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

         <!-- Password Confirmation Dialog -->
        <v-dialog v-model="passwordConfirmDialog" persistent max-width="500">
          <v-card class="dark-card">
            <v-card-title>Confirm Password Change</v-card-title>
            <v-card-text>
              You're about to change the account password. This action cannot be undone.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" @click="passwordConfirmDialog = false">Cancel</v-btn>
              <v-btn color="primary" @click="saveAccount">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <h1 class="table-title">Account List</h1>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col :cols="selectedAccount ? 8 : 12">
                    <v-card class="student-list-card">
                      <v-card-text>
                       <div class="student-list-header">
    <span class="col-username">Username</span>
    <span class="col-role">Role</span>
    <span class="col-status">Status</span>
    <span class="col-actions">Actions</span>
  </div>
                        <v-data-table
                          :headers="accountHeaders"
                          :items="filteredAccounts"
                          :search="search"
                          :items-per-page="10"
                          class="elevation-1 student-fines-table"
                          dark
                          hide-default-header
                        >
                          <template #[`item.status`]="{ item }">
                            <v-chip small :color="item.isEnabled ? 'green' : 'red'">
                              {{ item.isEnabled ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </template>

                          <template #[`item.actions`]="{ item }">
                            <div class="action-buttons">                             
                              <v-btn 
                                small 
                                color="warning" 
                                @click="editAccount(item)" 
                                class="action-btn"
                              >
                                Update
                              </v-btn>
                              <v-btn 
                                small 
                                :color="item.isEnabled ? 'error' : 'success'" 
                                @click="initiateAction('toggle', item)"
                                class="action-btn"
                              >
                                {{ item.isEnabled ? 'Disable' : 'Enable' }}
                              </v-btn>
                            </div>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

              <!-- Edit Form Column -->
              <v-col v-if="selectedAccount" cols="4">
                <v-card class="right-side-card">
                  <div class="details-header">
                    <v-card-title class="details-title">
                      {{ selectedAccount.username }} Details
                    </v-card-title>
                  </div>
                  <v-card-text>
                    <v-form v-if="selectedAccount" @submit.prevent="showConfirmation">
                      <div class="mb-2">
                      <strong>Username:</strong> {{ selectedAccount.username }}
                      </div>

                      <v-text-field
                        v-model="editForm.newPassword"
                        label="New Password"
                        type="password"
                        outlined
                        dense
                        class="mb-2"
                        placeholder="Leave empty to keep current password"
                      ></v-text-field>

                      <v-select
                        v-model="editForm.role"
                        :items="roles"
                        label="Role"
                        outlined
                        dense
                        class="mb-2"
                      ></v-select>

                      <v-select
                        v-model="editForm.status"
                        :items="statusOptions"
                        label="Status"
                        outlined
                        dense
                        class="mb-2"
                      ></v-select>

                      <div class="regular-buttons">
                        <v-btn type="submit" color="success">Save Changes</v-btn>
                        <v-btn @click="cancelEdit" class="ml-2">Cancel</v-btn>
                      </div>
                    </v-form>
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
import AccountService from '@/services/AuthServices';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      welcomeDialog: false,
       actionDialog: false,
      dialogTitle: '',
      dialogMessage: '',
      currentAction: null,
      selectedAccount: null,
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      search: '',
      passwordConfirmDialog: false,
      editForm: {
        
        newPassword: ''
      },
      statusOptions: ['Active', 'Inactive'],
      roles: ['admin', 'user'],
      accountHeaders: [
  { text: 'Username', value: 'username', align: 'center', width: '30%' },
  { text: 'Role', value: 'role', align: 'center', width: '20%' },
  { text: 'Status', value: 'status', align: 'center', width: '20%' },
  { text: 'Actions', value: 'actions', align: 'center', width: '30%', sortable: false }
],
      accounts: []
    };
  },
  computed: {
    filteredAccounts() {
      return this.accounts.filter(account => {
        return (
          account.username.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px 0'
      };
    }
  },
  async mounted() {
    await this.loadAccounts();
    this.welcomeDialog = true;
  },
  methods: {

  
     initiateAction(actionType, account) {
       this.currentAction = { 
    type: actionType, 
    account: { ...account }, // Create a copy of the account object
    id: account.id // Extract the ID explicitly
  };
      
      const messages = {
        toggle: `Are you sure you want to ${account.isEnabled ? 'disable' : 'enable'} ${account.username}?`,
        delete: `Permanently delete account ${account.username}? This cannot be undone!`,
        edit: 'Save changes to this account?'
      };

      this.dialogTitle = `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Confirmation`;
      this.dialogMessage = messages[actionType];
      this.actionDialog = true;
    },

    async confirmAction() {
  this.actionDialog = false;

  // ✅ Prevent error by checking if currentAction is set
  if (!this.currentAction || !this.currentAction.type) {
    console.error('No valid currentAction provided.');
    this.dialogTitle = 'Error';
    this.dialogMessage = 'No action was selected or the action is invalid.';
    this.actionDialog = true;
    return;
  }

  try {
    switch (this.currentAction.type) {
      case 'toggle':
        await this.toggleAccountStatus();
        break;
      case 'delete':
        await AccountService.deleteAccount(this.currentAction.account.id);
        await this.loadAccounts();
        this.dialogTitle = 'Success';
        this.dialogMessage = 'Account deleted successfully.';
        //this.actionDialog = true;
        break;
      case 'edit':
        await this.saveAccount();
        break;
      default:
        this.dialogTitle = 'Error';
        this.dialogMessage = `Unknown action type: ${this.currentAction.type}`;
        //this.actionDialog = true;
        break;
    }
  } catch (error) {
    console.error('Action failed:', error);
    this.dialogTitle = 'Error';
    this.dialogMessage = 'Action failed. Please try again.';
    //this.actionDialog = true;
  } finally {
    this.actionDialog = false;
  }
},

    async loadAccounts() {
      try {
        const response = await AccountService.getAccounts();
        this.accounts = response.data.map(acc => ({
          ...acc,
          status: acc.isEnabled ? 'Active' : 'Inactive'
        }));
      } catch (error) {
        console.error('Error loading accounts:', error);
      }
    },

    // Modified toggle method
    async toggleAccountStatus() {
  try {
    const updatedStatus = !this.currentAction.account.isEnabled;

    await AccountService.toggleAccountStatus(this.currentAction.id);
    await this.loadAccounts();

    this.dialogTitle = 'Success';
    this.dialogMessage = `Account ${updatedStatus ? 'enabled' : 'disabled'} successfully.`;
  } catch (error) {
    console.error('Error toggling status:', error);

    this.dialogTitle = 'Error';
    this.dialogMessage = 'Failed to update account status.';
  }
},

    // Add delete method
    async deleteAccount(id) {
      try {
        await AccountService.deleteAccount(id);
        this.accounts = this.accounts.filter(acc => acc.id !== id);
      } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
      }
    },

    
    getStatusColor(status) {
      return status === 'Active' ? 'green' : 'red';
    },

    editAccount(account) {
      this.selectedAccount = account;
      this.editForm = { 
        ...account,
        currentPassword: '',
        newPassword: ''
      };
    },

    async saveAccount() {
    try {
      const hasChanges = Object.keys(this.editForm).some(key => {
      if (key === 'currentPassword' || key === 'newPassword') return false;
      return this.editForm[key] !== this.selectedAccount[key];
    });

    if (!hasChanges && !this.editForm.newPassword) {
      this.dialogTitle = 'No Changes';
      this.dialogMessage = 'No changes detected to save.';
      return;
    }
      console.log(this.editForm.id)
      console.log(this.editForm.newPassword)
       
      const payload = { 
      id: this.editForm.id,
      password: this.editForm.newPassword || undefined
};
     console.log(payload.password)
     
      await AccountService.updateAccount(payload);
      await this.loadAccounts();
     this.dialogTitle = 'Success';
     this.dialogMessage = 'Account updated successfully.';
     //this.actionDialog = true;
      
      this.passwordConfirmDialog = false;
      this.cancelEdit();
    } catch (error) {
    console.error('Error updating account:', error);
    this.dialogTitle = 'Error';
    this.dialogMessage = 'Failed to update account.';
    //this.actionDialog = true;
  } finally {
    this.cancelEdit();
  }
},

     showConfirmation() {
    if (this.editForm.newPassword) {
      this.passwordConfirmDialog = true;
    } else {
      this.saveAccount();
    }
  },


    cancelEdit() {
      this.selectedAccount = null;
      this.editForm = {
        newPassword: ''
      };
    },

    

  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');


.confirm-dialog {
  background: rgba(0, 0, 0, 0.9);
  color: white;
}

.confirm-dialog .headline {
  color: #FF5252;
  font-weight: bold;
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

/* Center align all table cells */
.student-fines-table td {
  text-align: center !important;
  vertical-align: middle !important;
}

.col-username { 
  width: 30%; 
  justify-content: center;
}

.col-role { 
  width: 20%; 
  justify-content: center;
}

.col-status { 
  width: 20%; 
  justify-content: center;
}

.col-actions { 
  width: 30%; 
  justify-content: center;
}

/* Adjust action buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 80px;
  margin: 2px 0;
}

/* Responsive adjustments */
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

@media (max-width: 960px) {
  .student-list-header .col-fname,
  .student-list-header .col-email,
  .student-fines-table .col-fname,
  .student-fines-table .col-email {
    width: 20%;
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