import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useProject } from '../../contexts/ProjectContext';
import { Users, Bot, Clock, Globe } from 'lucide-react';

interface Visitor {
    id: number;
    visitor_key: string;
    first_seen_at: string;
    last_seen_at: string;
    sessions_count: number;
    is_bot: boolean;
    timezone: string | null;
    viewport_w: number | null;
    viewport_h: number | null;
    user_agent: string | null;
}

export default function VisitorsTab() {
    const { activeProject } = useProject();
    const [filters, setFilters] = useState({
        is_bot: '',
        utm_source: '',
        page: 1,
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['visitors', activeProject?.id, filters],
        queryFn: async () => {
            if (!activeProject) return null;
            const response = await api.get(`/v1/projects/${activeProject.id}/visitors`, {
                params: filters,
            });
            return response.data;
        },
        enabled: !!activeProject,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getViewportSize = (w: number | null, h: number | null) => {
        if (!w || !h) return 'Unknown';
        return `${w}×${h}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                Error loading visitors: {error.message}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Visitors</h2>
                        <p className="text-sm text-gray-500">
                            Track and analyze visitor behavior
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">
                            {data?.meta?.pagination?.total || 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bot Filter
                        </label>
                        <select
                            value={filters.is_bot}
                            onChange={(e) => setFilters({ ...filters, is_bot: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Visitors</option>
                            <option value="false">Humans Only</option>
                            <option value="true">Bots Only</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            UTM Source
                        </label>
                        <input
                            type="text"
                            value={filters.utm_source}
                            onChange={(e) => setFilters({ ...filters, utm_source: e.target.value })}
                            placeholder="Filter by UTM source"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ is_bot: '', utm_source: '', page: 1 })}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Visitors Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Visitor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    First Seen
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Seen
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sessions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Viewport
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.data?.map((visitor: Visitor) => (
                                <tr key={visitor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <Users className="h-4 w-4 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {visitor.visitor_key.substring(0, 8)}...
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {visitor.timezone || 'Unknown timezone'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            {formatDate(visitor.first_seen_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            {formatDate(visitor.last_seen_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {visitor.sessions_count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {getViewportSize(visitor.viewport_w, visitor.viewport_h)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            visitor.is_bot
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {visitor.is_bot ? (
                                                <>
                                                    <Bot className="h-3 w-3 mr-1" />
                                                    Bot
                                                </>
                                            ) : (
                                                <>
                                                    <Globe className="h-3 w-3 mr-1" />
                                                    Human
                                                </>
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.meta?.pagination && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                disabled={data.meta.pagination.current_page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                disabled={data.meta.pagination.current_page === data.meta.pagination.last_page}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(data.meta.pagination.current_page - 1) * data.meta.pagination.per_page + 1}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium">
                                        {Math.min(
                                            data.meta.pagination.current_page * data.meta.pagination.per_page,
                                            data.meta.pagination.total
                                        )}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{data.meta.pagination.total}</span>{' '}
                                    results
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
