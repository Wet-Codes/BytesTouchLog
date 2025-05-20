<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="history-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <h1 class="table-title">HISTORY LOG</h1>
                <div class="d-flex">
                  <v-select
                    v-model="filter.type"
                    :items="logTypes"
                    label="Log Type"
                    outlined
                    dense
                    dark
                    class="filter-select mr-2"
                    hide-details
                  />
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
                </div>
              </v-card-title>
              <v-card-text>
                <v-tabs v-model="tab" background-color="transparent" color="teal" dark>
                  <v-tab v-for="item in tabs" :key="item">
                    {{ item }}
                  </v-tab>
                </v-tabs>

                <v-tabs-items v-model="tab">
                  <!-- Login/Logout Logs -->
                  <v-tab-item>
                    <v-data-table
                      :headers="loginHeaders"
                      :items="filteredLoginLogs"
                      :search="search"
                      :items-per-page="10"
                      class="elevation-1 history-table"
                      dark
                    >
                      <template #[`item.action`]="{ item }">
                        <v-chip small :color="getActionColor(item.action)">
                          {{ item.action }}
                        </v-chip>
                      </template>
                      <template #[`item.timestamp`]="{ item }">
                        {{ formatDateTime(item.timestamp) }}
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!-- Fine Payment Logs -->
                  <v-tab-item>
                    <v-data-table
                      :headers="paymentHeaders"
                      :items="filteredPaymentLogs"
                      :search="search"
                      :items-per-page="10"
                      class="elevation-1 history-table"
                      dark
                    >
                      <template #[`item.amount`]="{ item }">
                        ₱{{ item.amount.toFixed(2) }}
                      </template>
                      <template #[`item.timestamp`]="{ item }">
                        {{ formatDateTime(item.timestamp) }}
                      </template>
                      <template #[`item.receipt`]="{ item }">
                        <v-btn small color="primary" @click="generateReceipt(item)">
                          Generate E-Receipt
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!-- Transaction Logs -->
                  <v-tab-item>
                    <v-data-table
                      :headers="transactionHeaders"
                      :items="filteredTransactionLogs"
                      :search="search"
                      :items-per-page="10"
                      class="elevation-1 history-table"
                      dark
                    >
                      <template #[`item.changes`]="{ item }">
                        <v-chip small color="info" @click="showChanges(item)">
                          View Changes
                        </v-chip>
                      </template>
                      <template #[`item.timestamp`]="{ item }">
                        {{ formatDateTime(item.timestamp) }}
                      </template>
                    </v-data-table>
                  </v-tab-item>
                </v-tabs-items>
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
              <v-btn icon @click="receiptDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="receipt-content">
                <div class="receipt-details">
                  <div class="receipt-row">
                    <span class="receipt-label">Receipt No:</span>
                    <span class="receipt-value">{{ currentReceipt.id }}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Date:</span>
                    <span class="receipt-value">{{ formatDateTime(currentReceipt.timestamp) }}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Student:</span>
                    <span class="receipt-value">{{ currentReceipt.studentName }}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Admin:</span>
                    <span class="receipt-value">{{ currentReceipt.adminName }}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Event:</span>
                    <span class="receipt-value">{{ currentReceipt.event }}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Amount:</span>
                    <span class="receipt-value">₱{{ currentReceipt.amount.toFixed(2) }}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Payment Method:</span>
                    <span class="receipt-value">{{ currentReceipt.method }}</span>
                  </div>
                </div>
                <div class="receipt-footer">
                  <div class="receipt-total">
                    <span>Total Paid:</span>
                    <span class="total-amount">₱{{ currentReceipt.amount.toFixed(2) }}</span>
                  </div>
                  <div class="receipt-actions">
                    <v-btn color="primary" @click="printReceipt">
                      <v-icon left>mdi-printer</v-icon>
                      Print Receipt
                    </v-btn>
                    <v-btn color="success" @click="downloadReceipt" class="ml-2">
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
              Transaction Details
              <v-spacer></v-spacer>
              <v-btn icon @click="changesDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-simple-table dark>
                <template #default>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(change, index) in currentChanges" :key="index">
                      <td>{{ change.field }}</td>
                      <td>{{ change.oldValue }}</td>
                      <td>{{ change.newValue }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';
import { format } from 'date-fns';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      tab: null,
      tabs: ['Login/Logout', 'Fine Payments', 'Transactions'],
      search: '',
      filter: {
        type: 'All'
      },
      logTypes: ['All', 'Login', 'Logout', 'Payment', 'Modification'],
      loginHeaders: [
        { text: 'User', value: 'user' },
        { text: 'Action', value: 'action' },
        { text: 'IP Address', value: 'ip' },
        { text: 'Device', value: 'device' },
        { text: 'Timestamp', value: 'timestamp' }
      ],
      paymentHeaders: [
        { text: 'Student', value: 'studentName' },
        { text: 'Admin', value: 'adminName' },
        { text: 'Event', value: 'event' },
        { text: 'Amount', value: 'amount' },
        { text: 'Method', value: 'method' },
        { text: 'Timestamp', value: 'timestamp' },
        { text: 'Receipt', value: 'receipt' }
      ],
      transactionHeaders: [
        { text: 'Admin', value: 'adminName' },
        { text: 'Action', value: 'action' },
        { text: 'Target', value: 'target' },
        { text: 'Changes', value: 'changes' },
        { text: 'Timestamp', value: 'timestamp' }
      ],
      loginLogs: [
        { id: 1, user: 'admin1', action: 'Login', ip: '192.168.1.1', device: 'Windows Chrome', timestamp: new Date() },
        { id: 2, user: 'admin2', action: 'Login', ip: '192.168.1.2', device: 'Mac Safari', timestamp: new Date(Date.now() - 3600000) },
        { id: 3, user: 'admin1', action: 'Logout', ip: '192.168.1.1', device: 'Windows Chrome', timestamp: new Date(Date.now() - 7200000) }
      ],
      paymentLogs: [
        { id: 'PAY-001', studentName: 'Al-shiolla Haron', adminName: 'admin1', event: 'Orientation', amount: 500, method: 'Cash', timestamp: new Date() },
        { id: 'PAY-002', studentName: 'Jane Batuhan', adminName: 'admin2', event: 'Seminar', amount: 300, method: 'GCash', timestamp: new Date(Date.now() - 86400000) },
        { id: 'PAY-003', studentName: 'Aiman Pumbaya', adminName: 'admin1', event: 'Workshop', amount: 200, method: 'Bank Transfer', timestamp: new Date(Date.now() - 172800000) }
      ],
      transactionLogs: [
        { id: 'TRX-001', adminName: 'admin1', action: 'Updated', target: 'Student: Al-shiolla Haron', changes: [
          { field: 'Status', oldValue: 'Regular', newValue: 'Irregular' },
          { field: 'Year Level', oldValue: '2nd Year', newValue: '3rd Year' }
        ], timestamp: new Date() },
        { id: 'TRX-002', adminName: 'admin2', action: 'Created', target: 'Event: Seminar', changes: [
          { field: 'New Event', oldValue: '', newValue: 'Annual Seminar' }
        ], timestamp: new Date(Date.now() - 86400000) },
        { id: 'TRX-003', adminName: 'admin1', action: 'Deleted', target: 'Fine: PA-003', changes: [
          { field: 'Fine Record', oldValue: '₱200.00', newValue: 'Deleted' }
        ], timestamp: new Date(Date.now() - 172800000) }
      ],
      receiptDialog: false,
      currentReceipt: {},
      changesDialog: false,
      currentChanges: []
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
    filteredLoginLogs() {
      if (this.filter.type === 'All') return this.loginLogs;
      return this.loginLogs.filter(log => 
        this.filter.type === 'Login' ? log.action === 'Login' : log.action === 'Logout'
      );
    },
    filteredPaymentLogs() {
      return this.paymentLogs;
    },
    filteredTransactionLogs() {
      return this.transactionLogs;
    }
  },
  methods: {
    formatDateTime(date) {
      return format(new Date(date), 'MMM dd, yyyy hh:mm a');
    },
    getActionColor(action) {
      return action === 'Login' ? 'success' : 'error';
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
      this.currentChanges = item.changes;
      this.changesDialog = true;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins:300');

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

.filter-select {
  width: 200px;
}

.search-field {
  width: 300px;
}

.history-table {
  background-color: rgba(0, 0, 0, 0.3) !important;
  margin-top: 20px;
}

.history-table >>> thead th {
  background-color: rgba(0, 0, 0, 0.5) !important;
  color: #289bb8 !important;
  font-weight: 600;
}

.history-table >>> tbody tr {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

.history-table >>> tbody tr:hover {
  background-color: rgba(40, 155, 184, 0.2) !important;
}

.receipt-card {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid #289bb8 !important;
}

.receipt-header {
  background: rgba(40, 155, 184, 0.2) !important;
  border-bottom: 1px solid #289bb8 !important;
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
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.receipt-label {
  font-weight: 600;
  color: #289bb8;
}

.receipt-value {
  color: white;
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
}

.total-amount {
  color: #4caf50;
}

.receipt-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.changes-card {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 1px solid #289bb8 !important;
}

.changes-header {
  background: rgba(40, 155, 184, 0.2) !important;
  border-bottom: 1px solid #289bb8 !important;
  color: white;
  font-family: 'Poppins', sans-serif;
}

@media print {
  body * {
    visibility: hidden;
  }
  .receipt-card, .receipt-card * {
    visibility: visible;
  }
  .receipt-card {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white !important;
    color: black !important;
  }
  .receipt-actions {
    display: none !important;
  }
}
</style>