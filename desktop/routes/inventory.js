const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/inventory.json');

function getInventory() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveInventory(inventory) {
  fs.ensureDirSync(path.dirname(DATA_FILE));
  fs.writeFileSync(DATA_FILE, JSON.stringify(inventory, null, 2));
}

router.get('/', (req, res) => {
  try {
    const inventory = getInventory();
    const { companyId, category } = req.query;
    
    let filtered = inventory;
    if (companyId) {
      filtered = filtered.filter(i => i.companyId === companyId);
    }
    if (category) {
      filtered = filtered.filter(i => i.category === category);
    }
    
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const inventory = getInventory();
    const newItem = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inventory.push(newItem);
    saveInventory(inventory);
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const inventory = getInventory();
    const item = inventory.find(i => i.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const inventory = getInventory();
    const index = inventory.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    inventory[index] = {
      ...inventory[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    saveInventory(inventory);
    res.json(inventory[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const inventory = getInventory();
    const filtered = inventory.filter(i => i.id !== req.params.id);
    if (inventory.length === filtered.length) {
      return res.status(404).json({ error: 'Item not found' });
    }
    saveInventory(filtered);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
