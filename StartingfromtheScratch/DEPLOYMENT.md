# Deployment Guide for Render

## Option 1: Separate Services (Recommended)

### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `MONGODB_URI=your_mongodb_connection_string`
     - `JWT_SECRET=your_jwt_secret_key`
     - `FRONTEND_URL=https://your-frontend-url.onrender.com`

### Frontend Deployment
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL=https://your-backend-url.onrender.com`

## Option 2: Single Service (Full-Stack)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install && cd frontend && npm install && npm run build && cd ..`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `MONGODB_URI=your_mongodb_connection_string`
     - `JWT_SECRET=your_jwt_secret_key`

## Environment Variables Setup

### Backend (.env)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobileRecharge
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Database Setup

1. Use MongoDB Atlas (recommended) or Render's PostgreSQL
2. Update MONGODB_URI in environment variables
3. Run initialization scripts after deployment:
   - Initialize plans: `npm run init-plans`
   - Create admin user: `npm run create-admin`

## Post-Deployment Steps

1. Test all API endpoints
2. Verify frontend-backend communication
3. Initialize database with plans and admin user
4. Update CORS settings if needed
5. Test user registration and login flows

## Troubleshooting

- Check Render logs for deployment errors
- Verify environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check CORS configuration for frontend-backend communication