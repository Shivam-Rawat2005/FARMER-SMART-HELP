# Quick Start Guide - Farmers Smart Help NaapTol

## ⚡ Quick Setup (5 minutes)

### Step 1: Install MongoDB
If you don't have MongoDB installed:
- **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- **Mac**: `brew install mongodb-community`
- **Linux**: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

Start MongoDB:
```bash
# Windows (run as service or)
mongod

# Mac/Linux
sudo systemctl start mongod
```

### Step 2: Backend Setup
```bash
cd farmer-backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmers-smart-help
JWT_SECRET=my_super_secret_key_12345
WEATHER_API_KEY=get_from_openweathermap
NODE_ENV=development
```

Start backend:
```bash
npm start
```

### Step 3: Frontend Setup
Open a new terminal:
```bash
cd farmer-frontend
npm install
npm run dev
```

### Step 4: Access the Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Step 5: Create Test Accounts

#### Create Admin Account:
1. Go to http://localhost:5173/register
2. Fill in:
   - Name: Admin User
   - Email: admin@test.com
   - Password: admin123
   - Role: Admin
3. Click Register

#### Create Farmer Account:
1. Logout and go to register again
2. Fill in:
   - Name: Test Farmer
   - Email: farmer@test.com
   - Password: farmer123
   - Role: Farmer
3. Click Register

## 🎯 Test the Features

### As a Farmer:
1. **Add Crop**: Go to NaapTol → Add crop details → Submit
2. **View Analytics**: Go to Analytics → See charts and trends
3. **Check Weather**: Go to Weather → Enter city → Get forecast
4. **Find Dealers**: Go to Dealers → Search by crop type
5. **Read Tips**: Go to Tips → Browse farming advice
6. **Chat**: Go to Chat → Send messages

### As an Admin:
1. Login with admin@test.com
2. **View Dashboard**: See all farmers' data
3. **Add Dealer**: Go to Dealers → Click "Add New Dealer"
4. **Add Tip**: Go to Tips → Click "Add New Tip"
5. **View Analytics**: See platform-wide statistics
6. **Chat**: Communicate with farmers

## 🔧 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# Mac/Linux
sudo systemctl status mongod
```

### Issue: Port 5000 already in use
**Solution**: Change port in backend `.env`:
```env
PORT=5001
```

### Issue: Frontend can't connect to backend
**Solution**: Check if backend is running on http://localhost:5000

### Issue: Weather not showing
**Solution**: 
1. Get free API key from https://openweathermap.org/api
2. Add to backend `.env` file as `WEATHER_API_KEY`
3. Or use mock data (app works without API key)

## 📚 API Testing with Postman

Import these requests to test the API:

### Register User
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "role": "farmer"
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "test123"
}
```

### Add Crop (requires token)
```
POST http://localhost:5000/api/crop/add
Headers:
Authorization: Bearer YOUR_JWT_TOKEN
Body (JSON):
{
  "cropName": "Wheat",
  "quantity": 100,
  "unit": "quintal",
  "pricePerUnit": 2000
}
```

## 🎨 Customization

### Change Theme Colors
Edit `farmer-frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values
        600: '#16a34a',
        700: '#15803d',
      }
    }
  }
}
```

### Change App Name
1. Update `farmer-frontend/index.html` title
2. Update Navbar component
3. Update README

## 🚀 Production Deployment Checklist

### Backend
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas (cloud database)
- [ ] Generate strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set CORS to production frontend URL
- [ ] Add rate limiting
- [ ] Enable logging

### Frontend
- [ ] Build production bundle: `npm run build`
- [ ] Update API URLs to production
- [ ] Enable HTTPS
- [ ] Optimize images
- [ ] Add error tracking

## 💡 Tips for Best Experience

1. **Use Chrome/Firefox** for best compatibility
2. **Enable JavaScript** in browser
3. **Clear cache** if seeing old data
4. **Use strong passwords** in production
5. **Backup database** regularly

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review error logs in terminal
- Check browser console for frontend errors
- Verify all environment variables are set

---

Happy Farming! 🌾
