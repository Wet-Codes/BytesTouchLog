import { createRouter, createWebHashHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import UserPage from '../views/UserPage.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import ManageUsers from '../views/ManageUsers.vue';
import ViewReports from '../views/ViewReports.vue';
import AboutView from '../views/AboutView.vue';

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
    path: '/manage-users',
    name: 'manage-users',
    component: ManageUsers
  },
  
  {
    path: '/view-reports',
    name: 'view-reports',
    component: ViewReports
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
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
