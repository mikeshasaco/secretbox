<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <!-- Navigation -->
        <nav class="bg-white/80 backdrop-blur-sm shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <h1 class="text-2xl font-bold text-gray-900">Micro Tracker</h1>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <router-link
                            to="/login"
                            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Sign In
                        </router-link>
                        <router-link
                            to="/signup"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Get Started
                        </router-link>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <div class="relative">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div class="text-center">
                    <h1 class="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl">
                        Track Everything
                        <span class="text-blue-600">Simply</span>
                    </h1>
                    <p class="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
                        Micro Tracker is the simplest way to add powerful analytics to your web applications. 
                        Track visitors, events, and user behavior with just a few lines of code.
                    </p>
                    <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <router-link
                            to="/signup"
                            class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                            Start Tracking Free
                        </router-link>
                        <router-link
                            to="/login"
                            class="inline-flex items-center px-8 py-4 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            Sign In
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="bg-white py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Everything you need to understand your users
                    </h2>
                    <p class="mt-4 text-lg text-gray-600">
                        Powerful analytics made simple
                    </p>
                </div>

                <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                        <h3 class="mt-4 text-lg font-semibold text-gray-900">Real-time Analytics</h3>
                        <p class="mt-2 text-gray-600">
                            See visitor behavior and events as they happen with real-time tracking and reporting.
                        </p>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h3 class="mt-4 text-lg font-semibold text-gray-900">Lightning Fast</h3>
                        <p class="mt-2 text-gray-600">
                            Minimal impact on your site's performance with our lightweight tracking script.
                        </p>
                    </div>

                    <div class="bg-gray-50 p-6 rounded-lg">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h3 class="mt-4 text-lg font-semibold text-gray-900">Privacy First</h3>
                        <p class="mt-2 text-gray-600">
                            Your data stays yours. We don't sell or share your analytics data with third parties.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="bg-blue-600">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div class="text-center">
                    <h2 class="text-3xl font-bold text-white sm:text-4xl">
                        Ready to start tracking?
                    </h2>
                    <p class="mt-4 text-xl text-blue-100">
                        Join thousands of developers who trust Micro Tracker for their analytics needs.
                    </p>
                    <div class="mt-8">
                        <router-link
                            to="/signup"
                            class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            Get Started Free
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-gray-900">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="text-center">
                    <h3 class="text-2xl font-bold text-white">Micro Tracker</h3>
                    <p class="mt-4 text-gray-400">
                        Simple, powerful analytics for modern web applications.
                    </p>
                    <p class="mt-8 text-gray-500 text-sm">
                        © 2024 Micro Tracker. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
// Landing page component
</script>
