import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RootState } from '../store/store';
import { Pencil, Trash2, CheckCircle, Clock } from 'lucide-react';
import { updateTask, deleteTask } from '../store/slice/taskSlice';

interface TaskCardProps {
    task: {
        _id?: string;
        title: string;
        description?: string;
        dueDate?: string | Date;
        priority?: 'low' | 'medium' | 'high';
        status?: 'pending' | 'completed';
    };
    onEdit?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
    const dispatch = useAppDispatch();
    const { isDark } = useAppSelector((state: RootState) => state.theme);

    const handleToggleStatus = () => {
        const taskId = task._id;
        if (!taskId) return;

        dispatch(updateTask({
            id: taskId,
            task: {
                status: task.status === 'pending' ? 'completed' : 'pending',
            },
        }));
    };

    const handleDelete = () => {
        if (!task._id) return;
        dispatch(deleteTask(task._id));
    };

    const isCompleted = task.status === 'completed';

    const getPriorityColor = (priority?: string) => {
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

    return (
        <div
            className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isCompleted
                    ? isDark ? 'bg-gray-800/40 border-gray-800 opacity-75' : 'bg-gray-50/80 border-gray-200 opacity-80'
                    : isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
        >
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                    onClick={handleToggleStatus}
                    className={`mt-0.5 transition-colors ${
                        isCompleted ? 'text-emerald-500' : 'text-gray-400 hover:text-blue-500'
                    }`}
                    title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                >
                    <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-emerald-100 dark:fill-emerald-900/30' : ''}`} />
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-semibold text-base truncate ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                            {task.title}
                        </h4>
                        {task.priority && (
                            <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                        )}
                    </div>

                    {task.description && (
                        <p className={`text-sm mt-1 line-clamp-2 ${isCompleted ? 'text-gray-400 dark:text-gray-500' : isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.description}
                        </p>
                    )}

                    {task.dueDate && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit task"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete task"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;