// backend/routes/adminRoutes.js
const express = require('express');
const verifyAdminToken = require('../middleware/adminAuthMiddleware');

const router = express.Router();

router.post('/verify-admin', verifyAdminToken, (req, res) => {
    res.status(200).json({ message: 'Token válido. Acesso autorizado.' });
});

module.exports = router;
