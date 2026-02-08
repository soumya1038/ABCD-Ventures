# Shopping Cart Application

Full-stack e-commerce shopping cart application with Node.js backend and React frontend.

## Features

- User registration and authentication with JWT
- Single-device login enforcement
- Item management (add/list items)
- Cart management (one cart per user)
- Order management (convert cart to order)
- MongoDB database with Mongoose
- CORS enabled for frontend communication

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

### Frontend
- React 18
- Vite
- Axios
- CSS

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier)

### Step 1: MongoDB Atlas Setup

1. Go to https://mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free M0 tier)
4. Create database user:
   - Click "Database Access" → "Add New Database User"
   - Choose username and password
5. Whitelist IP address:
   - Click "Network Access" → "Add IP Address"
   - Use `0.0.0.0/0` for development (allows all IPs)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Step 2: Backend Setup

```bash
cd backend
npm install
```

Edit `.env` file and replace with your MongoDB connection string:
```
MONGDB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/shopping-cart?retryWrites=true&w=majority
JWT_SECRET=your-random-secret-key-change-this
PORT=8088
```

Start backend:
```bash
npm start
```

✅ Server runs on: http://localhost:8088

### Step 3: Frontend Setup

Open new terminal:
```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs on: http://localhost:5111

### Step 4: Test Application

1. Open http://localhost:5111 in browser
2. Click "Register here" to create account
3. Login with your credentials
4. Browse items and click to add to cart
5. Click "Cart" to view cart items
6. Click "Checkout" to create order
7. Click "Order History" to view orders
8. Click "Logout" to end session

## Project Structure

```
ABCDE Ventures/
├── backend/
│   ├── models/          # Database models
│   │   ├── User.js      # User model with token field
│   │   ├── Item.js      # Item model
│   │   ├── Cart.js      # Cart model
│   │   └── Order.js     # Order model
│   ├── routes/          # API routes
│   │   ├── userRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── auth.js      # JWT authentication
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Main server file
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   ├── Register.jsx
│   │   │   ├── ItemList.jsx
│   │   │   └── ItemList.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## API Endpoints

### User Routes
- `POST /users` - Register new user
- `POST /users/login` - Login user (returns JWT token)
- `POST /users/logout` - Logout user (protected)
- `GET /users` - List all users

### Item Routes
- `POST /items` - Create new item
- `GET /items` - List all items

### Cart Routes
- `POST /carts` - Add item to cart (protected)
- `GET /carts` - List all carts
- `GET /carts/me` - Get current user's cart (protected)

### Order Routes
- `POST /orders` - Create order from cart (protected)
- `GET /orders` - List all orders
- `GET /orders/me` - Get current user's orders (protected)

## Usage Flow

1. Register a new account
2. Login with username and password
3. Browse available items
4. Click items to add to cart
5. View cart contents
6. Checkout to create order
7. View order history
8. Logout

## Single-Device Login

- JWT token is stored in user's database record
- On login, if token exists, login is blocked with 403 error
- On logout, token is cleared from database
- Frontend shows: "You are already logged in on another device."

## Sample Data

Backend automatically seeds 6 sample items on first run:
- Laptop (₹75,000)
- Smartphone (₹25,000)
- Headphones (₹3,000)
- Keyboard (₹1,500)
- Mouse (₹800)
- Monitor (₹15,000)

## MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier)
4. Create database user
5. Whitelist your IP (or use 0.0.0.0/0 for development)
6. Get connection string
7. Replace in `.env` file

## Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Check database user credentials
- Whitelist IP address in MongoDB Atlas (Network Access)
- Ensure database name is correct

### Port Already in Use
- Change `PORT` in `backend/.env`
- Update CORS origin in `backend/server.js` if frontend port changes

### Frontend Can't Connect to Backend
- Verify backend is running on port 8088
- Check browser console for errors
- Verify CORS is properly configured

### Login Issues
- Clear browser localStorage
- Verify MongoDB is connected
- Check backend console for errors

## Environment Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopping-cart
JWT_SECRET=your-secret-key
PORT=8088
```

## Notes

- All protected routes require Bearer token in Authorization header
- Cart items automatically increment quantity if same item added
- Cart is cleared after successful checkout
- Password is hashed using bcryptjs before storing
