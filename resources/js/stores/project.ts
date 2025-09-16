import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { projectApi } from '../lib/api/projects';

interface Project {
    id: number;
    name: string;
    description?: string;
    website_url?: string;
    public_key: string;
    secret_key: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const useProjectStore = defineStore('project', () => {
    const projects = ref<Project[]>([]);
    const activeProjectId = ref<number | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const activeProject = computed(() => {
        return projects.value.find(p => p.id === activeProjectId.value) || null;
    });

    const initialize = async () => {
        await loadProjects();
        
        // Try to restore active project from localStorage
        const savedProjectId = localStorage.getItem('mt:activeProjectId');
        if (savedProjectId) {
            const projectId = parseInt(savedProjectId);
            if (projects.value.find(p => p.id === projectId)) {
                activeProjectId.value = projectId;
            }
        }
        
        // If no saved project or saved project not found, use first project
        if (!activeProjectId.value && projects.value.length > 0) {
            activeProjectId.value = projects.value[0].id;
            localStorage.setItem('mt:activeProjectId', activeProjectId.value.toString());
        }
    };

    const loadProjects = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            const data = await projectApi.getProjects();
            projects.value = data;
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to load projects';
            console.error('Failed to load projects:', err);
        } finally {
            loading.value = false;
        }
    };

    const setActiveProject = (projectId: number) => {
        activeProjectId.value = projectId;
        localStorage.setItem('mt:activeProjectId', projectId.toString());
    };

    const createProject = async (projectData: { name: string; description?: string; website_url?: string }) => {
        const result = await projectApi.createProject(projectData);
        
        if (result.success && result.data) {
            projects.value.push(result.data);
            setActiveProject(result.data.id);
            return { success: true, project: result.data };
        } else {
            return { 
                success: false, 
                error: result.error || 'Failed to create project' 
            };
        }
    };

    const updateProject = async (projectId: number, projectData: { name?: string; description?: string; website_url?: string }) => {
        const result = await projectApi.updateProject(projectId, projectData);
        
        if (result.success && result.data) {
            const index = projects.value.findIndex(p => p.id === projectId);
            if (index !== -1) {
                projects.value[index] = result.data;
            }
            return { success: true, project: result.data };
        } else {
            return { 
                success: false, 
                error: result.error || 'Failed to update project' 
            };
        }
    };

    const rotateKeys = async (projectId: number) => {
        const result = await projectApi.rotateKeys(projectId);
        
        if (result.success && result.data) {
            const index = projects.value.findIndex(p => p.id === projectId);
            if (index !== -1) {
                // Update the project with new keys
                projects.value[index] = {
                    ...projects.value[index],
                    public_key: result.data.public_key,
                    secret_key: result.data.secret_key
                };
            }
            return { success: true, data: result.data };
        } else {
            return { 
                success: false, 
                error: result.error || 'Failed to rotate keys' 
            };
        }
    };

    return {
        projects,
        activeProjectId,
        activeProject,
        loading,
        error,
        initialize,
        loadProjects,
        setActiveProject,
        createProject,
        updateProject,
        rotateKeys
    };
});
