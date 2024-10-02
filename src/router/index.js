import { createRouter, createWebHistory } from 'vue-router';
import SearchPage from '../components/SearchPage.vue';  // Atualize o caminho conforme necessário
import ScientistDetails from '../components/ScientistDetails.vue';

const routes = [
  {
    path: '/',
    name: 'SearchPage',
    component: SearchPage,
  },
  {
    path: '/scientist/:id',
    name: 'ScientistDetails',
    component: ScientistDetails,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;