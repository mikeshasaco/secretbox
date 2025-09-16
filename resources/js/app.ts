import '../css/app.css';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import LandingPage from './pages/LandingPage.vue';
import LoginPage from './pages/LoginPage.vue';
import SignupPage from './pages/SignupPage.vue';
import DashboardPage from './pages/DashboardPage.vue';
import { useAuthStore } from './stores/auth';
import { useProjectStore } from './stores/project';

const routes = [
    { path: '/', component: LandingPage },
    { 
        path: '/login', 
        component: LoginPage,
        beforeEnter: async (to, from, next) => {
            const authStore = useAuthStore();
            await authStore.initialize();
            if (authStore.user) {
                next('/app');
            } else {
                next();
            }
        }
    },
    { 
        path: '/signup', 
        component: SignupPage,
        beforeEnter: async (to, from, next) => {
            const authStore = useAuthStore();
            await authStore.initialize();
            if (authStore.user) {
                next('/app');
            } else {
                next();
            }
        }
    },
    { 
        path: '/app', 
        component: DashboardPage,
        beforeEnter: async (to, from, next) => {
            const authStore = useAuthStore();
            await authStore.initialize();
            if (authStore.user) {
                next();
            } else {
                next('/login');
            }
        }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);

app.mount('#app');
