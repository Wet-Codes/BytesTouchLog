import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import UserPage from '../views/UserPage.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import ManageEvent from '../views/ManageEvent.vue';
import ManageStudent from '../views/ManageStudent.vue'; 
import AboutView from '../views/AboutView.vue';
import AttendanceHistory from '@/views/AttendanceHistory.vue';
import Fp from "../views/CaptureFingerPrint.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/user',
    name: 'user',
    component: UserPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/students',
    name: 'students',
    component: StudentDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-students',
    name: 'manage-students',
    component: ManageStudent, 
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/manage-events',
    name: 'manage-events',
    component: ManageEvent,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/account',
    name: 'account',
    component: UserPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'logout',
    component: UserPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/attendance-history',
    name: 'attendance-history',
    component: AttendanceHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/fp',
    name: "FingerPrint",
    component: Fp
  },
  {
    path: '/fingerprint/:studentId?',
    name: 'fingerprint',
    component: Fp,
    meta: { requiresAuth: true },
    props: true
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});


export default router;
