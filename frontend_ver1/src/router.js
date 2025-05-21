import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import RegisterView from './views/RegisterView.vue';

const routes = [
  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// delay Pinia store usage until guard runtime
router.beforeEach(async (to, _from, next) => {
  const { useAuthStore } = await import('./stores/auth.js');
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
