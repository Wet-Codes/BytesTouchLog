import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import UserPage from '../views/UserPage.vue';
import Home from '../views/AdminDashboard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import ManageEvent from '../views/ManageEvent.vue';
import ManageStudent from '../views/ManageStudent.vue'; 
import AboutView from '../views/AboutView.vue';
import AttendanceHistory from '@/views/AttendanceHistory.vue';
import HistoryLog from '@/views/HistoryLog.vue'
import Fp from "../views/CaptureFingerPrint.vue";
import AccountManagement from "../views/AccountManagement.vue";
import AccSetting from "../views/AccSetting.vue";
import AccountList from '../views/AccountList.vue';
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
    path: '/account-list',
    name: 'AccountList',
    component: AccountList,
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
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
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
    path:'/history-log',
    name:'history-log',
    component: HistoryLog,
    meta: { requiresAuth: true }
  },
  {
    path: '/manage-events',
    name: 'manage-events',
    component: ManageEvent,
    meta: { requiresAuth: true }
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
    component: Fp,
    meta: { requiresAuth: true }
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
      return next('/home');
    }
  }

  next();
});

 


export default router;
