# Admin Panel Guide

## Overview

The Admin Panel provides comprehensive management tools for the mobile recharge application. Only users with admin role can access these features.

## Creating an Admin User

### Method 1: Using Script (Recommended)

Run the following command to create a default admin user:

```bash
npm run create-admin
```

Default credentials:
- Email: `admin@recharge.com`
- Password: `admin123`

**⚠️ Important:** Change the password immediately after first login!

**Note:** If you're having issues logging in as admin, verify the admin user exists and has the correct role:
```bash
npm run verify-admin
```

This will check if the admin user exists and ensure the role is set to 'admin'.

### Method 2: Manual Creation via Database

1. Register a normal user account
2. Connect to MongoDB
3. Update the user's role to 'admin':

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Via Admin Panel (if you already have admin access)

1. Login as admin
2. Go to Admin Panel > Users
3. Find the user
4. Change their role to "Admin" using the dropdown

## Admin Features

### 1. Admin Dashboard (`/admin`)

**Overview Statistics:**
- Total Users
- Total Revenue
- Total Transactions
- Active Plans

**Quick Actions:**
- Manage Plans
- View Transactions
- Manage Users
- View Analytics

**Recent Activity:**
- Latest transactions
- New user registrations

### 2. Manage Plans (`/admin/plans`)

**Features:**
- ✅ Add new recharge plans
- ✅ Edit existing plans
- ✅ Delete plans
- ✅ Activate/Deactivate plans
- ✅ View all plans in a table

**Plan Fields:**
- Operator (Airtel, Jio, Vi, BSNL)
- Plan Name
- Price (₹)
- Validity (e.g., "28 days")
- Data (e.g., "2GB/day")
- Talktime (e.g., "Unlimited")
- Description (optional)
- Active Status (checkbox)

**How to Add a Plan:**
1. Click "+ Add New Plan"
2. Fill in all required fields
3. Click "Create Plan"

**How to Edit a Plan:**
1. Find the plan in the table
2. Click "Edit" button
3. Modify the fields
4. Click "Update Plan"

**How to Delete a Plan:**
1. Find the plan in the table
2. Click "Delete" button
3. Confirm deletion

### 3. Transaction Management (`/admin/transactions`)

**Features:**
- ✅ View all transactions
- ✅ Filter by type (recharge, bill_payment, wallet_topup)
- ✅ Filter by status (success, pending, failed)
- ✅ View transaction statistics
- ✅ See user details for each transaction

**Statistics Displayed:**
- Total Transactions
- Total Revenue
- Successful Transactions Count
- Success Revenue

**Transaction Details:**
- Transaction ID
- User Name
- Transaction Type
- Mobile Number
- Operator
- Amount
- Status
- Date/Time

### 4. User Management (`/admin/users`)

**Features:**
- ✅ View all users
- ✅ Search users by name, email, or phone
- ✅ View user details
- ✅ Change user roles (User/Admin)
- ✅ View user transaction history

**User Information:**
- Name
- Email
- Phone
- Wallet Balance
- Role
- Join Date

**How to Change User Role:**
1. Find the user in the table
2. Use the dropdown in the "Role" column
3. Select "User" or "Admin"
4. Role is updated automatically

**How to View User Details:**
1. Click "View Details" button
2. See complete user information
3. View user's transaction history

### 5. Analytics & Reports (`/admin/analytics`)

**Features:**
- ✅ Transaction statistics by type
- ✅ Status breakdown
- ✅ Overall platform statistics
- ✅ Revenue insights

**Statistics Provided:**
- Transaction counts by type
- Revenue by transaction type
- Status breakdown (success/pending/failed)
- Overall platform metrics

## Admin API Endpoints

All admin endpoints require authentication and admin role:

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### Users
- `GET /api/admin/users` - Get all users (with search)
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/role` - Update user role

### Transactions
- `GET /api/admin/transactions` - Get all transactions (with filters)
- `GET /api/admin/transactions/stats` - Get transaction statistics

### Plans
- `GET /api/admin/plans` - Get all plans
- `POST /api/admin/plans` - Create new plan
- `PUT /api/admin/plans/:id` - Update plan
- `DELETE /api/admin/plans/:id` - Delete plan

## Security Features

1. **Role-Based Access Control:** Only users with `role: 'admin'` can access admin routes
2. **Authentication Required:** All admin endpoints require valid JWT token
3. **Middleware Protection:** Admin routes are protected by admin middleware
4. **Input Validation:** All admin actions include server-side validation

## Best Practices

1. **Change Default Password:** Always change the default admin password
2. **Regular Backups:** Backup your database regularly
3. **Monitor Transactions:** Regularly check transaction statistics
4. **User Management:** Review user accounts periodically
5. **Plan Updates:** Keep recharge plans updated and accurate
6. **Security:** Don't share admin credentials

## Troubleshooting

### Can't Access Admin Panel

1. Check if your user role is set to 'admin' in database
2. Logout and login again to refresh token
3. Verify JWT token includes role information

### Plans Not Showing

1. Check if plans are marked as active (`isActive: true`)
2. Verify operator name matches exactly (case-sensitive)
3. Check database connection

### Transactions Not Loading

1. Verify database connection
2. Check if transactions exist in database
3. Review server logs for errors

### User Role Not Updating

1. Check server logs for errors
2. Verify user ID is correct
3. Ensure you have admin privileges

## Support

For issues or questions about the admin panel, check:
- Server logs for error messages
- Database connection status
- API endpoint responses

