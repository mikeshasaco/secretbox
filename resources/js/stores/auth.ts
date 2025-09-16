import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const loading = ref(false);

    const isAuthenticated = computed(() => !!user.value);

    const initialize = async () => {
        if (loading.value) {
            return; // Already initializing
        }
        
        loading.value = true;
        try {
            const response = await fetch('/api/user', {
                credentials: 'same-origin'
            });
            if (response.ok) {
                const userData = await response.json();
                user.value = userData;
            }
        } catch (error) {
            // User not authenticated
        } finally {
            loading.value = false;
        }
    };

    const login = async (email: string, password: string) => {
        loading.value = true;
        try {
            // Get CSRF token first
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'same-origin'
            });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrf_token;

            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            formData.append('_token', csrfToken);

            const response = await fetch('/login', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (response.ok) {
                // Get user data after successful login
                const userResponse = await fetch('/api/user', {
                    credentials: 'same-origin'
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    user.value = userData;
                }
                return { success: true };
            } else {
                // Handle validation errors
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    return { 
                        success: false, 
                        error: errorData.message || 'Login failed' 
                    };
                } else {
                    // Handle HTML response (validation errors)
                    const text = await response.text();
                    return { 
                        success: false, 
                        error: 'Invalid credentials' 
                    };
                }
            }
        } catch (error: any) {
            return { 
                success: false, 
                error: 'Login failed' 
            };
        } finally {
            loading.value = false;
        }
    };

    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        loading.value = true;
        try {
            // Get CSRF token first
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'same-origin'
            });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrf_token;

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('password_confirmation', password_confirmation);
            formData.append('_token', csrfToken);

            const response = await fetch('/register', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            if (response.ok) {
                // Get user data after successful registration
                const userResponse = await fetch('/api/user', {
                    credentials: 'same-origin'
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    user.value = userData;
                }
                return { success: true };
            } else {
                // Handle validation errors
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    return { 
                        success: false, 
                        error: errorData.message || 'Registration failed' 
                    };
                } else {
                    // Handle HTML response (validation errors)
                    const text = await response.text();
                    return { 
                        success: false, 
                        error: 'Registration failed. Please check your information.' 
                    };
                }
            }
        } catch (error: any) {
            return { 
                success: false, 
                error: 'Registration failed' 
            };
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        try {
            // Get CSRF token first
            const csrfResponse = await fetch('/api/csrf-token', {
                credentials: 'same-origin'
            });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.csrf_token;

            const formData = new FormData();
            formData.append('_token', csrfToken);

            await fetch('/logout', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                }
            });
        } finally {
            user.value = null;
        }
    };

    const getCsrfToken = () => {
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        return metaTag ? metaTag.getAttribute('content') : '';
    };

    return {
        user,
        loading,
        isAuthenticated,
        initialize,
        login,
        register,
        logout
    };
});
