# Farmers Smart Help - NaapTol 🌾

A full-stack MERN (MongoDB, Express, React, Node.js) web application that helps farmers digitally manage crop measurement (NaapTol), pricing, analytics, dealers, weather information, and real-time communication.

## 🎯 Project Overview

**Farmers Smart Help - NaapTol** is a comprehensive platform designed to empower farmers with digital tools for:
- **Crop Management**: Track crops, quantities, and prices with the NaapTol (measurement) system
- **Analytics Dashboard**: Visualize income trends, price trends, and crop performance
- **Dealer Network**: Connect with crop-specific dealers
- **Weather Updates**: Get real-time weather forecasts for better farming decisions
- **Farming Tips**: Access expert advice and government scheme information
- **Real-time Chat**: Communicate with admins and other farmers using Socket.io

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management
- **Recharts** for data visualization
- **Socket.io Client** for real-time chat
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.io** for real-time communication
- **bcryptjs** for password hashing
- **CORS** enabled

## 📋 Features

### 👨‍🌾 Farmer Features
- Register and login securely
- Add crops with quantity (kg/quintal/ton) and pricing
- View total income and crop history
- Track price trends with interactive charts
- Access weather forecasts with farming recommendations
- Browse and contact dealers by crop type
- View farming tips and best practices
- Real-time chat with admins and community

### 🧑‍💼 Admin Features
- Secure admin login
- View platform-wide analytics
- Monitor all farmers' crop data
- Add and manage dealers
- Create farming tips and guidance
- Manage government scheme information
- Real-time communication with farmers

## 📁 Project Structure

```
Farmers-Smart-Help-NaapTol/
│
├── farmer-backend/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── jwtConfig.js         # JWT configuration
│   │
│   ├── models/
│   │   ├── User.js              # User schema (farmer/admin)
│   │   ├── Crop.js              # Crop measurement schema
│   │   ├── Dealer.js            # Dealer information
│   │   ├── Tip.js               # Farming tips
│   │   └── Message.js           # Chat messages
│   │
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── crop.js              # Crop management
│   │   ├── analytics.js         # Analytics endpoints
│   │   ├── dealer.js            # Dealer management
│   │   ├── tips.js              # Tips management
│   │   ├── weather.js           # Weather API integration
│   │   └── chat.js              # Chat message routes
│   │
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   │
│   ├── server.js                # Express server setup
│   ├── socket.js                # Socket.io configuration
│   ├── package.json
│   └── .env
│
└── farmer-frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── FarmerDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── NaapTol.jsx      # Crop measurement page
    │   │   ├── Analytics.jsx
    │   │   ├── Dealers.jsx
    │   │   ├── Tips.jsx
    │   │   ├── Weather.jsx
    │   │   └── Chat.jsx
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Charts.jsx       # Recharts components
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx  # Authentication context
    │   │
    │   ├── services/
    │   │   └── api.js           # Axios API client
    │   │
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd farmer-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `farmer-backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/farmers-smart-help
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   WEATHER_API_KEY=your_openweathermap_api_key
   NODE_ENV=development
   ```

   **Note**: 
   - Get a free Weather API key from [OpenWeatherMap](https://openweathermap.org/api)
   - For MongoDB Atlas, use the connection string provided by Atlas

4. **Start the backend server**
   ```bash
   npm start
   # Or for development with auto-reload
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd farmer-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**
   
   Create a `.env` file in the `farmer-frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🔐 Authentication

### Default Admin Account
Create an admin account by registering with role 'admin':
```javascript
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Default Farmer Account
Register as a farmer (default role):
```javascript
{
  "name": "Farmer Name",
  "email": "farmer@example.com",
  "password": "farmer123",
  "role": "farmer"
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Crops
- `POST /api/crop/add` - Add new crop (Protected)
- `GET /api/crop/my-crops` - Get farmer's crops (Protected)
- `GET /api/crop/all` - Get all crops (Admin only)
- `DELETE /api/crop/:id` - Delete crop (Protected)

### Analytics
- `GET /api/analytics/income?period=monthly` - Get income analytics
- `GET /api/analytics/price-trends` - Get crop price trends
- `GET /api/analytics/crop-summary` - Get crop-wise summary

### Dealers
- `POST /api/dealer/add` - Add dealer (Admin only)
- `GET /api/dealer/list?cropType=wheat` - Get dealers list
- `PUT /api/dealer/:id` - Update dealer (Admin only)
- `DELETE /api/dealer/:id` - Delete dealer (Admin only)

### Tips
- `POST /api/tips/add` - Add farming tip (Admin only)
- `GET /api/tips/list?category=seasonal` - Get tips
- `DELETE /api/tips/:id` - Delete tip (Admin only)

### Weather
- `GET /api/weather/:city` - Get weather forecast

### Chat
- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/message` - Send message

