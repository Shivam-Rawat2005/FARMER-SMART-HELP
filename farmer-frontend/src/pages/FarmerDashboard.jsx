import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { cropAPI, analyticsAPI } from '../services/api';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCrops: 0,
    totalIncome: 0,
    recentCrops: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [cropsRes, analyticsRes] = await Promise.all([
        cropAPI.getMyCrops(),
        analyticsAPI.getIncome('monthly')
      ]);

      setStats({
        totalCrops: cropsRes.data.length,
        totalIncome: analyticsRes.data.totalIncome,
        recentCrops: cropsRes.data.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
            Welcome back, {user.name}! 🌾
          </h1>
          <p className="text-gray-600 mt-2">Here's your farming overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Crops</h3>
            <p className="text-4xl font-bold mt-2">{stats.totalCrops}</p>
            <Link to="/naaptol" className="text-sm mt-4 inline-block hover:underline">
              Add New Crop →
            </Link>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Income</h3>
            <p className="text-4xl font-bold mt-2">₹{stats.totalIncome.toLocaleString()}</p>
            <Link to="/analytics" className="text-sm mt-4 inline-block hover:underline">
              View Analytics →
            </Link>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <Link to="/weather" className="block text-sm hover:underline">☁️ Check Weather</Link>
              <Link to="/dealers" className="block text-sm hover:underline">📞 Find Dealers</Link>
              <Link to="/tips" className="block text-sm hover:underline">💡 Farming Tips</Link>
            </div>
          </div>
        </div>

        {/* Recent Crops */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Crops</h2>
            <Link to="/naaptol" className="btn-primary">
              Add New Crop
            </Link>
          </div>

          {stats.recentCrops.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl">🌱</span>
              <p className="text-gray-600 mt-4">No crops added yet</p>
              <Link to="/naaptol" className="btn-primary mt-4 inline-block">
                Add Your First Crop
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentCrops.map((crop) => (
                    <tr key={crop._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{crop.cropName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{crop.quantity} {crop.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{crop.pricePerUnit}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                        ₹{crop.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(crop.date).toLocaleDateString('en-IN')}
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
  );
};

export default FarmerDashboard;
