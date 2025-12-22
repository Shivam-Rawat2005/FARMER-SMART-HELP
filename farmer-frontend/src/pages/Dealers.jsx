import { useState, useEffect, useContext } from 'react';
import { dealerAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dealers = () => {
  const { user } = useContext(AuthContext);
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [searchCrop, setSearchCrop] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cropType: '',
    phone: '',
    location: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDealers();
  }, []);

  useEffect(() => {
    if (searchCrop) {
      const filtered = dealers.filter(dealer =>
        dealer.cropType.toLowerCase().includes(searchCrop.toLowerCase())
      );
      setFilteredDealers(filtered);
    } else {
      setFilteredDealers(dealers);
    }
  }, [searchCrop, dealers]);

  const fetchDealers = async () => {
    try {
      const response = await dealerAPI.getDealers();
      setDealers(response.data);
      setFilteredDealers(response.data);
    } catch (error) {
      console.error('Error fetching dealers:', error);
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
      await dealerAPI.addDealer(formData);
      setMessage({ type: 'success', text: 'Dealer added successfully!' });
      setFormData({
        name: '',
        cropType: '',
        phone: '',
        location: ''
      });
      setShowForm(false);
      fetchDealers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add dealer' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      try {
        await dealerAPI.deleteDealer(id);
        setMessage({ type: 'success', text: 'Dealer deleted successfully!' });
        fetchDealers();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete dealer' });
      }
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
          <h1 className="text-3xl font-bold text-gray-900">Dealers Directory 📞</h1>
          <p className="text-gray-600 mt-2">Find dealers for your crops</p>
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
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search by crop type..."
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                className="input-field"
              />
            </div>
            
            {user.role === 'admin' && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary"
              >
                {showForm ? 'Cancel' : 'Add New Dealer'}
              </button>
            )}
          </div>

          {/* Add Dealer Form */}
          {showForm && user.role === 'admin' && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-4">Add New Dealer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dealer Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type
                  </label>
                  <input
                    type="text"
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Wheat, Rice"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+91 1234567890"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary mt-4">
                Add Dealer
              </button>
            </form>
          )}

          {/* Dealers Grid */}
          {filteredDealers.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">📞</span>
              <p className="text-gray-600 mt-4">
                {searchCrop ? 'No dealers found for this crop' : 'No dealers available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDealers.map((dealer) => (
                <div key={dealer._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{dealer.name}</h3>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(dealer._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">🌾</span>
                      <span className="font-semibold text-primary-600">{dealer.cropType}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📞</span>
                      <a href={`tel:${dealer.phone}`} className="hover:text-primary-600">
                        {dealer.phone}
                      </a>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <span className="mr-2">📍</span>
                      <span>{dealer.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={`tel:${dealer.phone}`}
                      className="block text-center btn-primary"
                    >
                      Call Dealer
                    </a>
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

export default Dealers;
