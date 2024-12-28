const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [stocks] = await pool.query('SELECT StockSymbol, CurrentPrice FROM stocks');
        res.json({ stocks });
        console.log(stocks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stocks' });
    }
});

module.exports = router;
