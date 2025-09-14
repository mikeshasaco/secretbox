import { api } from '../api';

export interface Project {
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
    /**
     * Get all projects for the current user
     */
    list: async (): Promise<{ data: Project[]; meta: any }> => {
        const response = await api.get('/v1/projects');
        return response.data;
    },

    /**
     * Get a specific project by ID
     */
    get: async (id: number): Promise<Project> => {
        const response = await api.get(`/v1/projects/${id}`);
        return response.data;
    },

    /**
     * Create a new project
     */
    create: async (data: CreateProjectData): Promise<Project> => {
        const response = await api.post('/v1/projects', data);
        return response.data;
    },

    /**
     * Update an existing project
     */
    update: async (id: number, data: UpdateProjectData): Promise<Project> => {
        const response = await api.put(`/v1/projects/${id}`, data);
        return response.data;
    },

    /**
     * Delete a project
     */
    delete: async (id: number): Promise<void> => {
        await api.delete(`/v1/projects/${id}`);
    },

    /**
     * Rotate API keys for a project
     */
    rotateKeys: async (id: number): Promise<{
        message: string;
        public_key: string;
        secret_key: string;
        masked_secret_key: string;
    }> => {
        const response = await api.post(`/v1/projects/${id}/rotate-keys`);
        return response.data;
    },
};
