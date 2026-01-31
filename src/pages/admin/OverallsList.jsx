import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OverallsList() {
  const [overalls, setOveralls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchOveralls();
  }, [navigate]);

  const fetchOveralls = async () => {
    try {
      const response = await fetch(`${API_URL}/api/overalls`);
      const data = await response.json();
      setOveralls(data);
    } catch (error) {
      setError('Failed to fetch overalls');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this overall?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${API_URL}/api/overalls/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setOveralls(overalls.filter(overall => overall.id !== id));
      } else {
        alert('Failed to delete overall');
      }
    } catch (error) {
      console.error('Error deleting overall:', error);
      alert('Failed to delete overall');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">2K Overalls Admin</h1>
            <div className="flex space-x-4">
              <Link
                to="/admin/articles"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                News Articles
              </Link>
              <Link
                to="/admin/overalls/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create New Overall
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {overalls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No overalls yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {overalls.map((overall) => (
              <div key={overall.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={overall.image_url}
                  alt={overall.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {overall.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {overall.content.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/admin/overalls/edit/${overall.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(overall.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OverallsList;
