<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Create New Project</h3>
                    <button
                        @click="$emit('close')"
                        class="text-gray-400 hover:text-gray-600"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="createProject" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                        <input
                            v-model="form.name"
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="My Awesome Project"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                        <input
                            v-model="form.website_url"
                            type="url"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            v-model="form.description"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe your project..."
                        ></textarea>
                    </div>

                    <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-3">
                        <p class="text-red-600 text-sm">{{ error }}</p>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            @click="$emit('close')"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="creating"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {{ creating ? 'Creating...' : 'Create Project' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProjectStore } from '../stores/project';

const projectStore = useProjectStore();

const form = ref({
    name: '',
    website_url: '',
    description: ''
});

const creating = ref(false);
const error = ref('');

const createProject = async () => {
    creating.value = true;
    error.value = '';
    
    try {
        const result = await projectStore.createProject({
            name: form.value.name,
            website_url: form.value.website_url || undefined,
            description: form.value.description || undefined
        });
        
        if (result.success) {
            emit('created');
            // Reset form
            form.value = {
                name: '',
                website_url: '',
                description: ''
            };
        } else {
            error.value = result.error || 'Failed to create project';
        }
    } catch (err) {
        error.value = 'Failed to create project';
    } finally {
        creating.value = false;
    }
};

const emit = defineEmits(['close', 'created']);
</script>
