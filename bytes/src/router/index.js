import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import UserPage from '../views/UserPage.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import ManageEvent from '../views/ManageEvent.vue';
import ManageStudent from '../views/ManageStudent.vue'; 
import AboutView from '../views/AboutView.vue';
import AttendanceHistory from '@/views/AttendanceHistory.vue';
import HistoryLog from '@/views/HistoryLog.vue'
import Fp from "../views/CaptureFingerPrint.vue";
import AccountManagement from "../views/AccountManagement.vue";
import AccSetting from "../views/AccSetting.vue";
import store from '@/store';


const routes = [
   {
    path: '/',
    name: 'login',
    component: LoginPage,
    meta: { public: true } // No auth needed
  },
  {
    path: '/account-management',
    name: 'AccountManagement',
    component: AccountManagement,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/account-settings',
    name: 'AccSetting',
    component: AccSetting,
    meta: { requiresAuth: true }
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
    
  },
  {
    path: '/manage-students',
    name: 'manage-students',
    component: ManageStudent, 
    
  },
  {
    path:'/history-log',
    name:'history-log',
    component: HistoryLog
  },
  {
    path: '/manage-events',
    name: 'manage-events',
    component: ManageEvent,
    
  },
  {
    path: '/account',
    name: 'account',
    component: UserPage,
   
  },
  {
    path: '/logout',
    name: 'logout',
    component: UserPage,
    
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

    props: true
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => { // Make the callback async
  await store.dispatch('initializeAuth'); // Wait for auth initialization

  const isAuthenticated = store.getters.isAuthenticated;
  const userRole = store.getters.userRole;

  // 1. Check public routes
  if (to.meta?.public) return next();

  // 2. Check authentication
  if (to.meta?.requiresAuth) {
    if (!isAuthenticated) {
      return next('/');
    }

    // 3. Check admin privileges
    if (to.meta?.adminOnly && userRole !== 'admin') {
      return next('/user');
    }
  }

  next();
});

 


export default router;
