import { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi, CreateProjectData } from '../lib/api/projects';
import { useProject } from '../contexts/ProjectContext';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<CreateProjectData>({
        name: '',
        description: '',
        website_url: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const { setActiveProjectId, refetchProjects } = useProject();
    const queryClient = useQueryClient();

    const createProjectMutation = useMutation({
        mutationFn: projectApi.create,
        onSuccess: (newProject) => {
            // Add the new project to the cache
            queryClient.setQueryData(['projects'], (old: any) => ({
                ...old,
                data: [...(old?.data || []), newProject]
            }));
            
            // Set as active project
            setActiveProjectId(newProject.id);
            
            // Close modal and reset form
            onClose();
            setFormData({ name: '', description: '', website_url: '' });
            setErrors({});
            
            // Show success message (you might want to add a toast system)
            console.log('Project created successfully');
        },
        onError: (error: any) => {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error('Failed to create project:', error);
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        if (!formData.name.trim()) {
            setErrors({ name: 'Project name is required' });
            return;
        }

        createProjectMutation.mutate(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
                
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Create New Project
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.name ? 'border-red-300' : ''
                                }`}
                                placeholder="Enter project name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter project description (optional)"
                            />
                        </div>

                        <div>
                            <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
                                Website URL
                            </label>
                            <input
                                type="url"
                                id="website_url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createProjectMutation.isPending}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
