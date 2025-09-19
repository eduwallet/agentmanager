import { createWebHashHistory, createRouter } from 'vue-router'

import MainView from './pages/sub/Main.vue'
import IssuerView from './pages/sub/Issuer.vue'
import IssuerIdentifiers from './pages/sub/issuer/Identifiers.vue';
import VerifierView from './pages/sub/Main.vue'
import StatusView from './pages/sub/Main.vue'

const routes = [
  { path: '/', component: MainView },
  {
      path: '/issuer',
      component: IssuerView,
      children: [
        {
          path: 'identifiers',
          component: IssuerIdentifiers
        }
      ]
  },
  { path: '/verifier', component: VerifierView },
  { path: '/status', component: StatusView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})