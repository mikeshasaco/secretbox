import { DollarSign, Upload, FileText } from 'lucide-react';

export default function SpendTab() {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Spend Data</h2>
                        <p className="text-sm text-gray-500">
                            Upload and manage ad spend data
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">$0</span>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center py-12">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No spend data yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Upload CSV files with your ad spend data to get started.
                    </p>
                    <div className="mt-6">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
