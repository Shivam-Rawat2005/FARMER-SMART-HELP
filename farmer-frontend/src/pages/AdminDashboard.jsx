import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { cropAPI, analyticsAPI, ordersAPI } from '../services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCrops: 0,
    totalIncome: 0,
    totalFarmers: 0,
    recentCrops: []
  });
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [buyForm, setBuyForm] = useState({
    quantity: 1,
    buyerName: '',
    buyerEmail: '',
    buyerPhone: ''
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cropsRes, analyticsRes] = await Promise.all([
        cropAPI.getAllCrops(),
        analyticsAPI.getIncome('monthly')
      ]);

      // Get unique farmers
      const uniqueFarmers = new Set(cropsRes.data.map(crop => crop.farmerId._id));

      setStats({
        totalCrops: cropsRes.data.length,
        totalIncome: analyticsRes.data.totalIncome,
        totalFarmers: uniqueFarmers.size,
        recentCrops: cropsRes.data.slice(0, 10)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBuyModal = (crop) => {
    if (!crop) return;
    setSelectedCrop(crop);
    setFeedback('');
    setBuyForm({
      quantity: 1,
      buyerName: '',
      buyerEmail: '',
      buyerPhone: ''
    });
    setShowBuyModal(true);
  };

  const handleBuy = async () => {
    if (!selectedCrop) return;

    const required = [buyForm.buyerName, buyForm.buyerEmail, buyForm.buyerPhone];
    if (required.some((v) => !v || !v.toString().trim())) {
      setFeedback('Please fill buyer name, email, and phone.');
      return;
    }

    const qty = Number(buyForm.quantity);
    if (qty <= 0) {
      setFeedback('Quantity must be greater than zero.');
      return;
    }

    const available = selectedCrop.quantityAvailable ?? selectedCrop.quantity ?? 0;
    if (qty > available) {
      setFeedback(`Requested quantity exceeds available stock. Available: ${available} ${selectedCrop.unit}`);
      return;
    }

    setSaving(true);
    setFeedback('');
    try {
      await ordersAPI.createOrder({
        cropId: selectedCrop._id,
        quantity: qty,
        buyerName: buyForm.buyerName,
        buyerEmail: buyForm.buyerEmail,
        buyerPhone: buyForm.buyerPhone
      });
      setFeedback('Order placed and income recorded for the farmer.');
      setShowBuyModal(false);
      await fetchDashboardData();
    } catch (error) {
      console.error('Order error:', error);
      setFeedback(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard 👨‍💼
          </h1>
          <p className="text-gray-600 mt-2">Platform overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Farmers</h3>
            <p className="text-4xl font-bold mt-2">{stats.totalFarmers}</p>
          </div>

          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Crops</h3>
            <p className="text-4xl font-bold mt-2">{stats.totalCrops}</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Income</h3>
            <p className="text-4xl font-bold mt-2">₹{stats.totalIncome.toLocaleString()}</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <Link to="/dealers" className="block text-sm hover:underline">Add Dealer</Link>
              <Link to="/tips" className="block text-sm hover:underline">Add Tip</Link>
              <Link to="/analytics" className="block text-sm hover:underline">View Analytics</Link>
            </div>
          </div>
        </div>

        {/* Recent Crops from All Farmers */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Crops (All Farmers)</h2>
            <Link to="/analytics" className="btn-primary">
              View Full Analytics
            </Link>
          </div>

          {stats.recentCrops.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">📊</span>
              <p className="text-gray-600 mt-4">No crop data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentCrops.map((crop) => {
                    const available = crop.quantityAvailable ?? crop.quantity ?? 0;
                    return (
                    <tr key={crop._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">{crop.farmerId.name}</div>
                          <div className="text-sm text-gray-500">{crop.farmerId.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{crop.cropName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{crop.quantity} {crop.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          return (
                            <span className={available <= 0 ? 'text-red-600 font-semibold' : ''}>
                              {available} {crop.unit} {available <= 0 ? '(Out of stock)' : ''}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{crop.pricePerUnit}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                        ₹{crop.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          data-testid={`buy-${crop._id}`}
                          className="px-3 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 text-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (available <= 0) return;
                            openBuyModal(crop);
                          }}
                          disabled={available <= 0}
                          title={available <= 0 ? 'Out of stock' : 'Only registered dealers can purchase'}
                        >
                          Buy
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(crop.date).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showBuyModal && selectedCrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Buy {selectedCrop.cropName}</h3>
              <button onClick={() => setShowBuyModal(false)} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity ({selectedCrop.unit})</label>
                <input
                  type="number"
                  min="1"
                  max={selectedCrop.quantityAvailable ?? selectedCrop.quantity ?? 0}
                  value={buyForm.quantity}
                  onChange={(e) => setBuyForm({ ...buyForm, quantity: parseInt(e.target.value) || 1 })}
                  className="mt-1 w-full px-3 py-2 border-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">Available: {selectedCrop.quantityAvailable ?? selectedCrop.quantity ?? 0} {selectedCrop.unit}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Buyer Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={buyForm.buyerName}
                    onChange={(e) => setBuyForm({ ...buyForm, buyerName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Buyer Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={buyForm.buyerEmail}
                    onChange={(e) => setBuyForm({ ...buyForm, buyerEmail: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Buyer Phone (Registered Dealer)</label>
                <input
                  type="tel"
                  placeholder="Enter registered dealer phone"
                  value={buyForm.buyerPhone}
                  onChange={(e) => setBuyForm({ ...buyForm, buyerPhone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border-2 border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Only registered dealers can purchase crops</p>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                <div>
                  <p className="text-sm text-gray-600">Price/Unit</p>
                  <p className="text-lg font-bold">₹{selectedCrop.pricePerUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 text-right">Total</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{(Number(buyForm.quantity || 0) * Number(selectedCrop.pricePerUnit || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              {feedback && (
                <p className={`text-sm ${feedback.toLowerCase().includes('fail') ? 'text-red-600' : 'text-green-600'}`}>
                  {feedback}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700"
                  onClick={() => setShowBuyModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                  onClick={handleBuy}
                  disabled={saving}
                >
                  {saving ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
