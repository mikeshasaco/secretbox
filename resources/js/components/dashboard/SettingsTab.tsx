import { useState } from 'react';
import { Settings, Key, Copy, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../../lib/api/projects';

export default function SettingsTab() {
    const [showSecret, setShowSecret] = useState(false);
    const { activeProject } = useProject();
    const queryClient = useQueryClient();

    const rotateKeysMutation = useMutation({
        mutationFn: () => projectApi.rotateKeys(activeProject!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            console.log('Keys rotated successfully');
        },
        onError: (error) => {
            console.error('Failed to rotate keys:', error);
        },
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const rotateKeys = async () => {
        if (activeProject) {
            rotateKeysMutation.mutate();
        }
    };

    if (!activeProject) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No project selected</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium text-gray-900">Project Settings</h2>
                        <p className="text-sm text-gray-500">
                            Manage your project configuration and API keys for {activeProject.name}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* API Keys Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Public Key
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                value={activeProject.public_key}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                            />
                            <button
                                onClick={() => copyToClipboard(activeProject.public_key)}
                                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secret Key
                        </label>
                        <div className="flex">
                            <input
                                type={showSecret ? 'text' : 'password'}
                                value={showSecret ? activeProject.secret_key : activeProject.secret_key.substring(0, 8) + '•'.repeat(24) + activeProject.secret_key.slice(-4)}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm font-mono"
                            />
                            <button
                                onClick={() => setShowSecret(!showSecret)}
                                className="px-3 py-2 border border-l-0 border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={() => copyToClipboard(activeProject.secret_key)}
                                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Keep your secret key secure and never share it publicly
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={rotateKeys}
                            disabled={rotateKeysMutation.isPending}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            {rotateKeysMutation.isPending ? 'Rotating...' : 'Rotate API Keys'}
                        </button>
                        <p className="mt-2 text-sm text-gray-500">
                            Rotating keys will invalidate all existing API keys. Make sure to update your integrations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Integration Code */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Code</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        JavaScript Tracking Code
                    </label>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        <pre>{`<script data-api="${window.location.origin}/api" data-project-id="${activeProject.id}" data-public-key="${activeProject.public_key}">
  (function() {
    const script = document.currentScript;
    const apiUrl = script.dataset.api + '/v1/ingest/event';
    const projectId = script.dataset.projectId;
    const publicKey = script.dataset.publicKey;
    
    // Generate session key
    const sessionKey = 'sess_' + Math.random().toString(36).substr(2, 9);
    
    // Track page view
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': publicKey,
        'X-Project-Id': projectId,
        'X-Visitor-Key': localStorage.getItem('visitor_key') || 'vis_' + Math.random().toString(36).substr(2, 9)
      },
      body: JSON.stringify({
        session_key: sessionKey,
        event_type: 'page_view',
        name: 'Page View',
        url: window.location.href,
        path: window.location.pathname,
        scroll_pct: 0
      })
    });
  })();
</script>`}</pre>
                    </div>
                    <button
                        onClick={() => copyToClipboard(`<script data-api="${window.location.origin}/api" data-project-id="${activeProject.id}" data-public-key="${activeProject.public_key}">
  (function() {
    const script = document.currentScript;
    const apiUrl = script.dataset.api + '/v1/ingest/event';
    const projectId = script.dataset.projectId;
    const publicKey = script.dataset.publicKey;
    
    // Generate session key
    const sessionKey = 'sess_' + Math.random().toString(36).substr(2, 9);
    
    // Track page view
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': publicKey,
        'X-Project-Id': projectId,
        'X-Visitor-Key': localStorage.getItem('visitor_key') || 'vis_' + Math.random().toString(36).substr(2, 9)
      },
      body: JSON.stringify({
        session_key: sessionKey,
        event_type: 'page_view',
        name: 'Page View',
        url: window.location.href,
        path: window.location.pathname,
        scroll_pct: 0
      })
    });
  })();
</script>`)}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                    </button>
                </div>
            </div>
        </div>
    );
}
