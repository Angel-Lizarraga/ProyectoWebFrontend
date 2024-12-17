import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Inicio', component: () => import('@/pages/Inicio.vue'), meta: { title: 'Inicio - Mi Proyecto CRUD' } },
  { path: '/estudiantes', name: 'Estudiantes', component: () => import('@/pages/Estudiantes.vue'), meta: { title: 'Estudiantes - Mi Proyecto CRUD' } },
  { path: '/cursos', name: 'Cursos', component: () => import('@/pages/Cursos.vue'), meta: { title: 'Cursos - Mi Proyecto CRUD' } },
  { path: '/profesores', name: 'Profesores', component: () => import('@/pages/Profesores.vue'), meta: { title: 'Profesores - Mi Proyecto CRUD' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const app = document.querySelector('#app')?.__vue_app__;
  app?.config.globalProperties.$showLoader();
  next();
});

router.afterEach(() => {
  const app = document.querySelector('#app')?.__vue_app__;
  setTimeout(() => app?.config.globalProperties.$hideLoader(), 500);
});

router.afterEach((to) => {
  document.title = to.meta.title || 'Mi Proyecto CRUD';
});

export default router;
