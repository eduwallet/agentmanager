import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/v4-shims.scss';

import MainPage from './pages/MainPage.vue';
import ElementPlus from 'element-plus';
import './styles/index.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';

const pinia = createPinia();
var app= createApp(MainPage);
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.mount('#app');
