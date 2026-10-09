import{createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export interface Task {
    id?: string;
    _id?: string;
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
    status?: 'pending' | 'completed';
    dueDate?: string | Date;
}

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/api/tasks`, {
                withCredentials: true,
            });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: Omit<Task, 'id' | '_id'>, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/api/tasks`, taskData, {
                withCredentials: true,
            });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, task }: { id: string; task: Partial<Task> }, { rejectWithValue }) => {
        try {
            const updatedTask = { ...task, status: task.status as 'pending' | 'completed' };
            const { data } = await axios.put(`${API_URL}/api/tasks/${id}`, updatedTask, {
                withCredentials: true,
            });
            return data.task || data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/api/tasks/${id}`, {
                withCredentials: true,
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
        }
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchTasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || action.error.message || 'Failed to fetch tasks';
            })
            // createTask
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.unshift(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || action.error.message || 'Failed to create task';
            })
            // updateTask
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;
                const index = state.tasks.findIndex(
                    (task) => (task.id || task._id) === (updatedTask.id || updatedTask._id)
                );
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || action.error.message || 'Failed to update task';
            })
            // deleteTask
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(
                    (task) => (task.id || task._id) !== action.payload
                );
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || action.error.message || 'Failed to delete task';
            });
    },
});

export default taskSlice.reducer;