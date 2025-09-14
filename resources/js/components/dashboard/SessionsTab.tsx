import { Activity, Clock, MousePointer, TrendingUp } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';

export default function SessionsTab() {
    const { activeProject } = useProject();
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Sessions</h2>
                    <p className="text-sm text-gray-500">
                        Track user sessions and engagement metrics for {activeProject?.name || 'selected project'}
                    </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">0</span>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-12">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Sessions will appear here once users start interacting with your site.
                    </p>
                </div>
            </div>
        </div>
    );
}
