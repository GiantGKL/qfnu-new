// 路由管理
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import HomePage from '@/components/HomePage.vue';
import TargetPage from '@/components/TargetPage.vue';
import Perception from '@/components/Perception.vue';
import TeacherHomePage from '@/components/TeacherHomePage.vue';
import App from '@/App.vue';

// 路由配置（登录认证）
const routes = [
  { path: '/', redirect: '/login' },/**根路径 */
  { path: '/login', component: Login },
  { path: '/student/home', component: App, meta: { requiresAuth: true, role: 'student' } },
  { path: '/student/target', component: TargetPage, meta: { requiresAuth: true, role: 'student' } },
  { path: '/student/perception', component: Perception, meta: { requiresAuth: true, role: 'student' } },
  { path: '/teacher/home', component: TeacherHomePage, meta: { requiresAuth: true, role: 'teacher' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('userRole');
  const userRole = localStorage.getItem('userRole');

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login');
    } else if (to.meta.role && to.meta.role !== userRole) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
