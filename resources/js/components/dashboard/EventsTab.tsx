import { Calendar, Search, Filter } from 'lucide-react';

export default function EventsTab() {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Events</h2>
                        <p className="text-sm text-gray-500">
                            Track and analyze user events and interactions
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">0</span>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-12">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Events will appear here once users start interacting with your site.
                    </p>
                </div>
            </div>
        </div>
    );
}
