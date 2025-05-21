<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
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
                          <span class="col-fname">Username</span>
                          <span class="col-email">Email</span>
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
                            <v-chip small :color="getStatusColor(item.status)">
                              {{ item.status }}
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
                                :color="item.status === 'Active' ? 'error' : 'success'" 
                                @click="toggleAccountStatus(item)"
                                class="action-btn"
                              >
                                {{ item.status === 'Active' ? 'Disable' : 'Enable' }}
                              </v-btn>
                            </div>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col v-if="selectedAccount" cols="4">
                    <v-card class="right-side-card">
                      <div class="details-header">
                        <v-card-title class="details-title">
                          {{ selectedAccount.username }} Details
                        </v-card-title>
                      </div>
                      <v-card-text>
                        <v-form v-if="selectedAccount" @submit.prevent="showConfirmation">
                          <v-text-field
                            v-model="editForm.username"
                            label="Username"
                            outlined
                            dense
                            class="mb-2"
                          ></v-text-field>

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
                       <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="passwordConfirmDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveAccount">Confirm</v-btn>
        </v-card-actions>
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
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      search: '',
      selectedAccount: null,
      passwordConfirmDialog: false,
      editForm: {
         
        newPassword: ''
      },
      statusOptions: ['Active', 'Inactive'],
      roles: ['admin', 'user'],
      accountHeaders: [
        { text: 'Username', value: 'username', align: 'center', width: '20%' },
        { text: 'Email', value: 'email', align: 'center', width: '25%' },
        { text: 'Role', value: 'role', align: 'center', width: '15%' },
        { text: 'Status', value: 'status', align: 'center', width: '15%' },
        { text: 'Actions', value: 'actions', align: 'center', width: '25%', sortable: false }
      ],
      accounts: []
    };
  },
  computed: {
    filteredAccounts() {
      return this.accounts.filter(account => {
        return (
          account.username.toLowerCase().includes(this.search.toLowerCase()) ||
          account.email.toLowerCase().includes(this.search.toLowerCase())
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
  },
  methods: {
    getStatusColor(status) {
      return status === 'Active' ? 'green' : 'red';
    },

    async loadAccounts() {
      try {
        const response = await AccountService.getAccounts();
        this.accounts = response.data;
      } catch (error) {
        console.error('Error loading accounts:', error);
      }
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
      this.passwordConfirmDialog = false;
      try {
        const payload = { 
          ...this.editForm,
          // Only send password if it's been entered
          password: this.editForm.newPassword || undefined
        };
        
        const response = await AccountService.updateAccount(this.editForm.id, payload);
        
        const index = this.accounts.findIndex(a => a.id === this.editForm.id);
        this.accounts.splice(index, 1, response.data);
        this.cancelEdit();
        
        if (this.editForm.newPassword) {
          this.$toast.success('Password updated successfully');
        }
      } catch (error) {
        console.error('Error updating account:', error);
      }
    },

     showConfirmation() {
      if (this.editForm.newPassword) {
        this.passwordConfirmDialog = true;
      } else {
        this.saveAccount();
      }
    },

    async toggleAccountStatus(account) {
      try {
        await AccountService.toggleAccountStatus(account.id);
        account.status = account.status === 'Active' ? 'Inactive' : 'Active';
      } catch (error) {
        console.error('Error toggling status:', error);
      }
    },

    cancelEdit() {
      this.selectedAccount = null;
      this.editForm = {
        newPassword: ''
      };
    }
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
  text-align: center;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 12px 8px !important;
  vertical-align: middle !important;
  text-align: center !important;
}

.col-fname { width: 15%; }
.col-email { width: 25%; }
.col-role { width: 15%; }
.col-status { width: 15%; }
.col-actions { width: 20%; }

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