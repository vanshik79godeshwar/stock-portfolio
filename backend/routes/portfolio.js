const express = require('express');
const pool = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.userId = decoded.userId;
    next();
  });
};

router.get('/summary', verifyToken, async (req, res) => {
  try {
    const [portfolio] = await pool.query(
      `SELECT p.StockSymbol, p.Quantity, p.TotalInvestment, s.CurrentPrice 
      FROM portfolio p 
      JOIN stocks s ON p.StockSymbol = s.StockSymbol
      WHERE p.UserID = ?`,
      [req.userId]
    );
    res.json({ portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

router.post('/buy', verifyToken, async (req, res) => {
  const { stockSymbol, quantity, price } = req.body;
  try {
    await pool.query('CALL buy_stock(?, ?, ?, ?)', [req.userId, stockSymbol, quantity, price]);
    res.json({ message: 'Stock bought successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error buying stock' });
  }
});

router.post('/sell', verifyToken, async (req, res) => {
  const { stockSymbol, quantity } = req.body;
  try {
    await pool.query('CALL ssssssell_stock(?, ?, ?)', [req.userId, stockSymbol, quantity]);
    res.json({ message: 'Stock sold successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error selling stock' });
  }
});

module.exports = router;
