<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="form idle" elevation="2">
          <v-card-title>
            <h2 class="text-h5">Attendance History Log</h2>
          </v-card-title>
          <v-card-text>
            <!-- Display your attendance history here -->
            <v-data-table
              :headers="headers"
              :items="attendanceRecords"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:body="props">
                <v-table-body :items="props.items" :headers="headers">
                  <template v-slot:item="{ item }">
                    <v-table-row>
                      <v-table-cell>{{ item.date }}</v-table-cell>
                      <v-table-cell>{{ item.status }}</v-table-cell>
                      <v-table-cell>{{ item.notes }}</v-table-cell>
                    </v-table-row>
                  </template>
                </v-table-body>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Status', value: 'status' },
        { text: 'Notes', value: 'notes' }
      ],
      attendanceRecords: [
        // Sample data, replace with real data
        { id: 1, date: '2024-07-01', status: 'Present', notes: 'On time' },
        { id: 2, date: '2024-07-02', status: 'Absent', notes: 'Sick leave' }
      ]
    };
  }
};
</script>

<style scoped>
.v-card-title {
  color: white;
}

.v-card-text {
  color: white;
}
</style>