### Socket.io Events
- `join_chat` - Join chat room
- `send_message` - Send a message
- `receive_message` - Receive messages
- `typing` - User typing indicator

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (farmer/admin),
  createdAt: Date
}
```

### Crop Model
```javascript
{
  farmerId: ObjectId (ref: User),
  cropName: String,
  quantity: Number,
  unit: String (kg/quintal/ton),
  pricePerUnit: Number,
  totalPrice: Number (auto-calculated),
  date: Date
}
```

### Dealer Model
```javascript
{
  name: String,
  cropType: String,
  phone: String,
  location: String,
  createdAt: Date
}
```

### Tip Model
```javascript
{
  title: String,
  description: String,
  category: String (best-practices/seasonal/government-schemes/general),
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Message Model
```javascript
{
  senderId: ObjectId (ref: User),
  senderName: String,
  message: String,
  timestamp: Date
}
```

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color-coded Roles**: Visual distinction between farmers and admins
- **Interactive Charts**: Line charts, bar charts, and pie charts for analytics
- **Real-time Updates**: Live chat with typing indicators
- **Farmer-friendly**: Simple and intuitive interface
- **Dark/Light Cards**: Beautiful gradient cards for data display

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes (frontend and backend)
- Role-based access control (RBAC)
- CORS enabled for cross-origin requests
- Token expiration handling

## 🌟 Advanced Features

1. **Auto-calculation**: Total crop value calculated automatically
2. **Price Trends**: Historical price tracking per crop
3. **Weather Integration**: Real-time weather with farming recommendations
4. **Chat System**: Real-time messaging with Socket.io
5. **Analytics Dashboard**: Visual representation of income and trends
6. **Search & Filter**: Filter dealers by crop type, filter tips by category

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Make sure MongoDB is running
# For local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

**Port Already in Use**
```bash
# Change PORT in .env file to a different port
PORT=5001
```

### Frontend Issues

**Module Not Found**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Vite Build Errors**
```bash
# Clear Vite cache
npm run dev -- --force
```

## 📱 Usage Guide

### For Farmers

1. **Register/Login**: Create an account or login
2. **Add Crops**: Go to NaapTol page and add your crops with measurements
3. **View Analytics**: Check your income trends and price analysis
4. **Find Dealers**: Browse dealers filtered by your crop type
5. **Check Weather**: Get weather forecasts for your location
6. **Read Tips**: Access farming tips and government schemes
7. **Chat**: Connect with admins and community

### For Admins

1. **Login**: Use admin credentials
2. **Monitor Platform**: View all farmers' data on dashboard
3. **Manage Dealers**: Add, update, or remove dealers
4. **Add Tips**: Share farming knowledge and best practices
5. **View Analytics**: Platform-wide analytics and trends
6. **Support Farmers**: Respond to farmer queries via chat

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables on hosting platform
2. Update MongoDB URI to production database
3. Update CORS origin to production frontend URL
4. Deploy backend code

### Frontend Deployment (Vercel/Netlify)

1. Build the production bundle
   ```bash
   npm run build
   ```
2. Set environment variables
3. Deploy the `dist` folder

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer

Built with ❤️ for farmers

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

**Happy Farming! 🌾🚜**
