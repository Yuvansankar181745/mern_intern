# Troubleshooting Guide

## Admin Login Issues

### Problem: Admin login redirects to user dashboard instead of admin panel

**Solution:**

1. **Verify Admin User Exists:**
   ```bash
   npm run verify-admin
   ```
   This will check if the admin user exists and has the correct role.

2. **Create/Update Admin User:**
   ```bash
   npm run create-admin
   ```
   This will create the admin user or update the role if the user exists but doesn't have admin role.

3. **Manual Database Check:**
   - Open MongoDB Compass
   - Connect to your database
   - Go to `users` collection
   - Find user with email `admin@recharge.com`
   - Verify `role` field is set to `"admin"` (not `"user"`)

4. **Clear Browser Cache:**
   - Clear localStorage
   - Clear browser cache
   - Try logging in again

5. **Check Backend Response:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Login and check the `/api/auth/login` response
   - Verify the `user` object has `role: "admin"`

### Problem: Admin user exists but role is "user"

**Solution:**

Run the verify script which will automatically fix it:
```bash
npm run verify-admin
```

Or manually update in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@recharge.com" },
  { $set: { role: "admin" } }
)
```

### Problem: Cannot access admin routes

**Check:**
1. User role is set to "admin" in database
2. JWT token includes role information
3. Logout and login again to refresh token
4. Check browser console for errors

## Common Issues

### MongoDB Connection Issues

**Error:** `MongoDB Connection Error`

**Solutions:**
1. Ensure MongoDB is running
2. Check MongoDB URI in `.env` file
3. Verify MongoDB Compass can connect
4. Check if port 27017 is not blocked

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Change PORT in `.env` file
2. Kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill
   ```

### Frontend Not Connecting to Backend

**Solutions:**
1. Ensure backend is running on port 5000
2. Check proxy setting in `frontend/package.json`
3. Verify CORS is enabled in backend
4. Check browser console for CORS errors

### Role Not Updating After Login

**Solutions:**
1. Logout completely
2. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Login again
4. Check if role is in the login response

## Testing Admin Access

1. **Create Admin User:**
   ```bash
   npm run create-admin
   ```

2. **Verify Admin User:**
   ```bash
   npm run verify-admin
   ```

3. **Login:**
   - Email: `admin@recharge.com`
   - Password: `admin123`

4. **Expected Behavior:**
   - Should see "👑 Admin" badge
   - Should redirect to `/admin` (Admin Dashboard)
   - Navbar should show admin menu items
   - Should NOT see user menu items (Recharge, Wallet, etc.)

5. **If Still Redirecting to User Dashboard:**
   - Check browser console for errors
   - Verify role in localStorage: `JSON.parse(localStorage.getItem('user')).role`
   - Should be `"admin"` not `"user"`

## Database Queries

### Check User Role
```javascript
db.users.findOne({ email: "admin@recharge.com" }, { role: 1, email: 1, name: 1 })
```

### Update User Role to Admin
```javascript
db.users.updateOne(
  { email: "admin@recharge.com" },
  { $set: { role: "admin" } }
)
```

### List All Admins
```javascript
db.users.find({ role: "admin" })
```

### Reset Admin Password
```javascript
// Note: Password will be hashed automatically
db.users.updateOne(
  { email: "admin@recharge.com" },
  { $set: { password: "newpassword123" } }
)
```

## Still Having Issues?

1. Check server logs for errors
2. Check browser console for errors
3. Verify MongoDB connection
4. Ensure all dependencies are installed
5. Try restarting both backend and frontend servers

