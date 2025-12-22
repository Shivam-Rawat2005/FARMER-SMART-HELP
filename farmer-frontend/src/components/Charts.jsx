import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const IncomeChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#16a34a" name="Income (₹)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PriceTrendChart = ({ data, cropName }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN')}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="pricePerUnit" 
          stroke="#16a34a" 
          name={`${cropName} Price (₹/unit)`}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const CropDistributionChart = ({ data }) => {
  const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ _id, totalValue }) => `${_id}: ₹${totalValue.toLocaleString()}`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="totalValue"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
