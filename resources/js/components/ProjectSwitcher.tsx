import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { CreateProjectModal } from './CreateProjectModal';

export const ProjectSwitcher: React.FC = () => {
    const { activeProject, projects, setActiveProjectId } = useProject();
    const [isOpen, setIsOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Debug logging
    console.log('ProjectSwitcher render:', { activeProject, projects: projects?.length || 0, isOpen });

    const handleProjectSelect = (projectId: number) => {
        setActiveProjectId(projectId);
        setIsOpen(false);
    };

    const handleCreateProject = () => {
        setShowCreateModal(true);
        setIsOpen(false);
    };

    if (!activeProject) {
        return (
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleCreateProject}
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Project
                </button>
                <CreateProjectModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                />
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                <span className="truncate">{activeProject.name}</span>
                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                            Projects
                        </div>
                        
                        {projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => handleProjectSelect(project.id)}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                    project.id === activeProject.id
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700'
                                }`}
                            >
                                <div className="font-medium">{project.name}</div>
                                {project.description && (
                                    <div className="text-xs text-gray-500 truncate">
                                        {project.description}
                                    </div>
                                )}
                            </button>
                        ))}
                        
                        <div className="border-t border-gray-100">
                            <button
                                onClick={handleCreateProject}
                                className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CreateProjectModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};
