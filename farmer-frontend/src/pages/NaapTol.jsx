import { useState, useEffect } from 'react';
import { cropAPI } from '../services/api';

const NaapTol = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: ''
  });
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await cropAPI.getMyCrops();
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
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
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await cropAPI.addCrop({
        ...formData,
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit)
      });

      setMessage({ type: 'success', text: 'Crop added successfully!' });
      setFormData({
        cropName: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: ''
      });
      fetchCrops();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add crop' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await cropAPI.deleteCrop(id);
        setMessage({ type: 'success', text: 'Crop deleted successfully!' });
        fetchCrops();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete crop' });
      }
    }
  };

  const totalValue = crops.reduce((sum, crop) => sum + crop.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NaapTol - Crop Measurement 📏</h1>
          <p className="text-gray-600 mt-2">Track your crops, quantities, and pricing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Crop Form */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Crop</h2>

              {message.text && (
                <div className={`mb-4 p-3 rounded ${
                  message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    name="cropName"
                    value={formData.cropName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Wheat, Rice, Cotton"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="ton">Ton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit (₹)
                  </label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    value={formData.pricePerUnit}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {formData.quantity && formData.pricePerUnit && (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-primary-600">
                      ₹{(parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit)).toLocaleString()}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Adding...' : 'Add Crop'}
                </button>
              </form>
            </div>
          </div>

          {/* Crops List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Crops</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalValue.toLocaleString()}</p>
                </div>
              </div>

              {crops.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl">🌾</span>
                  <p className="text-gray-600 mt-4">No crops added yet</p>
                  <p className="text-sm text-gray-500 mt-2">Add your first crop using the form</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {crops.map((crop) => (
                        <tr key={crop._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{crop.cropName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{crop.quantity} {crop.unit}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{crop.pricePerUnit}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                            ₹{crop.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(crop.date).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDelete(crop._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NaapTol;
