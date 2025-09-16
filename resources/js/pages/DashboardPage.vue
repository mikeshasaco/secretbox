<template>
    <div class="min-h-screen bg-gray-50 flex">
        <!-- Sidebar -->
        <div class="w-64 bg-white shadow-lg border-r border-gray-200">
            <!-- Logo -->
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <h1 class="text-xl font-bold text-gray-900">Micro Tracker</h1>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="mt-12">
                <div class="px-6 space-y-3">
                    <button
                        v-for="tab in tabs"
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        :class="[
                            activeTab === tab.id
                                ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-6 py-4 text-sm font-medium rounded-l-lg transition-all duration-200 w-full text-left'
                        ]"
                    >
                        <component :is="tab.icon" class="mr-4 h-5 w-5 flex-shrink-0" />
                        <span class="truncate">{{ tab.name }}</span>
                        <div v-if="activeTab === tab.id" class="ml-auto">
                            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                    </button>
                </div>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col">
            <!-- Top Bar -->
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="px-6 py-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-6">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">{{ getCurrentTabName() }}</h2>
                                <p class="text-sm text-gray-500 mt-1">Manage your analytics and tracking data</p>
                            </div>
                            <!-- Project Switcher -->
                            <div v-if="projectStore.activeProject" class="flex items-center space-x-3">
                                <div class="flex items-center space-x-2">
                                    <label class="text-sm font-medium text-gray-700">Project:</label>
                                    <select 
                                        v-model="projectStore.activeProjectId" 
                                        @change="handleProjectChange"
                                        class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option 
                                            v-for="project in projectStore.projects" 
                                            :key="project.id" 
                                            :value="project.id"
                                        >
                                            {{ project.name }}
                                        </option>
                                    </select>
                                </div>
                                <button
                                    @click="showCreateProjectModal = true"
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    <span>Create Project</span>
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <div class="text-right">
                                <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
                                <p class="text-xs text-gray-500">Welcome back</p>
                            </div>
                            <button
                                @click="handleLogout"
                                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                title="Logout"
                            >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-1 bg-gray-50 p-8">
                <div v-if="projectStore.loading" class="text-center py-12">
                    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p class="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
                
                <div v-else-if="!projectStore.activeProject" class="text-center py-12">
                    <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">No Project Selected</h2>
                        <p class="text-gray-600 mb-6">Create your first project to start tracking analytics and gaining insights.</p>
                        <button
                            @click="showCreateProjectModal = true"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Create Your First Project</span>
                        </button>
                    </div>
                </div>
                
                <div v-else class="space-y-6">
                    <!-- Visitors Tab -->
                    <div v-if="activeTab === 'visitors'">
                        <VisitorsTab />
                    </div>

                    <!-- Sessions Tab -->
                    <div v-else-if="activeTab === 'sessions'">
                        <SessionsTab />
                    </div>

                    <!-- Events Tab -->
                    <div v-else-if="activeTab === 'events'">
                        <EventsTab />
                    </div>

                    <!-- Settings Tab -->
                    <div v-else-if="activeTab === 'settings'">
                        <SettingsTab />
                    </div>
                </div>
            </main>
        </div>

        <!-- Create Project Modal -->
        <CreateProjectModal 
            v-if="showCreateProjectModal"
            @close="showCreateProjectModal = false"
            @created="handleProjectCreated"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useProjectStore } from '../stores/project';
import VisitorsTab from '../components/dashboard/VisitorsTab.vue';
import SessionsTab from '../components/dashboard/SessionsTab.vue';
import EventsTab from '../components/dashboard/EventsTab.vue';
import SettingsTab from '../components/dashboard/SettingsTab.vue';
import CreateProjectModal from '../components/CreateProjectModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();

const activeTab = ref('visitors');
const showCreateProjectModal = ref(false);

// Icon components
const VisitorsIcon = {
    template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
    </svg>`
};

const SessionsIcon = {
    template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
    </svg>`
};

const EventsIcon = {
    template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>`
};

const SettingsIcon = {
    template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>`
};

const tabs = [
    { id: 'visitors', name: 'Visitors', icon: VisitorsIcon },
    { id: 'sessions', name: 'Sessions', icon: SessionsIcon },
    { id: 'events', name: 'Events', icon: EventsIcon },
    { id: 'settings', name: 'Settings', icon: SettingsIcon }
];

onMounted(async () => {
    await projectStore.initialize();
});

const handleLogout = async () => {
    await authStore.logout();
    router.push('/');
};

const handleProjectChange = () => {
    if (projectStore.activeProjectId) {
        projectStore.setActiveProject(projectStore.activeProjectId);
    }
};

const handleProjectCreated = () => {
    showCreateProjectModal.value = false;
    projectStore.loadProjects();
};

const getCurrentTabName = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab.value);
    return currentTab ? currentTab.name : 'Dashboard';
};
</script>
