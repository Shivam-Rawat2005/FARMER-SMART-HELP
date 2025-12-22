import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { IncomeChart, PriceTrendChart, CropDistributionChart } from '../components/Charts';

const Analytics = () => {
  const [period, setPeriod] = useState('monthly');
  const [incomeData, setIncomeData] = useState(null);
  const [priceTrends, setPriceTrends] = useState({});
  const [cropSummary, setCropSummary] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const [incomeRes, trendsRes, summaryRes] = await Promise.all([
        analyticsAPI.getIncome(period),
        analyticsAPI.getPriceTrends(),
        analyticsAPI.getCropSummary()
      ]);

      setIncomeData(incomeRes.data);
      setPriceTrends(trendsRes.data);
      setCropSummary(summaryRes.data);

      // Set first crop as selected by default
      if (Object.keys(trendsRes.data).length > 0 && !selectedCrop) {
        setSelectedCrop(Object.keys(trendsRes.data)[0]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard </h1>
          <p className="text-gray-600 mt-2">Track your income, trends, and crop performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Income</h3>
            <p className="text-4xl font-bold mt-2">{incomeData?.totalIncome?.toLocaleString() || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Total Crops Sold</h3>
            <p className="text-4xl font-bold mt-2">{incomeData?.totalCrops || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold opacity-90">Crop Types</h3>
            <p className="text-4xl font-bold mt-2">{cropSummary?.length || 0}</p>
          </div>
        </div>

        {/* Income Chart */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Income Trend</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input-field w-auto"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {incomeData?.chartData?.length > 0 ? (
            <IncomeChart data={incomeData.chartData} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No income data available
            </div>
          )}
        </div>

        {/* Crop Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Crop-wise Summary</h2>
            
            {cropSummary.length > 0 ? (
              <div className="space-y-4">
                {cropSummary.map((crop) => (
                  <div key={crop._id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{crop._id}</h3>
                      <span className="text-green-600 font-bold">
                        {crop.totalValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-semibold">{crop.totalQuantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Price</p>
                        <p className="font-semibold">{crop.avgPrice.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Entries</p>
                        <p className="font-semibold">{crop.count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No crop data available
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Crop Value Distribution</h2>
            {cropSummary.length > 0 ? (
              <CropDistributionChart data={cropSummary} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                No crop data available
              </div>
            )}
          </div>
        </div>

        {/* Price Trends */}
        {Object.keys(priceTrends).length > 0 && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Price Trends</h2>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="input-field w-auto"
              >
                {Object.keys(priceTrends).map((cropName) => (
                  <option key={cropName} value={cropName}>
                    {cropName}
                  </option>
                ))}
              </select>
            </div>

            {selectedCrop && priceTrends[selectedCrop] && (
              <PriceTrendChart 
                data={priceTrends[selectedCrop]} 
                cropName={selectedCrop}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
