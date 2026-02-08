require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5111',
  credentials: true
}));
app.use(express.json());

// Routes
app.use(userRoutes);
app.use(itemRoutes);
app.use(cartRoutes);
app.use(orderRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Seed sample data
async function seedData() {
  const Item = require('./models/Item');
  const count = await Item.countDocuments();
  
  if (count === 0) {
    const items = [
      { name: 'Laptop', price: 75000 },
      { name: 'Smartphone', price: 25000 },
      { name: 'Headphones', price: 3000 },
      { name: 'Keyboard', price: 1500 },
      { name: 'Mouse', price: 800 },
      { name: 'Monitor', price: 15000 }
    ];
    
    await Item.insertMany(items);
    console.log('Sample items seeded');
  }
}

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
