import { useState, useEffect, useContext } from 'react';
import { tipsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Tips = () => {
  const { user } = useContext(AuthContext);
  const [tips, setTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: '', label: 'All Tips' },
    { value: 'best-practices', label: 'Best Practices' },
    { value: 'seasonal', label: 'Seasonal Tips' },
    { value: 'government-schemes', label: 'Government Schemes' },
    { value: 'general', label: 'General' }
  ];

  useEffect(() => {
    fetchTips();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = tips.filter(tip => tip.category === selectedCategory);
      setFilteredTips(filtered);
    } else {
      setFilteredTips(tips);
    }
  }, [selectedCategory, tips]);

  const fetchTips = async () => {
    try {
      const response = await tipsAPI.getTips();
      setTips(response.data);
      setFilteredTips(response.data);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await tipsAPI.addTip(formData);
      setMessage({ type: 'success', text: 'Tip added successfully!' });
      setFormData({
        title: '',
        description: '',
        category: 'general'
      });
      setShowForm(false);
      fetchTips();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add tip' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tip?')) {
      try {
        await tipsAPI.deleteTip(id);
        setMessage({ type: 'success', text: 'Tip deleted successfully!' });
        fetchTips();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete tip' });
      }
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'best-practices': return '⭐';
      case 'seasonal': return '🌱';
      case 'government-schemes': return '🏛️';
      default: return '💡';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'best-practices': return 'bg-blue-100 text-blue-800';
      case 'seasonal': return 'bg-green-100 text-green-800';
      case 'government-schemes': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farming Tips 💡</h1>
          <p className="text-gray-600 mt-2">Expert advice and best practices for better farming</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {user.role === 'admin' && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary"
              >
                {showForm ? 'Cancel' : 'Add New Tip'}
              </button>
            )}
          </div>

          {/* Add Tip Form */}
          {showForm && user.role === 'admin' && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-4">Add New Tip</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Best time for wheat sowing"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="general">General</option>
                    <option value="best-practices">Best Practices</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="government-schemes">Government Schemes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    rows="4"
                    placeholder="Detailed information about the tip..."
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary mt-4">
                Add Tip
              </button>
            </form>
          )}

          {/* Tips Grid */}
          {filteredTips.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">💡</span>
              <p className="text-gray-600 mt-4">
                {selectedCategory ? 'No tips found in this category' : 'No tips available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTips.map((tip) => (
                <div key={tip._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(tip.category)}`}>
                        {categories.find(c => c.value === tip.category)?.label}
                      </span>
                    </div>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(tip._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>

                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    Added on {new Date(tip.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tips;
