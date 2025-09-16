import { api } from '../api';

export interface Project {
    id: number;
    name: string;
    description?: string;
    website_url?: string;
    public_key: string;
    secret_key: string;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    website_url?: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    website_url?: string;
}

export const projectApi = {
    // Get all projects for the current user
    async getProjects(): Promise<Project[]> {
        const response = await api.get('/v1/projects');
        return response.data.data || [];
    },

    // Create a new project
    async createProject(data: CreateProjectData): Promise<{ success: boolean; data?: Project; error?: string }> {
        try {
            const response = await api.post('/v1/projects', data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to create project' 
            };
        }
    },

    // Update an existing project
    async updateProject(id: number, data: UpdateProjectData): Promise<{ success: boolean; data?: Project; error?: string }> {
        try {
            const response = await api.put(`/v1/projects/${id}`, data);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to update project' 
            };
        }
    },

    // Rotate API keys for a project
    async rotateKeys(id: number): Promise<{ success: boolean; data?: { public_key: string; secret_key: string; masked_secret_key: string }; error?: string }> {
        try {
            const response = await api.post(`/v1/projects/${id}/rotate-keys`);
            return { success: true, data: response.data.data };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to rotate keys' 
            };
        }
    },

    // Delete a project
    async deleteProject(id: number): Promise<{ success: boolean; error?: string }> {
        try {
            await api.delete(`/v1/projects/${id}`);
            return { success: true };
        } catch (error: any) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to delete project' 
            };
        }
    }
};