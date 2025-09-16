<template>
    <div class="space-y-8">
        <div v-if="!projectStore.activeProject" class="text-center py-8">
            <p class="text-gray-500">No project selected</p>
        </div>

        <div v-else class="space-y-8">
            <!-- Project Settings -->
            <div class="bg-white shadow-sm rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Project Settings</h3>
                            <p class="text-sm text-gray-600">Manage your project configuration and API keys</p>
                        </div>
                        <button class="p-2 text-gray-400 hover:text-gray-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                            <input
                                v-model="projectName"
                                type="text"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                            <input
                                v-model="websiteUrl"
                                type="url"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                v-model="description"
                                rows="3"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                    </div>
                    <div class="mt-6">
                        <button
                            @click="updateProject"
                            :disabled="updating"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-colors duration-200"
                        >
                            {{ updating ? 'Updating...' : 'Update Project' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- API Keys -->
            <div class="bg-white shadow-sm rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">API Keys</h3>
                </div>
                <div class="p-6 space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Public Key</label>
                        <div class="flex">
                            <input
                                :value="projectStore.activeProject.public_key"
                                type="text"
                                readonly
                                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                            />
                            <button
                                @click="copyToClipboard(projectStore.activeProject.public_key)"
                                class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                        <div class="flex">
                            <input
                                :value="showSecret ? projectStore.activeProject.secret_key : maskedSecretKey"
                                type="text"
                                readonly
                                class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                            />
                            <button
                                @click="showSecret = !showSecret"
                                class="px-3 py-2 border border-l-0 border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <svg v-if="!showSecret" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                </svg>
                            </button>
                            <button
                                @click="copyToClipboard(projectStore.activeProject.secret_key)"
                                class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </button>
                        </div>
                        <p class="mt-2 text-sm text-gray-500">
                            Keep your secret key secure and never share it publicly
                        </p>
                    </div>

                    <div class="pt-4 border-t border-gray-200">
                        <button
                            @click="rotateKeys"
                            :disabled="rotating"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            {{ rotating ? 'Rotating...' : 'Rotate API Keys' }}
                        </button>
                        <p class="mt-2 text-sm text-gray-500">
                            Rotating keys will invalidate all existing API keys. Make sure to update your integrations.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Integration Code -->
            <div class="bg-white shadow-sm rounded-lg border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">Integration Code</h3>
                </div>
                <div class="p-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            JavaScript Tracking Code
                        </label>
                        <div class="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                            <pre>{{ integrationCode }}</pre>
                        </div>
                        <button
                            @click="copyToClipboard(integrationCode)"
                            class="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Copy Code
                        </button>
                        <p class="mt-2 text-sm text-gray-500">
                            Add this code to the &lt;head&gt; section of your website to start tracking visitors and events.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProjectStore } from '../../stores/project';

const projectStore = useProjectStore();

const projectName = ref('');
const websiteUrl = ref('');
const description = ref('');
const showSecret = ref(false);
const updating = ref(false);
const rotating = ref(false);

const maskedSecretKey = computed(() => {
    if (!projectStore.activeProject?.secret_key) return '';
    const key = projectStore.activeProject.secret_key;
    return key.substring(0, 8) + '•'.repeat(24) + key.slice(-4);
});

const integrationCode = computed(() => {
    if (!projectStore.activeProject) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';
    return `<${'script'} data-api="${origin}/api" data-project-id="${projectStore.activeProject.id}" data-public-key="${projectStore.activeProject.public_key}" src="${origin}/tracking-snippet.js"></${'script'}>`;
});

const loadProjectData = () => {
    if (projectStore.activeProject) {
        projectName.value = projectStore.activeProject.name;
        websiteUrl.value = projectStore.activeProject.website_url || '';
        description.value = projectStore.activeProject.description || '';
    }
};

const updateProject = async () => {
    if (!projectStore.activeProject) return;
    
    updating.value = true;
    
    try {
        const result = await projectStore.updateProject(projectStore.activeProject.id, {
            name: projectName.value,
            website_url: websiteUrl.value,
            description: description.value
        });
        
        if (result.success) {
            console.log('Project updated');
        } else {
            console.error('Failed to update project:', result.error);
        }
    } catch (error) {
        console.error('Error updating project:', error);
    } finally {
        updating.value = false;
    }
};

const rotateKeys = async () => {
    if (!projectStore.activeProject) return;
    
    rotating.value = true;
    
    try {
        const result = await projectStore.rotateKeys(projectStore.activeProject.id);
        
        if (result.success) {
            console.log('Keys rotated');
        } else {
            console.error('Failed to rotate keys:', result.error);
        }
    } catch (error) {
        console.error('Error rotating keys:', error);
    } finally {
        rotating.value = false;
    }
};

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
    }
};

onMounted(() => {
    loadProjectData();
});
</script>