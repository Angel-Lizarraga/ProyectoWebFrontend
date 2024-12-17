import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

const app = createApp(App);

app.config.globalProperties.$showLoader = () => {
  const loader = document.getElementById('app-loader');
  if (loader) loader.style.display = 'block';
};

app.config.globalProperties.$hideLoader = () => {
  const loader = document.getElementById('app-loader');
  if (loader) loader.style.display = 'none';
};

app.use(router).use(vuetify).mount('#app');
