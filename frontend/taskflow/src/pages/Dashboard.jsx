import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllProjects, createProject,deleteProject} from '../api/projects';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data.projects || []);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      const createdProject = await createProject(newProject);
      setProjects([createdProject, ...projects]);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };



  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();  // Prevent navigating to project when clicking delete
    
    if (!window.confirm('Are you sure? This will delete all tasks in this project!')) {
        return;
    }
    
    try {
        await deleteProject(projectId);
        // Remove project from state
        setProjects(projects.filter(project => project._id !== projectId));
    } catch (err) {
        alert('Failed to delete project');
    }
};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      

      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TaskFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            + New Project
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Loading projects...</p>}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="text-center text-gray-600">
            No projects yet. Click “New Project” to get started!
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {projects.map((project) => (
      <div
        key={project._id}
        onClick={() => navigate(`/projects/${project._id}`)}
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl cursor-pointer relative"
      >
        {/* Delete Button */}
        <button
          onClick={(e) => handleDeleteProject(project._id, e)}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl"
          title="Delete project"
        >
          🗑️
        </button>
        
        <h3 className="text-xl font-bold pr-8">{project.name}</h3>
        <p className="text-gray-600">{project.description || 'No description'}</p>
      </div>
    ))}
  </div>
)}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create Project</h2>

            {createError && (
              <p className="text-red-600 mb-3">{createError}</p>
            )}

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                placeholder="Project name"
                className="w-full border p-2 mb-3"
                required
              />

              <textarea
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border p-2 mb-4"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
