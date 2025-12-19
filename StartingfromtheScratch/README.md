# Mobile Recharge Application

A full-stack mobile recharge application with 7 unique features, built with React frontend, Express.js backend, and MongoDB database.

## Features

### User Features
1. **User Authentication** - Secure registration and login system
2. **Mobile Recharge** - Quick and easy mobile recharge for prepaid numbers
3. **Transaction History** - Complete history of all transactions with filtering
4. **Wallet Management** - Digital wallet with top-up functionality
5. **Recharge Plans** - Browse and select from various operator plans
6. **Bill Payment** - Pay postpaid bills, DTH, and broadband bills
7. **Notifications** - Real-time notifications for all account activities

### Admin Features
8. **Admin Dashboard** - Comprehensive overview with statistics and quick actions
9. **Plan Management** - Add, edit, delete, and manage recharge plans
10. **Transaction Management** - View all transactions with advanced filtering
11. **User Management** - Manage users, change roles, view user details
12. **Analytics & Reports** - Detailed statistics and insights

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StartingfromtheScratch
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mobileRecharge
   JWT_SECRET=your-secret-key-change-in-production
   PORT=5000
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Compass, ensure it's connected to `mongodb://localhost:27017`

6. **Initialize default plans (optional)**
   ```bash
   npm run init-plans
   ```

7. **Create admin user (optional)**
   ```bash
   npm run create-admin
   ```
   Default admin credentials:
   - Email: `admin@recharge.com`
   - Password: `admin123`
   
   **⚠️ Change the password immediately after first login!**

## Running the Application

1. **Start the backend server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## Project Structure

```
StartingfromtheScratch/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # React context (Auth)
│   │   └── App.js       # Main App component
│   └── package.json
├── .env                 # Environment variables
├── package.json         # Backend dependencies
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Recharge
- `POST /api/recharge` - Perform mobile recharge
- `GET /api/recharge/history` - Get recharge history

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/topup` - Top up wallet
- `GET /api/wallet/transactions` - Get wallet transactions

### Plans
- `GET /api/plans` - Get all recharge plans
- `GET /api/plans/:id` - Get plan by ID
- `POST /api/plans/initialize` - Initialize default plans

### Admin (Admin Only)
- `GET /api/admin/dashboard` - Get admin dashboard statistics
- `GET /api/admin/users` - Get all users (with search)
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/transactions` - Get all transactions (with filters)
- `GET /api/admin/transactions/stats` - Get transaction statistics
- `GET /api/admin/plans` - Get all plans (admin view)
- `POST /api/admin/plans` - Create new plan
- `PUT /api/admin/plans/:id` - Update plan
- `DELETE /api/admin/plans/:id` - Delete plan

### Bills
- `POST /api/bills/pay` - Pay a bill
- `GET /api/bills/history` - Get bill payment history

### Notifications
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/unread/count` - Get unread count

## Usage

### For Users
1. **Register/Login**: Create an account or login with existing credentials
2. **Top Up Wallet**: Add money to your wallet for recharges and bill payments
3. **Mobile Recharge**: Select operator, enter mobile number and amount to recharge
4. **View Plans**: Browse available recharge plans by operator
5. **Pay Bills**: Pay postpaid bills, DTH, or broadband bills
6. **View Transactions**: Check complete transaction history
7. **Notifications**: Stay updated with account activities

### For Admins
1. **Login as Admin**: Use admin credentials to access admin panel
2. **Dashboard**: View platform statistics and recent activity
3. **Manage Plans**: Add, edit, or delete recharge plans
4. **View Transactions**: Monitor all transactions with filtering options
5. **Manage Users**: View users, change roles, see user details
6. **Analytics**: View detailed statistics and reports

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for detailed admin panel documentation.

## Database Schema

### User
- name, email, password, phone, walletBalance

### Transaction
- userId, type, mobileNumber, operator, amount, status, transactionId

### Plan
- operator, planName, price, validity, data, talktime

### Notification
- userId, title, message, type, isRead

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Input validation using express-validator
- Protected routes with authentication middleware

## Error Handling

The application includes comprehensive error handling:
- Input validation errors
- Authentication errors
- Database errors
- API errors

## UI Features

- **Attractive Design**: Modern gradient backgrounds with smooth animations
- **Interactive Colors**: Vibrant color schemes with hover effects
- **Smooth Transitions**: All interactions have smooth animations
- **Responsive Layout**: Works perfectly on all screen sizes
- **Card-based Design**: Clean card layouts with shadows and hover effects
- **Gradient Buttons**: Beautiful gradient buttons with hover animations

## Future Enhancements

- Payment gateway integration
- SMS notifications
- Referral system
- Cashback and offers
- Multiple payment methods
- Mobile app version
- Advanced analytics charts
- Export reports functionality

## License

ISC

## Support

For issues and questions, please create an issue in the repository.

