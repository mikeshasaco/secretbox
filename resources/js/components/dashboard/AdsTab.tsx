import { Target, TrendingUp, Eye } from 'lucide-react';

export default function AdsTab() {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Ads</h2>
                        <p className="text-sm text-gray-500">
                            Track ad performance and creative engagement
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">0</span>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-12">
                    <Target className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No ads yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Ad data will appear here once you upload spend data and users interact with your ads.
                    </p>
                </div>
            </div>
        </div>
    );
}
