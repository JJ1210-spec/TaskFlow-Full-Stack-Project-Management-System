import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTasksByProject, createTask, updateTask, deleteTask } from '../api/tasks';

const ProjectDetail = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { id } = useParams();        // project id from URL
    const navigate = useNavigate();

    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'to_do',
    priority: 'medium',
    deadline: ''
        });
    const [createError, setCreateError] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getTasksByProject(id);
                setTasks(data.tasks || []);
            } catch (err) {
                setError('Failed to load tasks');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [id]);

    // Group tasks by status
    const todoTasks = tasks.filter(task => task.status === 'to_do');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const doneTasks = tasks.filter(task => task.status === 'done');
    
        const handleCreateTask = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreating(true);
        
        try {
            // Add projectId to the task data
            const taskData = {
                ...newTask,
                projectId: id  // The project ID from useParams
            };
            
            const createdTask = await createTask(taskData);
            
            // Add new task to the list
            setTasks([createdTask.task, ...tasks]);
            
            // Reset form and close modal
            setNewTask({
                title: '',
                description: '',
                status: 'to_do',
                priority: 'medium',
                deadline: ''
            });
            setShowTaskModal(false);
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Failed to create task');
        } finally {
            setCreating(false);
        }
        };
    // Delete Task
        const handleDeleteTask = async (taskId) => {
            if (!window.confirm('Are you sure you want to delete this task?')) {
                return;
            }
            
            try {
                await deleteTask(taskId);
                // Remove task from state
                setTasks(tasks.filter(task => task._id !== taskId));
            } catch (err) {
                alert('Failed to delete task');
            }
        };

        // Change Task Status
        const handleStatusChange = async (taskId, newStatus) => {
            try {
                const updated = await updateTask(taskId, { status: newStatus });
                // Update task in state
                setTasks(tasks.map(task => 
                    task._id === taskId ? { ...task, status: newStatus } : task
                ));
            } catch (err) {
                alert('Failed to update task status');
            }
        };



// Change Task Priority
const handlePriorityChange = async (taskId, newPriority) => {
    try {
        await updateTask(taskId, { priority: newPriority });
        // Update task in state
        setTasks(tasks.map(task => 
            task._id === taskId ? { ...task, priority: newPriority } : task
        ));
    } catch (err) {
        alert('Failed to update task priority');
    }
};
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-bold">Project Tasks</h1>
                    <button 
                    onClick={() => setShowTaskModal(true)}  // ← Add this
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                    + New Task
                    </button>
                </div>
            </div>

          

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {loading && <p className="text-gray-600">Loading tasks...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                                {/* TO DO */}
            <div className="space-y-3">
                    {todoTasks.map(task => (
                        <TaskCard 
                            key={task._id} 
                            task={task} 
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                            onPriorityChange={handlePriorityChange}
                        />
                    ))}
            </div>

            {/* IN PROGRESS */}
            <div className="space-y-3">
            {inProgressTasks.map(task => (
                <TaskCard 
                    key={task._id} 
                    task={task} 
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                />
            ))}
            </div>

            {/* DONE */}
            <div className="space-y-3">
            {doneTasks.map(task => (
                <TaskCard 
                    key={task._id} 
                    task={task} 
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                    onPriorityChange={handlePriorityChange}
                />
            ))}
            </div>

                    </div>
                )}
            </div>
                    {/* Create Task Modal */}
                {showTaskModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 w-96 max-w-full max-h-screen overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
                            
                            {createError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {createError}
                                </div>
                            )}
            
            <form onSubmit={handleCreateTask}>
                {/* Title */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Task Title *
                    </label>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="E.g., Design homepage"
                        required
                    />
                </div>
                
                {/* Description */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Description
                    </label>
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Task details..."
                        rows="3"
                    />
                </div>
                
                {/* Status */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Status
                    </label>
                    <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="to_do">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                
                {/* Priority */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Priority
                    </label>
                    <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                
                {/* Deadline */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Deadline (Optional)
                    </label>
                    <input
                        type="date"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                
                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowTaskModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={creating}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {creating ? 'Creating...' : 'Create Task'}
                    </button>
                        </div>
                    </form>
                </div>
            </div>
            )}


        </div>
    );
};

const TaskCard = ({ task, onDelete, onStatusChange, onPriorityChange }) => {
    const priorityColors = {
        high: 'bg-red-100 text-red-700 border-red-300',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        low: 'bg-green-100 text-green-700 border-green-300'
    };
    
    const statusOptions = [
        { value: 'to_do', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'done', label: 'Done' }
    ];
    
    const priorityOptions = [
        { value: 'low', label: 'Low', emoji: '🟢' },
        { value: 'medium', label: 'Medium', emoji: '🟡' },
        { value: 'high', label: 'High', emoji: '🔴' }
    ];
    
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition border-l-4 border-gray-300">
            {/* Header: Title & Delete */}
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800 flex-1">{task.title}</h4>
                <button
                    onClick={() => onDelete(task._id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Delete task"
                >
                    🗑️
                </button>
            </div>
            
            {/* Description */}
            {task.description && (
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            )}
            
            {/* Priority Selector */}
            <div className="mb-3">
                <select
                    value={task.priority}
                    onChange={(e) => onPriorityChange(task._id, e.target.value)}
                    className={`text-xs px-3 py-1 rounded-full border font-semibold cursor-pointer ${priorityColors[task.priority]}`}
                >
                    {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.emoji} {option.label}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Due Date */}
            {task.deadline && (
                <p className="text-xs text-gray-500 mb-3">
                    📅 Due: {new Date(task.deadline).toLocaleDateString()}
                </p>
            )}
            
            {/* Status Changer */}
            <div className="pt-3 border-t border-gray-200">
                <label className="text-xs text-gray-500 block mb-1">Move to:</label>
                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                    className="w-full text-xs px-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
export default ProjectDetail;