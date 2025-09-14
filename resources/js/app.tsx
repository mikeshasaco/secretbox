import '../css/app.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
                path="/login" 
                element={user ? <Navigate to="/app" replace /> : <LoginPage />} 
            />
            <Route 
                path="/signup" 
                element={user ? <Navigate to="/app" replace /> : <SignupPage />} 
            />
            <Route 
                path="/app/*" 
                element={user ? (
                    <ProjectProvider>
                        <DashboardPage />
                    </ProjectProvider>
                ) : <Navigate to="/login" replace />} 
            />
        </Routes>
    );
}

const container = document.getElementById('app');
if (!container) {
    throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </QueryClientProvider>
);