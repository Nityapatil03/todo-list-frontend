import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RootState } from '../store/store';
import { 
    fetchTasks, 
    updateTask, 
    deleteTask, 
    type Task 
} from '../store/slice/taskSlice';
import Taskmodel from '../Components/Taskmodel';
import { 
    Plus, 
    Search, 
    CheckCircle2, 
    Circle, 
    Calendar, 
    Trash2, 
    Edit3, 
    Clock, 
    ListTodo, 
    AlertCircle, 
    Check, 
    RotateCcw
} from 'lucide-react';

export const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
    const { tasks, loading, error } = useAppSelector((state: RootState) => state.tasks);
    const { isDark } = useAppSelector((state: RootState) => state.theme);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Filter, Search & Sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

    // Deleting state tracker for smooth UX
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            dispatch(fetchTasks());
        }
    }, [isAuthenticated, navigate, dispatch]);

    const handleOpenCreateModal = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (task: Task) => {
        const taskId = task._id || task.id;
        if (!taskId) return;
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            await dispatch(updateTask({ id: taskId, task: { status: newStatus } })).unwrap();
        } catch (err: any) {
            alert(err || 'Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId?: string) => {
        if (!taskId) return;
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                setDeletingId(taskId);
                await dispatch(deleteTask(taskId)).unwrap();
            } catch (err: any) {
                alert(err || 'Failed to delete task');
            } finally {
                setDeletingId(null);
            }
        }
    };

    // Derived statistics
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const pendingCount = totalCount - completedCount;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Filtered and Sorted Tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = 
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = 
                statusFilter === 'all' ? true : task.status === statusFilter;

            const matchesPriority = 
                priorityFilter === 'all' ? true : task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        }).sort((a, b) => {
            if (sortBy === 'dueDate') {
                const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                return dateA - dateB;
            }
            if (sortBy === 'priority') {
                const weight = { high: 3, medium: 2, low: 1 };
                return (weight[b.priority || 'medium'] || 2) - (weight[a.priority || 'medium'] || 2);
            }
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

    const getPriorityBadge = (priority?: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800';
            case 'medium':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            case 'low':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    const isOverdue = (dueDate?: string | Date, status?: string) => {
        if (!dueDate || status === 'completed') return false;
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
    };

    const formatDate = (dateStr?: string | Date) => {
        if (!dateStr) return 'No due date';
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={`min-h-[calc(100vh-64px)] ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-8 px-4 sm:px-6 lg:px-8 transition-colors`}>
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome back, {user?.name || 'User'}! 👋
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base mt-1 max-w-xl">
                            Here is a snapshot of your tasks. Stay productive and check off your goals today!
                        </p>
                    </div>
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus size={20} className="stroke-[2.5]" />
                        <span>Add New Task</span>
                    </button>
                </div>

                {/* Task Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Tasks</span>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <ListTodo size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mt-2">{totalCount}</div>
                        <div className="text-xs text-gray-400 mt-1">Across all categories</div>
                    </div>

                    <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pending</span>
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                                <Clock size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mt-2 text-amber-500">{pendingCount}</div>
                        <div className="text-xs text-gray-400 mt-1">Awaiting completion</div>
                    </div>

                    <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Completed</span>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mt-2 text-emerald-500">{completedCount}</div>
                        <div className="text-xs text-gray-400 mt-1">Great job so far!</div>
                    </div>

                    <div className={`p-5 rounded-2xl border shadow-xs ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Progress</span>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{completionRate}%</span>
                        </div>
                        <div className="text-3xl font-bold mt-2">{completionRate}%</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2.5 overflow-hidden">
                            <div 
                                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${completionRate}%` }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Tasks Control Bar (Search, Filter, Sorting) */}
                <div className={`p-5 rounded-2xl border shadow-xs space-y-4 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks by title or details..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border outline-none transition focus:ring-2 focus:ring-blue-500 ${
                                    isDark ? 'bg-gray-700/60 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                            />
                        </div>

                        {/* Filters and Sorters */}
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            {/* Status Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className={`px-3 py-2 text-sm rounded-xl border outline-none cursor-pointer ${
                                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>

                            {/* Priority Filter */}
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as any)}
                                className={`px-3 py-2 text-sm rounded-xl border outline-none cursor-pointer ${
                                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>

                            {/* Sort Filter */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className={`px-3 py-2 text-sm rounded-xl border outline-none cursor-pointer ${
                                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                            >
                                <option value="dueDate">Sort: Due Date</option>
                                <option value="priority">Sort: Priority</option>
                                <option value="title">Sort: Title</option>
                            </select>

                            {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setPriorityFilter('all');
                                    }}
                                    className="p-2 text-sm text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    title="Reset filters"
                                >
                                    <RotateCcw size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-between text-red-600 dark:text-red-300">
                        <div className="flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                        <button
                            onClick={() => dispatch(fetchTasks())}
                            className="text-xs font-semibold px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Task List */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <h2 className="text-lg font-bold">
                            My Tasks <span className="text-sm font-normal text-gray-400">({filteredTasks.length})</span>
                        </h2>
                    </div>

                    {loading && tasks.length === 0 ? (
                        <div className={`p-12 text-center rounded-2xl border ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3" />
                            <p className="text-sm text-gray-400">Loading your tasks...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className={`p-12 text-center rounded-2xl border ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                                <ListTodo size={32} />
                            </div>
                            <h3 className="text-base font-bold mb-1">
                                {tasks.length === 0 ? "You don't have any tasks yet" : "No matching tasks found"}
                            </h3>
                            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
                                {tasks.length === 0 
                                    ? "Stay ahead of your day! Start by creating your very first task."
                                    : "Try adjusting your filters or search terms to find what you are looking for."}
                            </p>
                            {tasks.length === 0 ? (
                                <button
                                    onClick={handleOpenCreateModal}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition"
                                >
                                    <Plus size={18} />
                                    <span>Create Your First Task</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setPriorityFilter('all');
                                    }}
                                    className="px-4 py-2 text-sm text-blue-600 hover:underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredTasks.map((task) => {
                                const taskId = task._id || task.id;
                                const completed = task.status === 'completed';
                                const overdue = isOverdue(task.dueDate, task.status);

                                return (
                                    <div
                                        key={taskId}
                                        className={`group p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                            completed 
                                                ? isDark ? 'bg-gray-800/40 border-gray-800 opacity-75' : 'bg-gray-50/80 border-gray-200 opacity-80'
                                                : isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        {/* Left Side: Checkbox + Title/Description */}
                                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                            <button
                                                onClick={() => handleToggleStatus(task)}
                                                className={`mt-0.5 shrink-0 transition-transform active:scale-90 ${
                                                    completed ? 'text-emerald-500' : 'text-gray-400 hover:text-blue-500'
                                                }`}
                                                title={completed ? "Mark as pending" : "Mark as completed"}
                                            >
                                                {completed ? (
                                                    <CheckCircle2 size={22} className="fill-emerald-50 dark:fill-emerald-950/40" />
                                                ) : (
                                                    <Circle size={22} />
                                                )}
                                            </button>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className={`font-semibold text-base truncate transition ${
                                                        completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
                                                    }`}>
                                                        {task.title}
                                                    </h3>

                                                    {/* Priority Badge */}
                                                    <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                                                        {task.priority || 'medium'}
                                                    </span>

                                                    {/* Overdue Badge */}
                                                    {overdue && (
                                                        <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800">
                                                            Overdue
                                                        </span>
                                                    )}
                                                </div>

                                                {task.description && (
                                                    <p className={`text-sm mt-1 line-clamp-2 ${
                                                        completed ? 'text-gray-400 dark:text-gray-500' : isDark ? 'text-gray-300' : 'text-gray-600'
                                                    }`}>
                                                        {task.description}
                                                    </p>
                                                )}

                                                {/* Meta Info */}
                                                <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-400">
                                                    <div className={`flex items-center gap-1.5 ${overdue ? 'text-red-500 font-medium' : ''}`}>
                                                        <Calendar size={14} />
                                                        <span>Due: {formatDate(task.dueDate)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Actions */}
                                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                            <button
                                                onClick={() => handleToggleStatus(task)}
                                                className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1 transition ${
                                                    completed 
                                                        ? 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500' 
                                                        : 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                                                }`}
                                                title={completed ? "Mark Pending" : "Mark Done"}
                                            >
                                                {completed ? <RotateCcw size={14} /> : <Check size={14} />}
                                                <span className="hidden md:inline">{completed ? "Undo" : "Done"}</span>
                                            </button>

                                            <button
                                                onClick={() => handleOpenEditModal(task)}
                                                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition"
                                                title="Edit Task"
                                            >
                                                <Edit3 size={15} />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteTask(taskId)}
                                                disabled={deletingId === taskId}
                                                className="p-2 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition disabled:opacity-50"
                                                title="Delete Task"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>

            {/* Create/Edit Task Modal */}
            <Taskmodel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
            />
        </div>
    );
};

export default Dashboard;
