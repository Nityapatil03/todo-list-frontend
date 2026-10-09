import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
}
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const getStoredUser = (): User | null => {
    try {
        const item = localStorage.getItem('user');
        return item && item !== 'undefined' ? JSON.parse(item) : null;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    user: getStoredUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!getStoredUser() || !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (import.meta.env.PROD ?  'https://todo-list-backend-4ajm.onrender.com' : 'http://localhost:5000');


export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/users/login`,
                { email, password },
                { withCredentials: true }
            );
            const user = response.data.user || response.data;
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/users/register`,
                { name, email, password },
                { withCredentials: true }
            );
            const user = response.data.user || response.data;
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('Registration failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/users/logout`, {}, {
                withCredentials: true,
            });
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        return;
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async ({ name, currentPassword, newPassword }: { name: string; currentPassword?: string; newPassword?: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/users/profile`,
                { name, currentpassword: currentPassword, newpassword: newPassword, currentPassword, newPassword },
                { withCredentials: true }
            );
            const user = response.data.user || response.data;
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                return rejectWithValue(error.response.data.message);
            }
            return rejectWithValue('Update profile failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user || action.payload;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = (action.payload as string) || action.error.message || 'An error occurred';
                state.loading = false;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.user || action.payload;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = (action.payload as string) || action.error.message || 'An error occurred';
                state.loading = false;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = (action.payload as string) || action.error.message || 'An error occurred';
                state.loading = false;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload.user || action.payload;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = (action.payload as string) || action.error.message || 'An error occurred';
                state.loading = false;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
    }
});
export const { clearError } = authSlice.actions;
export default authSlice.reducer;

