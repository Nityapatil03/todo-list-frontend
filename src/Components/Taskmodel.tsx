import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { X } from 'lucide-react';
import { createTask, updateTask, type Task } from '../store/slice/taskSlice';

interface TaskmodelProps {
    isOpen: boolean;
    onClose: (value: boolean) => void;
    task?: Task | null;
}

const Taskmodel = ({ isOpen, onClose, task }: TaskmodelProps) => {
    const dispatch = useAppDispatch();
    const { isDark } = useAppSelector((state) => state.theme);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'pending' | 'completed'>('pending');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setStatus(task.status || 'pending');
            const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
            setDueDate(formattedDate);
            setPriority(task.priority || 'medium');
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending');
            setDueDate('');
            setPriority('medium');
        }
    }, [task, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (dueDate) {
            const selectedDate = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (!task && selectedDate < today) {
                alert("Due date cannot be in the past");
                return;
            }
        }

        const taskData = { title: title.trim(), description: description.trim(), status, dueDate, priority };
        const taskId = task?._id || task?.id;

        try {
            setSubmitting(true);
            if (task && taskId) {
                await dispatch(updateTask({ id: taskId, task: taskData })).unwrap();
            } else {
                await dispatch(createTask(taskData)).unwrap();
            }
            onClose(false);
        } catch (error: any) {
            alert(error || "An error occurred while saving the task.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputClasses = `w-full p-2.5 rounded-lg border text-sm transition outline-none focus:ring-2 focus:ring-blue-500 ${isDark
            ? 'bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-700'
            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-white'
        }`;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-xs">
            <div
                className={`w-full max-w-lg p-6 rounded-2xl shadow-2xl border transition-all ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"
                    }`}
            >
                <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">
                        {task ? "Edit Task" : "Create New Task"}
                    </h2>
                    <button
                        onClick={() => onClose(false)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            placeholder="Add more details about this task..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={inputClasses}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dueDate" className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="priority" className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                                className={inputClasses}
                                required
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-xs font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
                            className={inputClasses}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="px-4 py-2 text-sm font-medium border rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-md disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : task ? "Update Task" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Taskmodel;