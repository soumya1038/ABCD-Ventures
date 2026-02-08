const express = require('express');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// Add item to cart
router.post('/carts', auth, async (req, res) => {
  try {
    const { item_id, qty = 1 } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.itemId.toString() === item_id);
    
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ itemId: item_id, quantity: qty });
    }

    await cart.save();
    res.json({ message: 'Item added to cart', cartId: cart._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List all carts
router.get('/carts', async (req, res) => {
  try {
    const carts = await Cart.find().populate('items.itemId');
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's cart
router.get('/carts/me', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.itemId');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
