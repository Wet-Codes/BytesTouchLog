<template>
  <v-app>
    <!-- Page Header -->
    <page-header />
    
    <!-- Main Layout with Sidebar -->
    <v-layout>
      <!-- Left Sidebar Navigation - Overlapping -->
      <v-navigation-drawer
        permanent
        width="250"
        class="sidebar overlapping-sidebar"
      >
        <div class="sidebar-header">
          <v-icon size="40" color="white">mdi-account-circle</v-icon>
        </div>
        
        <v-list class="sidebar-buttons">
          <v-list-item
            v-for="button in sidebarButtons"
            :key="button.route"
            class="sidebar-button-wrapper"
            @click="navigateTo(button.route)"
          >
            <div class="sidebar-button-content">
              <v-icon size="30" class="sidebar-icon">{{ button.icon }}</v-icon>
              <span class="sidebar-text">{{ button.text }}</span>
            </div>
            <div class="border-animation"></div>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content Area -->
      <v-main>
        <div :style="backgroundStyle">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-card class="history-card" elevation="2">
                  <v-card-title class="d-flex justify-space-between align-center">
                    <h1 class="table-title">HISTORY LOG</h1>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Search..."
                      single-line
                      hide-details
                      outlined
                      dark
                      class="search-field"
                    ></v-text-field>
                  </v-card-title>
                  <v-card-text>
                    <!-- Tabs for different log types -->
                    <div class="tabs-container">
                      <v-btn
                        v-for="(item, index) in tabs"
                        :key="item"
                        :class="['tab-btn', { 'active-tab': tab === index }]"
                        @click="tab = index; page = 1"
                        depressed
                        height="40"
                      >
                        <v-icon left v-if="index === 0">mdi-login-variant</v-icon>
                        <v-icon left v-if="index === 1">mdi-cash-multiple</v-icon>
                        <v-icon left v-if="index === 2">mdi-database-edit</v-icon>
                        {{ item }}
                      </v-btn>
                    </div>




                    <!-- Login/Logout Logs -->
                    <div v-if="tab === 0" class="table-container">
                      <div class="table-header login-header">
                        <span class="col-user">User</span>
                        <span class="col-ip">IP Address</span>
                        <span class="col-device">Device</span>
                        <span class="col-login-timestamp">Login/Logout</span>
                      </div>
                     <v-data-table
  :headers="loginHeaders"
  :items="paginatedLoginLogs"
  :search="search"
  hide-default-header
  hide-default-footer
  class="elevation-1 history-table login-table"
  dark
>
  <!-- User column -->
  <template #[`item.user`]="{ item }">
    <div class="table-cell text-center">{{ item.user }}</div>
  </template>

  <!-- IP column -->
  <template #[`item.ip`]="{ item }">
    <div class="table-cell text-center">{{ item.ip }}</div>
  </template>

  <!-- Device column -->
  <template #[`item.device`]="{ item }">
    <div class="table-cell text-center">{{ item.device }}</div>
  </template>

  <!-- Timestamp column: dynamically show Login or Logout -->
  <template #[`item.timestamp`]="{ item }">
    <div class="table-cell text-center">
      <div v-if="item.action === 'Login'">
        <v-icon small color="success">mdi-login</v-icon>
        Login: {{ formatDateTime(item.timestamp) }}
      </div>
      <div v-else-if="item.action === 'Logout'">
        <v-icon small color="error">mdi-logout</v-icon>
        Logout: {{ formatDateTime(item.timestamp) }}
      </div>
      <div v-else>
        <v-icon small color="grey">mdi-help-circle</v-icon>
        Unknown: {{ formatDateTime(item.timestamp) }}
      </div>
    </div>
  </template>
