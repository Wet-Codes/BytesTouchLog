<template>
  <div>
    <page-header />
    <div :style="backgroundStyle">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card class="fine-card" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <h1 class="table-title">Event Management</h1>
                <v-btn 
                  color="teal" 
                  dark
                  @click="openCreateDialog"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Create New Event
                </v-btn>
              </v-card-title>
              <v-card-text>
                <div class="filter-container">
                  <v-select
                    v-model="filter.semester"
                    :items="semesters"
                    label="Filter by Semester"
                    outlined
                    dense
                    dark
                    hide-details
                    style="max-width: 200px;"
                  ></v-select>
                </div>
                <div class="event-list-header">
                  <span class="col-name">Event Name</span>
                  <span class="col-semester">Semester</span>
                  <span class="col-date">Date</span>
                  <span class="col-actions">Actions</span>
                </div>
                <v-data-table
                  :headers="tableHeaders"
                  :items="filteredEvents"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                  class="elevation-1 event-table"
                  dark
                  hide-default-header
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td class="col-name text-left">{{ item.name }}</td>
                      <td class="col-semester text-left">{{ item.semester }}</td>
                      <td class="col-date text-left">{{ formatDate(item.date) }}</td>
                      <td class="col-actions text-center">
                        <div class="action-buttons">
                          <v-btn small color="primary" @click="initiateEdit(item)">
                            <v-icon small left>mdi-pencil</v-icon>
                            Edit
                          </v-btn>
                        </div>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Create Event Dialog -->
      <v-dialog v-model="createDialog" max-width="600" persistent>
        <v-card class="fine-card">
          <v-card-title>Create New Event</v-card-title>
          <v-card-text>
            <v-form ref="creationForm" @submit.prevent="submitNewEvent">
              <v-text-field 
                v-model="newEvent.name" 
                label="Event Name"
                outlined
                dark
                :rules="[v => !!v || 'Event name is required']"
                required
              ></v-text-field>
              <v-select
                v-model="newEvent.semester"
                :items="semesters.filter(s => s !== 'All')"
                label="Semester"
                outlined
                dense
                dark
                hide-details
                :rules="[v => !!v || 'Semester is required']"
                required
              ></v-select>
              <v-text-field 
                v-model="newEvent.date" 
                label="Date" 
                type="date"
                outlined
                dark
                :rules="[v => !!v || 'Date is required']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="closeCreateDialog">Cancel</v-btn>
            <v-btn color="teal" dark @click="submitNewEvent">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Edit Event Dialog -->
      <v-dialog v-model="editDialog" max-width="600" persistent>
        <v-card class="fine-card">
          <v-card-title>Edit Event</v-card-title>
          <v-card-text>
            <v-form ref="editForm" @submit.prevent="updateEvent">
              <v-text-field 
                v-model="editingEvent.name" 
                label="Event Name"
                outlined
                dark
                :rules="[v => !!v || 'Event name is required']"
                required
              ></v-text-field>
              <v-select
                v-model="editingEvent.semester"
                :items="semesters.filter(s => s !== 'All')"
                label="Semester"
                outlined
                dense
                dark
                hide-details
                :rules="[v => !!v || 'Semester is required']"
                required
              ></v-select>
              <v-text-field 
                v-model="editingEvent.date" 
                label="Date" 
                type="date"
                outlined
                dark
                :rules="[v => !!v || 'Date is required']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="closeEditDialog">Cancel</v-btn>
            <v-btn color="teal" dark @click="updateEvent">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/components/CustomHeader2.vue';
import { format } from 'date-fns';
import EventService from '@/services/AuthServices';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      backgroundImage: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg",
      createDialog: false,
      editDialog: false,
      filter: {
        semester: 'All'
      },
      semesters: ['All', '1st Semester', '2nd Semester'],
      newEvent: {
        name: '',
        semester: '1st Semester',
        date: ''
      },
      editingEvent: {
        id: null,
        name: '',
        semester: '',
        date: ''
      },
      events: [],
      tableHeaders: [
        { text: 'Event Name', value: 'name' },
        { text: 'Semester', value: 'semester' },
        { text: 'Date', value: 'date' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
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
    filteredEvents() {
      return this.events.filter(event => 
        this.filter.semester === 'All' || event.semester === this.filter.semester
      );
    }
  },
  async mounted() {
    await this.fetchEvents();
  },
  methods: {
    formatDate(dateString) {
      return dateString ? format(new Date(dateString), 'MMM dd, yyyy') : 'N/A';
    },
    
    async fetchEvents() {
      try {
        const response = await EventService.getEvents();
        this.events = response.data;
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },

    openCreateDialog() {
      this.createDialog = true;
    },

    closeCreateDialog() {
      this.createDialog = false;
      this.$refs.creationForm?.reset();
      this.newEvent = { 
        name: '', 
        semester: '1st Semester',
        date: '' 
      };
    },

      async submitNewEvent() {
    try {
      if (!this.$refs.creationForm.validate()) return;
      
      const response = await EventService.createEvent(this.newEvent);
      this.events.push(response.data);
      this.closeCreateDialog();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  },


    initiateEdit(item) {
      this.editingEvent = { ...item };
      this.editDialog = true;
    },

    closeEditDialog() {
      this.editDialog = false;
      this.$refs.editForm?.reset();
      this.editingEvent = { 
        id: null, 
        name: '', 
        semester: '',
        date: '' 
      };
    },

     async updateEvent() {
    try {
      if (!this.$refs.editForm.validate()) return;
      
      const response = await EventService.updateEvent(this.editingEvent.eventId, this.editingEvent);
const updatedEvent = response.data;

const index = this.events.findIndex(e => e.eventId === updatedEvent.eventId);
if (index !== -1) {
  this.events.splice(index, 1, updatedEvent);
}
      this.closeEditDialog();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }
}
};
</script>