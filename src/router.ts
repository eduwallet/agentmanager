import { createWebHashHistory, createRouter } from 'vue-router'

import MainView from './pages/sub/Main.vue'
import IssuerView from './pages/sub/Issuer.vue'
import IssuerContexts from './pages/sub/issuer/Contexts.vue';
import IssuerCredentials from './pages/sub/issuer/Credentials.vue';
import IssuerIdentifiers from './pages/sub/issuer/Identifiers.vue';
import IssuerIssuers from './pages/sub/issuer/Issuers.vue';
import IssuerVcts from './pages/sub/issuer/Vcts.vue';
import VerifierView from './pages/sub/Verifier.vue'
import VerifierIdentifiers from './pages/sub/verifier/Identifiers.vue';
import VerifierPresentations from './pages/sub/verifier/Presentations.vue';
import VerifierVerifiers from './pages/sub/verifier/Verifiers.vue';
import StatusView from './pages/sub/Main.vue'

const routes = [
  { path: '/', component: MainView },
  {
      path: '/issuer',
      component: IssuerView,
      children: [
        {
          path: 'credentials',
          component: IssuerCredentials
        },
        {
          path: 'contexts',
          component: IssuerContexts
        },
        {
          path: 'vcts',
          component: IssuerVcts
        },
        {
          path: 'identifiers',
          component: IssuerIdentifiers
        },
        {
          path: 'issuers',
          component: IssuerIssuers
        }
      ]
  },
  {
      path: '/verifier',
      component: VerifierView,
      children: [
        {
          path: 'identifiers',
          component: VerifierIdentifiers
        },
        {
          path: 'presentations',
          component: VerifierPresentations
        },
        {
          path: 'verifiers',
          component: VerifierVerifiers
        }
      ]
  },
  { path: '/status', component: StatusView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})