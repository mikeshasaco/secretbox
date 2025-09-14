import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    BarChart3, 
    Users, 
    Activity, 
    Calendar, 
    Target, 
    DollarSign, 
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';

// Import tab components (we'll create these)
import VisitorsTab from '../components/dashboard/VisitorsTab';
import SessionsTab from '../components/dashboard/SessionsTab';
import EventsTab from '../components/dashboard/EventsTab';
import AdsTab from '../components/dashboard/AdsTab';
import SpendTab from '../components/dashboard/SpendTab';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import SettingsTab from '../components/dashboard/SettingsTab';

const tabs = [
    { id: 'visitors', name: 'Visitors', icon: Users, path: '/visitors' },
    { id: 'sessions', name: 'Sessions', icon: Activity, path: '/sessions' },
    { id: 'events', name: 'Events', icon: Calendar, path: '/events' },
    { id: 'ads', name: 'Ads', icon: Target, path: '/ads' },
    { id: 'spend', name: 'Spend', icon: DollarSign, path: '/spend' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
];

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const currentTab = tabs.find(tab => location.pathname.includes(tab.path)) || tabs[0];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <SidebarContent currentTab={currentTab} onLogout={handleLogout} />
                </div>
            </div>

            {/* Top bar - moved to top of screen */}
            <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
                <button
                    type="button"
                    className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="flex-1 px-4 flex justify-between">
                    <div className="flex-1 flex">
                        <h1 className="text-2xl font-semibold text-gray-900 self-center">
                            {currentTab.name}
                        </h1>
                    </div>
                    <div className="ml-4 flex items-center md:ml-6">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <LogOut className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Desktop sidebar */}
                <div className="hidden lg:flex lg:flex-shrink-0">
                    <div className="flex flex-col w-64">
                        <SidebarContent currentTab={currentTab} onLogout={handleLogout} />
                    </div>
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1">
                    {/* Page content */}
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                <Routes>
                                    <Route path="/" element={<VisitorsTab />} />
                                    <Route path="/visitors" element={<VisitorsTab />} />
                                    <Route path="/sessions" element={<SessionsTab />} />
                                    <Route path="/events" element={<EventsTab />} />
                                    <Route path="/ads" element={<AdsTab />} />
                                    <Route path="/spend" element={<SpendTab />} />
                                    <Route path="/analytics" element={<AnalyticsTab />} />
                                    <Route path="/settings" element={<SettingsTab />} />
                                </Routes>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function SidebarContent({ currentTab, onLogout }: { currentTab: any, onLogout: () => void }) {
    return (
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">Micro Tracker</span>
                </div>
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab.id === tab.id;
                        return (
                            <Link
                                key={tab.id}
                                to={`/app${tab.path}`}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                    isActive
                                        ? 'bg-blue-100 text-blue-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <Icon
                                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button
                    onClick={onLogout}
                    className="flex-shrink-0 w-full group block"
                >
                    <div className="flex items-center">
                        <div>
                            <LogOut className="inline-block h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                Sign out
                            </p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
