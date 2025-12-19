# Setup Guide

## Quick Start

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure MongoDB

The application is configured to use MongoDB Atlas (cloud database). The connection string is already set up in the code.

**Note:** If you want to use a local MongoDB instance instead, create a `.env` file and set your local connection string.

### Step 3: Set Up Environment Variables (Optional)

If you want to override the default MongoDB Atlas connection, create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://yuvansankarc:vimal@cluster0.lh8nikm.mongodb.net/mobileRecharge?appName=Cluster0
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

**Default Configuration:** The application uses MongoDB Atlas by default. No `.env` file is required unless you want to customize the connection.

### Step 4: Initialize Default Plans (Optional)

```bash
npm run init-plans
```

Or you can use the API endpoint after starting the server:
```bash
POST http://localhost:5000/api/plans/initialize
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 6: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing the Application

1. **Register a new account:**
   - Go to http://localhost:3000/register
   - Fill in name, email, phone, and password
   - Click Register

2. **Login:**
   - Use your registered credentials
   - You'll be redirected to the dashboard

3. **Top up your wallet:**
   - Go to Wallet page
   - Enter an amount and click Top Up

4. **Perform a recharge:**
   - Go to Recharge page
   - Enter mobile number, select operator and circle
   - Enter amount or select from plans
   - Click Recharge Now

5. **View transactions:**
   - Go to Transactions page
   - See all your transaction history

6. **Browse plans:**
   - Go to Plans page
   - Filter by operator
   - Select a plan to recharge

7. **Pay bills:**
   - Go to Bills page
   - Enter bill details and pay

8. **Check notifications:**
   - Go to Notifications page
   - See all account activities

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod` or check MongoDB Compass connection
- Verify the MongoDB URI in `.env` file
- Check if the port 27017 is not blocked

### Port Already in Use

- Change the PORT in `.env` file
- Or stop the process using the port

### Frontend Not Connecting to Backend

- Ensure backend is running on port 5000
- Check the proxy setting in `frontend/package.json`
- Verify CORS is enabled in backend

### Module Not Found Errors

- Run `npm install` in both root and frontend directories
- Delete `node_modules` and `package-lock.json`, then reinstall

## Database Schema

The application uses MongoDB with the following collections:

- **users**: User accounts with wallet balance
- **transactions**: All recharge and bill payment transactions
- **plans**: Available recharge plans
- **notifications**: User notifications

## API Testing

You can test the API using Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456","phone":"1234567890"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## Features Implemented

✅ User Authentication (Register/Login)
✅ Mobile Recharge
✅ Transaction History
✅ Wallet Management
✅ Recharge Plans
✅ Bill Payment
✅ Notifications

All features are fully functional and error-free!

