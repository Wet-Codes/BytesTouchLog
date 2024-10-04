import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import UserPage from '../views/UserPage.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import StudentData from '../views/UploadData.vue';
import StudentFine from '../views/StudentFine.vue';
import AboutView from '../views/AboutView.vue';
import AttendanceHistory from '@/views/AttendanceHistory.vue'


const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/user',
    name: 'user',
    component: UserPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard
  },
  
  {
    path: '/students',
    name: 'students',
    component: StudentData
  },
  
  {
    path: '/view-reports',
    name: 'view-reports',
    component: StudentFine
  },
  {
    path: '/Account',
    name: 'Account',
    component: UserPage
  },
  {
    path: '/Logout',
    name: 'Logout',
    component: UserPage
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },

  {
    path: '/application-status',
    name: 'Application Status',
    component: StudentData
  },

  {
    path: '/attendance-history',
    name: 'attendance-history',
    component: AttendanceHistory
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
