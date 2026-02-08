const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// Create order from cart
router.post('/orders', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const order = new Order({
      userId: req.user._id,
      items: cart.items.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity
      }))
    });

    await order.save();
    
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', orderId: order._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.itemId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's orders
router.get('/orders/me', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('items.itemId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
