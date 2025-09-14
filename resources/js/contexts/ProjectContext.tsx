import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

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

interface ProjectContextType {
    activeProjectId: number | null;
    setActiveProjectId: (projectId: number | null) => void;
    projects: Project[];
    activeProject: Project | null;
    isLoading: boolean;
    error: Error | null;
    refetchProjects: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};

interface ProjectProviderProps {
    children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
    const [activeProjectId, setActiveProjectIdState] = useState<number | null>(null);
    const queryClient = useQueryClient();

    // Load active project from localStorage on mount
    useEffect(() => {
        const savedProjectId = localStorage.getItem('mt:activeProjectId');
        if (savedProjectId) {
            setActiveProjectIdState(parseInt(savedProjectId, 10));
        }
    }, []);

    // Fetch projects
    const { data: projects = [], isLoading, error, refetch } = useQuery({
        queryKey: ['projects'],
        queryFn: () => api.get('/v1/projects').then(res => res.data.data),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Debug logging
    console.log('ProjectContext:', { projects: projects.length, isLoading, error, activeProjectId });

    // Set active project to first project if none selected and projects are loaded
    useEffect(() => {
        if (projects.length > 0 && !activeProjectId) {
            const savedProjectId = localStorage.getItem('mt:activeProjectId');
            if (savedProjectId) {
                const projectId = parseInt(savedProjectId, 10);
                if (projects.find(p => p.id === projectId)) {
                    setActiveProjectIdState(projectId);
                } else {
                    setActiveProjectIdState(projects[0].id);
                }
            } else {
                setActiveProjectIdState(projects[0].id);
            }
        }
    }, [projects, activeProjectId]);

    const setActiveProjectId = (projectId: number | null) => {
        setActiveProjectIdState(projectId);
        if (projectId) {
            localStorage.setItem('mt:activeProjectId', projectId.toString());
        } else {
            localStorage.removeItem('mt:activeProjectId');
        }
    };

    const activeProject = projects.find(p => p.id === activeProjectId) || null;

    const refetchProjects = () => {
        refetch();
    };

    const value: ProjectContextType = {
        activeProjectId,
        setActiveProjectId,
        projects,
        activeProject,
        isLoading,
        error: error as Error | null,
        refetchProjects,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};