</v-data-table>
                      <div class="text-center pt-2">


                        <v-pagination
                          v-model="page"
                          :length="loginPageCount"
                          :total-visible="7"
                          color="primary"
                          dark
                        ></v-pagination>


                      </div>
                    </div>

                    <!-- Fine Payment Logs -->
                    <div v-if="tab === 1" class="table-container">
                      <div class="table-header payment-header">
                        <span class="col-student">Student</span>
                        <span class="col-admin">Admin</span>
                        <span class="col-event">Event</span>
                        <span class="col-amount">Amount</span>
                        <span class="col-timestamp">Timestamp</span>
                        <span class="col-receipt">Receipt</span>
                      </div>
                      <v-data-table
                        :headers="paymentHeaders"
                        :items="paginatedPaymentLogs"
                        :search="search"
                        hide-default-header
                        hide-default-footer
                        class="elevation-1 history-table payment-table"
                        dark
                      >
                        <template #[`item.studentName`]="{ item }">
                          <div class="table-cell text-center">{{ item.studentName }}</div>
                        </template>
                        <template #[`item.adminName`]="{ item }">
                          <div class="table-cell text-center">{{ item.adminName }}</div>
                        </template>
                        <template #[`item.event`]="{ item }">
                          <div class="table-cell text-center">{{ item.event }}</div>
                        </template>
                        <template #[`item.amount`]="{ item }">
                          <div class="table-cell text-center">₱{{ item.amount.toFixed(2) }}</div>
                        </template>
                        <template #[`item.timestamp`]="{ item }">
                          <div class="table-cell text-center">{{ formatDateTime(item.timestamp) }}</div>
                        </template>
                        <template #[`item.receipt`]="{ item }">
                          <div class="table-cell text-center">
                            <v-btn small color="success" @click="generateReceipt(item)" class="receipt-btn white--text">
                              <v-icon left small>mdi-receipt</v-icon>
                              E-Receipt
                            </v-btn>
                          </div>
                        </template>
                      </v-data-table>
                      <div class="text-center pt-2">
                        <v-pagination
                          v-model="page"
                          :length="paymentPageCount"
                          :total-visible="7"
                          color="primary"
                          dark
                        ></v-pagination>
                      </div>
                    </div>

                    <!-- Transaction Logs -->
                    <div v-if="tab === 2" class="table-container">
                      <div class="table-header transaction-header">
                        <span class="col-admin">Admin</span>
                        <span class="col-target">Target</span>
                        <span class="col-changes">Changes</span>
                        <span class="col-timestamp">Timestamp</span>
                      </div>
                      <v-data-table
                        :headers="transactionHeaders"
                        :items="paginatedTransactionLogs"
                        :search="search"
                        hide-default-header
                        hide-default-footer
                        class="elevation-1 history-table transaction-table"
                        dark
                      >
                        <template #[`item.adminName`]="{ item }">
                          <div class="table-cell text-center">{{ item.adminName }}</div>
                        </template>
                        <template #[`item.target`]="{ item }">
                          <div class="table-cell text-center">{{ item.target }}</div>
                        </template>
                        <template #[`item.changes`]="{ item }">
                          <div class="table-cell text-center">
                            <v-btn small color="info" @click="showChanges(item)" class="changes-btn white--text">
                              <v-icon left small>mdi-eye</v-icon>
                              View
                            </v-btn>
                          </div>
                        </template>
                        <template #[`item.timestamp`]="{ item }">
                          <div class="table-cell text-center">
                            <div>{{ item.action }}:</div>
                            <div>{{ formatDateTime(item.timestamp) }}</div>
                          </div>
                        </template>
                      </v-data-table>
                      <div class="text-center pt-2">
                        <v-pagination
                          v-model="page"
                          :length="transactionPageCount"
                          :total-visible="7"
                          color="primary"
                          dark
                        ></v-pagination>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- E-Receipt Dialog -->
            <v-dialog v-model="receiptDialog" max-width="600">
              <v-card class="receipt-card">
                <v-card-title class="receipt-header">
                  <div class="receipt-title">Payment Receipt</div>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="receiptDialog = false" class="close-btn">
                    <v-icon small>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <div class="receipt-content">
                    <div class="receipt-details">
                      <div class="receipt-row">
                        <span class="receipt-label">Receipt No:</span>
                        <span class="receipt-value white--text">{{ currentReceipt.id }}</span>
                      </div>
                      <div class="receipt-row">
                        <span class="receipt-label">Date:</span>
                        <span class="receipt-value white--text">{{ formatDateTime(currentReceipt.timestamp) }}</span>
                      </div>
                      <div class="receipt-row">
                        <span class="receipt-label">Student:</span>
                        <span class="receipt-value white--text">{{ currentReceipt.studentName }}</span>
                      </div>
                      <div class="receipt-row">
                        <span class="receipt-label">Admin:</span>
                        <span class="receipt-value white--text">{{ currentReceipt.adminName }}</span>
                      </div>
                      <div class="receipt-row">
                        <span class="receipt-label">Event:</span>
                        <span class="receipt-value white--text">{{ currentReceipt.event }}</span>
                      </div>
                      <div class="receipt-row">
                        <span class="receipt-label">Amount:</span>
                        <span class="receipt-value white--text">₱{{ currentReceipt.amount.toFixed(2) }}</span>
                      </div>
                    </div>
                    <div class="receipt-footer">
                      <div class="receipt-total white--text">
                        <span>Total Paid:</span>
                        <span class="total-amount">₱{{ currentReceipt.amount.toFixed(2) }}</span>
                      </div>
                      <div class="receipt-actions">
                        <v-btn color="primary" @click="printReceipt" class="action-btn white--text">
                          <v-icon left>mdi-printer</v-icon>
                          Print Receipt
                        </v-btn>
                        <v-btn color="success" @click="downloadReceipt" class="action-btn ml-2 white--text">
                          <v-icon left>mdi-download</v-icon>
                          Download PDF
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- Changes Dialog -->
            <v-dialog v-model="changesDialog" max-width="800">
              <v-card class="changes-card">
                <v-card-title class="changes-header">
                  <div class="changes-title">Transaction Details</div>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="changesDialog = false" class="close-btn">
                    <v-icon small>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <div class="changes-content">
                    <div class="changes-info">
                      <div class="info-row">
                        <span class="info-label">Admin:</span>
                        <span class="info-value">{{ currentTransaction.adminName }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Action:</span>
                        <span class="info-value">{{ currentTransaction.action }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Target:</span>
                        <span class="info-value">{{ currentTransaction.target }}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Timestamp:</span>
                        <span class="info-value">{{ formatDateTime(currentTransaction.timestamp) }}</span>
                      </div>
                    </div>
                    
                    <div class="changes-table-container">
                      <v-simple-table dark class="changes-table">
                        <thead>
                          <tr>
                            <th class="text-left field-column">Field</th>
                            <th class="text-center old-value-column">Old Value</th>
                            <th class="text-center new-value-column">New Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(change, index) in currentChanges" :key="index">
                            <td class="text-left field-column">{{ change.field }}</td>
                            <td class="text-center old-value-column">{{ change.oldValue }}</td>
                            <td class="text-center new-value-column">{{ change.newValue }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-container>
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';
import { format } from 'date-fns';
import AuthService from '@/services/AuthServices';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      sidebarButtons: [
        { 
          text: 'Dashboard', 
          route: 'Home', 
          icon: 'mdi-view-dashboard' 
        },
        { 
          text: 'Manage Student', 
          route: 'manage-students', 
          icon: 'mdi-account-group' 
        },
        { 
          text: 'Manage Event', 
          route: 'manage-events', 
          icon: 'mdi-calendar-multiple' 
        },
        { 
          text: 'History Log', 
          route: 'history-log', 
          icon: 'mdi-history' 
        }
      ],
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      tab: 0,
      tabs: ['Login/Logout', 'Fine Payments', 'Transactions'],
      search: '',
      page: 1,
      itemsPerPage: 5, // Changed to 5 items per page for better demonstration

      loginHeaders: [
        { text: 'User', value: 'user', align: 'center', width: '20%' },
        { text: 'IP Address', value: 'ip', align: 'center', width: '20%' },
        { text: 'Device', value: 'device', align: 'center', width: '20%' },
        { text: 'Timestamp', value: 'timestamp', align: 'center', width: '40%' }
      ],
      paymentHeaders: [
        { text: 'Student', value: 'studentName', align: 'center', width: '25%' },
        { text: 'Admin', value: 'adminName', align: 'center', width: '15%' },
        { text: 'Event', value: 'event', align: 'center', width: '20%' },
        { text: 'Amount', value: 'amount', align: 'center', width: '10%' },
        { text: 'Timestamp', value: 'timestamp', align: 'center', width: '15%' },
        { text: 'Receipt', value: 'receipt', align: 'center', width: '15%' }
      ],
      transactionHeaders: [
        { text: 'Admin', value: 'adminName', align: 'center', width: '20%' },
        { text: 'Target', value: 'target', align: 'center', width: '35%' },
        { text: 'Changes', value: 'changes', align: 'center', width: '15%' },
        { text: 'Timestamp', value: 'timestamp', align: 'center', width: '30%' }
      ],
      loginLogs: [],
      paymentLogs: [
        { id: 'PAY-001', studentName: 'AI-shields Fiction', adminName: 'admin1', event: 'Orientation', amount: 500, timestamp: new Date('2025-05-18T05:25:00') },
        { id: 'PAY-002', studentName: 'Jane Batuhan', adminName: 'admin2', event: 'Seminar', amount: 500, timestamp: new Date('2025-05-17T05:25:00') },
        { id: 'PAY-003', studentName: 'Almon Punibaya', adminName: 'admin1', event: 'Workshop', amount: 200, timestamp: new Date('2025-05-19T05:25:00') },
        { id: 'PAY-004', studentName: 'Sodais Macapantao', adminName: 'admin2', event: 'Orientation', amount: 500, timestamp: new Date('2025-05-16T05:25:00') },
        { id: 'PAY-005', studentName: 'Abdulazis Mapandi', adminName: 'admin1', event: 'Seminar', amount: 500, timestamp: new Date('2025-05-15T05:25:00') },
        { id: 'PAY-006', studentName: 'Faiz Rataban', adminName: 'admin2', event: 'Workshop', amount: 200, timestamp: new Date('2025-05-14T05:25:00') },
        { id: 'PAY-007', studentName: 'Doms Benito', adminName: 'admin1', event: 'Orientation', amount: 500, timestamp: new Date('2025-05-13T05:25:00') },
        { id: 'PAY-008', studentName: 'John Doe', adminName: 'admin2', event: 'Seminar', amount: 500, timestamp: new Date('2025-05-12T05:25:00') },
        { id: 'PAY-009', studentName: 'Jane Smith', adminName: 'admin1', event: 'Workshop', amount: 200, timestamp: new Date('2025-05-11T05:25:00') },
        { id: 'PAY-010', studentName: 'Robert Johnson', adminName: 'admin2', event: 'Orientation', amount: 500, timestamp: new Date('2025-05-10T05:25:00') }
      ],
      transactionLogs: [
        { 
          id: 'TRX-001', 
          adminName: 'admin1', 
          action: 'Updated', 
          target: 'Student: AI-shields Honor', 
          changes: [
            { field: 'Status', oldValue: 'Regular', newValue: 'Irregular' },
            { field: 'Year Level', oldValue: '2nd Year', newValue: '3rd Year' }
          ], 
          timestamp: new Date('2025-05-18T05:25:00') 
        },
        { 
          id: 'TRX-002', 
          adminName: 'admin2', 
          action: 'Created', 
          target: 'Event: Seminar', 
          changes: [
            { field: 'New Event', oldValue: '', newValue: 'Annual Seminar' }
          ], 
          timestamp: new Date('2025-05-17T05:25:00') 
        },
        { 
          id: 'TRX-003', 
          adminName: 'admin1', 
          action: 'Deleted', 
          target: 'Fine: PA-003', 
          changes: [
            { field: 'Fine Record', oldValue: '₱200.00', newValue: 'Deleted' }
          ], 
          timestamp: new Date('2025-05-18T05:25:00') 
        },
        { 
          id: 'TRX-004', 
          adminName: 'admin2', 
          action: 'Updated', 
          target: 'Student: Jane Batuhan', 
          changes: [
            { field: 'Course', oldValue: 'BSIT', newValue: 'BSCS' },
            { field: 'Status', oldValue: 'Regular', newValue: 'Shifted' }
          ], 
          timestamp: new Date('2025-05-16T05:25:00') 
        },
        { 
          id: 'TRX-005', 
          adminName: 'admin1', 
          action: 'Created', 
          target: 'Student: Almon Punibaya', 
          changes: [
            { field: 'New Student', oldValue: '', newValue: 'Created' }
          ], 
          timestamp: new Date('2025-05-15T05:25:00') 
        },
        { 
          id: 'TRX-006', 
          adminName: 'admin2', 
          action: 'Updated', 
          target: 'Event: Workshop', 
          changes: [
            { field: 'Date', oldValue: '2025-05-20', newValue: '2025-05-25' },
            { field: 'Fee', oldValue: '₱200.00', newValue: '₱250.00' }
          ], 
          timestamp: new Date('2025-05-14T05:25:00') 
        },
        { 
          id: 'TRX-007', 
          adminName: 'admin1', 
          action: 'Deleted', 
          target: 'Student: John Doe', 
          changes: [
            { field: 'Student Record', oldValue: 'Active', newValue: 'Deleted' }
          ], 
          timestamp: new Date('2025-05-13T05:25:00') 
        },
        { 
          id: 'TRX-008', 
          adminName: 'admin2', 
          action: 'Updated', 
          target: 'System Settings', 
          changes: [
            { field: 'Fine Rate', oldValue: '₱500', newValue: '₱550' }
          ], 
          timestamp: new Date('2025-05-12T05:25:00') 
        },
        { 
          id: 'TRX-009', 
          adminName: 'admin1', 
          action: 'Created', 
          target: 'User: admin3', 
          changes: [
            { field: 'New Admin', oldValue: '', newValue: 'Created' }
          ], 
          timestamp: new Date('2025-05-11T05:25:00') 
        },
        { 
          id: 'TRX-010', 
          adminName: 'admin2', 
          action: 'Updated', 
          target: 'User: admin1', 
          changes: [
            { field: 'Permissions', oldValue: 'Basic', newValue: 'Admin' }
          ], 
          timestamp: new Date('2025-05-10T05:25:00') 
        }
      ],
      receiptDialog: false,
      currentReceipt: {},
      changesDialog: false,
      currentChanges: [],
      currentTransaction: {}
    };
  },
  mounted(){
      this.fetchLoginHistory();

       this.refreshInterval = setInterval(() => {
      if (this.tab === 0) {
        this.fetchLoginHistory();
      }
    }, 30000);
  },
  
  beforeUnmount() {
    clearInterval(this.refreshInterval);
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
    // Filtered items based on search
    filteredLoginLogs() {
      if (!this.search) return this.loginLogs;
      const searchTerm = this.search.toLowerCase();
      return this.loginLogs.filter(item => 
        item.user.toLowerCase().includes(searchTerm) ||
        item.ip.toLowerCase().includes(searchTerm) ||
        item.device.toLowerCase().includes(searchTerm)
      );
    },
    filteredPaymentLogs() {
      if (!this.search) return this.paymentLogs;
      const searchTerm = this.search.toLowerCase();
      return this.paymentLogs.filter(item => 
        item.studentName.toLowerCase().includes(searchTerm) ||
        item.adminName.toLowerCase().includes(searchTerm) ||
        item.event.toLowerCase().includes(searchTerm) ||
        item.amount.toString().includes(searchTerm)
      );
    },
    filteredTransactionLogs() {
      if (!this.search) return this.transactionLogs;
      const searchTerm = this.search.toLowerCase();
      return this.transactionLogs.filter(item => 
        item.adminName.toLowerCase().includes(searchTerm) ||
        item.target.toLowerCase().includes(searchTerm) ||
        item.action.toLowerCase().includes(searchTerm)
      );
    },
    
    // Paginated items
    paginatedLoginLogs() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredLoginLogs.slice(start, end);
    },
    paginatedPaymentLogs() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPaymentLogs.slice(start, end);
    },
    paginatedTransactionLogs() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTransactionLogs.slice(start, end);
    },
    
    // Page counts
    loginPageCount() {
      return Math.ceil(this.filteredLoginLogs.length / this.itemsPerPage);
    },
    paymentPageCount() {
      return Math.ceil(this.filteredPaymentLogs.length / this.itemsPerPage);
    },
    transactionPageCount() {
      return Math.ceil(this.filteredTransactionLogs.length / this.itemsPerPage);
    }
  },
  methods: {

     async fetchLoginHistory() {
      try {
        const response = await AuthService.getLoginHistory();
        this.loginLogs = response.data.map(log => ({
          id: log.id,
          user: log.user ? log.user.username : 'Unknown',
          ip: log.ipAddress,
          device: log.device,
          timestamp: log.timestamp,
            action: log.action, // ✅ include this
          logoutTimestamp: log.logoutTimestamp || null
        }));
      } catch (error) {
        console.error('Failed to fetch login history:', error);
        alert('Failed to load login history. Please try again.');
      }
    },

    navigateTo(route) {
      this.$router.push({ name: route });
    },
    formatDateTime(date) {
      return format(new Date(date), 'MMM dd yyyy h:mma');
    },
    generateReceipt(item) {
      this.currentReceipt = item;
      this.receiptDialog = true;
    },
    printReceipt() {
      window.print();
    },
    downloadReceipt() {
      alert('PDF download would start here in a real implementation');
    },
    showChanges(item) {
      this.currentTransaction = item;
      this.currentChanges = item.changes;
      this.changesDialog = true;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');
@import url('https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css');

/* Sidebar Styles */
.overlapping-sidebar {
  position: absolute;
  z-index: 100;
  height: 100vh;
}

.sidebar {
  background: #0d003d !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

.sidebar-buttons {
  padding: 15px 10px;
  background: transparent !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.sidebar-button-wrapper {
  position: relative;
  margin: 15px 0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.08);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-button-wrapper:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.border-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.border-animation::before {
  content: '';
  position: absolute;
  width: 150%;
  height: 150%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: borderLight 3s linear infinite;
  transform: rotate(45deg);
}

@keyframes borderLight {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.sidebar-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  position: relative;
  z-index: 1;
}

.sidebar-icon {
  color: white !important;
  margin-bottom: 8px;
}

.sidebar-text {
  font-size: 16px;
  font-weight: 500;
  color: white;
  text-align: center;
  line-height: 1.3;
}

/* Main Content Styles */
.history-card {
  background: rgba(0, 0, 0, 0.5) !important;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6) !important;
  border-radius: 10px !important;
  color: white !important;
}

.table-title {
  color: white;
  font-size: 2rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.search-field {
  width: 50% !important;
  min-width: 300px !important;
  max-width: 500px !important;
}

.tabs-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
}

.tab-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  color: white !important;
  text-transform: none;
  letter-spacing: normal;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  margin-right: 8px;
  border-radius: 4px 4px 0 0 !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
  padding: 0 16px;
}

.tab-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.tab-btn.active-tab {
  background: linear-gradient(145deg, #289bb8, #1a6f8b) !important;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
}

.tab-btn:nth-child(1).active-tab {
  background: linear-gradient(145deg, #4CAF50, #2E7D32) !important;
}

.tab-btn:nth-child(2).active-tab {
  background: linear-gradient(145deg, #289bb8, #1a6f8b) !important;
}

.tab-btn:nth-child(3).active-tab {
  background: linear-gradient(145deg, #FF9800, #F57C00) !important;
}

.table-container {
  margin-top: 20px;
}

.table-header {
  display: grid;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #289bb8;
  font-weight: 600;
  border-radius: 4px 4px 0 0;
  font-family: 'Poppins', sans-serif;
}

/* Login/Logout Table */
.table-header.login-header {
  grid-template-columns: 20% 20% 20% 40%;
}

/* Fine Payment Table */
.table-header.payment-header {
  grid-template-columns: 25% 15% 20% 10% 15% 15%;
}

/* Transaction Table */
.table-header.transaction-header {
  grid-template-columns: 20% 35% 15% 30%;
}

.history-table {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border-radius: 0 0 4px 4px !important;
}

.history-table >>> tbody tr {
  background-color: rgba(0, 0, 0, 0.2) !important;
  color: white !important;
  font-family: 'Poppins', sans-serif;
}

.history-table >>> tbody tr:hover {
  background-color: rgba(40, 155, 184, 0.2) !important;
}

.history-table >>> tbody td {
  color: white !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 12px 8px !important;
  vertical-align: middle !important;
}

.table-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-center {
  text-align: center;
}

.login-entry, .logout-entry {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.icon-bg {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border-radius: 50%;
  padding: 4px;
}

.receipt-btn, .changes-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;
  transition: all 0.3s ease;
  min-width: 120px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.receipt-btn {
  background: linear-gradient(145deg, #4CAF50, #2E7D32) !important;
}

.changes-btn {
  background: linear-gradient(145deg, #289bb8, #1a6f8b) !important;
}

.receipt-btn:hover, .changes-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
}

.v-pagination {
  justify-content: center;
  margin-top: 20px;
}

.v-pagination__item {
  background: rgba(253, 253, 253, 0.1);
  color: white;
  min-width: 32px;
  height: 32px;
}

.v-pagination__item--active {
  background: #ffffff !important;
  color: white !important;
}

.v-pagination__navigation {
  background: rgba(238, 238, 238, 0.1);
  color: white;
}

/* Receipt Dialog Styles */
.receipt-card {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid #289bb8 !important;
  border-radius: 8px !important;
}

.receipt-header {
  background: rgba(40, 155, 184, 0.2) !important;
  border-bottom: 1px solid #289bb8 !important;
  position: relative;
  padding: 16px 24px;
}

.receipt-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  font-family: 'Poppins', sans-serif;
}

.receipt-content {
  padding: 20px;
}

.receipt-details {
  margin-bottom: 30px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Poppins', sans-serif;
}

.receipt-label {
  font-weight: 600;
  color: #289bb8;
}

.receipt-value {
  color: white;
  font-weight: 500;
}

.receipt-footer {
  margin-top: 30px;
}

.receipt-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 15px;
  background: rgba(40, 155, 184, 0.2);
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
}

.total-amount {
  color: white;
}

.receipt-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.action-btn {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

/* Changes Dialog Styles */
.changes-card {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid #289bb8 !important;
  border-radius: 8px !important;
}

.changes-header {
  background: rgba(40, 155, 184, 0.2) !important;
  border-bottom: 1px solid #289bb8 !important;
  color: white;
  font-family: 'Poppins', sans-serif;
  position: relative;
  padding: 16px 24px;
}

.changes-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
}

.changes-content {
  padding: 16px;
}

.changes-info {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(40, 155, 184, 0.1);
  border-radius: 4px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
}

.info-label {
  font-weight: 600;
  color: #289bb8;
  min-width: 100px;
  margin-right: 16px;
}

.info-value {
  color: white;
  font-weight: 500;
}

.changes-table-container {
  margin-top: 16px;
}

.changes-table {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border-radius: 4px;
}

.changes-table >>> thead tr {
  background-color: rgba(40, 155, 184, 0.3) !important;
}

.changes-table >>> th {
  color: white !important;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  padding: 12px 16px !important;
}

.changes-table >>> td {
  color: white !important;
  padding: 12px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.field-column {
  width: 30%;
  min-width: 200px;
}

.old-value-column {
  width: 35%;
  min-width: 200px;
}

.new-value-column {
  width: 35%;
  min-width: 200px;
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 16px;
}

.close-btn .v-icon {
  font-size: 20px;
}

.white--text {
  color: white !important;
}

@media (max-width: 960px) {
  .sidebar {
    width: 200px !important;
  }
  
  .sidebar-text {
    font-size: 14px;
  }
  
  .sidebar-button-wrapper {
    height: 70px;
  }
  
  .sidebar-icon {
    font-size: 24px !important;
  }
  
  .search-field {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .tab-btn {
    font-size: 0.8rem;
    padding: 0 8px;
  }
  
  .table-header.login-header {
    grid-template-columns: 25% 25% 25% 25%;
  }
  
  .table-header.payment-header {
    grid-template-columns: 30% 15% 20% 10% 15% 10%;
  }
  
  .receipt-btn, .changes-btn {
    min-width: 90px;
    font-size: 0.8rem;
  }
}

@media (max-width: 600px) {
  .table-title {
    font-size: 1.5rem;
  }
  
  .tabs-container {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .tab-btn {
    margin-right: 4px;
    font-size: 0.7rem;
    padding: 0 6px;
  }
  
  .table-header {
    font-size: 0.8rem;
    padding: 8px 12px;
  }
  
  .history-table >>> tbody td {
    padding: 8px 4px !important;
    font-size: 0.8rem;
  }
}
</style>