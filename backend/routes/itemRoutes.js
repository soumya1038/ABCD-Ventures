const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// Create new item
router.post('/items', async (req, res) => {
  try {
    const { name, price } = req.body;
    const item = new Item({ name, price });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List all items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
