import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from './components/MainLayout.vue';
import Dashboard from './components/Dashboard.vue';
import CreateInvitation from './components/CreateInvitation.vue';
import Scanner from './components/Scanner.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'create-invitation', component: CreateInvitation },
      { path: 'qr-scanner', component: Scanner }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;