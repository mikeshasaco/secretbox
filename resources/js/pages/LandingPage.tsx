import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Target, Zap } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <span className="text-xl font-bold text-gray-900">Micro Tracker</span>
                </div>
                <nav className="flex items-center space-x-4">
                    <Link
                        to="/login"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                        Get Started
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="px-4 lg:px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Track What Matters
                            <span className="block text-blue-600">Measure Everything</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            The ultimate micro-tracking platform for modern businesses. 
                            Get insights into user behavior, ad performance, and conversion metrics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 flex items-center justify-center"
                            >
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">CPEV Tracking</h3>
                            <p className="text-gray-600">
                                Track Cost Per Engaged Visitor with precision. Understand which ads drive real engagement.
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Scroll Velocity</h3>
                            <p className="text-gray-600">
                                Measure how users interact with your content through advanced scroll tracking.
                            </p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Zap className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">PCQS Scoring</h3>
                            <p className="text-gray-600">
                                Advanced Page Content Quality Score to measure content engagement effectiveness.
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Join thousands of businesses already tracking with Micro Tracker.
                        </p>
                        <Link
                            to="/signup"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 inline-flex items-center"
                        >
                            Create Your Account
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; 2024 Micro Tracker. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
