import { BarChart3, TrendingUp, Target, DollarSign } from 'lucide-react';

export default function AnalyticsTab() {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Analytics</h2>
                        <p className="text-sm text-gray-500">
                            Advanced analytics and insights
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Total Spend
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">$0.00</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Engaged Sessions
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">0</dd>
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Target className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    Avg CPEV
                                </dt>
                                <dd className="text-lg font-medium text-gray-900">$0.00</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-12">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Analytics will appear here once you have visitor and spend data.
                    </p>
                </div>
            </div>
        </div>
    );
}
