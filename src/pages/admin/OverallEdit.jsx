import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function OverallEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [overall, setOverall] = useState('');
  const [content, setContent] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchOverall();
  }, [id, navigate]);

  const fetchOverall = async () => {
    try {
      const response = await fetch(`${API_URL}/api/overalls/${id}`);
      const data = await response.json();

      setTitle(data.title);
      setOverall(data.overall || '');
      setContent(data.content);
      setInstagramLink(data.instagram_link || '');
      setExistingImage(data.image_url);
      setImagePreview(data.image_url);
    } catch (error) {
      setError('Failed to fetch overall');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (overall) {
        formData.append('overall', overall);
      }
      if (instagramLink) {
        formData.append('instagram_link', instagramLink);
      }
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${API_URL}/api/overalls/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update overall');
      }

      navigate('/admin/overalls');
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Overall</h1>
            <Link
              to="/admin/overalls"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Kendrick Lamar"
            />
          </div>

          <div>
            <label htmlFor="overall" className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <input
              type="number"
              id="overall"
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
              min="0"
              max="99"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 99"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter the 2K overall rating (0-99)
            </p>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Overall Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-2 text-sm text-gray-500">
              Leave empty to keep current image
            </p>
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {image ? 'New Image Preview:' : 'Current Image:'}
                </p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-sm rounded-lg shadow"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Link
            </label>
            <input
              type="url"
              id="instagramLink"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://www.instagram.com/p/..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Link to the Instagram post for this overall
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content/Explanation *
            </label>
            <textarea
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Explain the rating and why this artist deserves this overall..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Supports Markdown formatting
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to="/admin/overalls"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Overall'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OverallEdit;
