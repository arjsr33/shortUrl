const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl } = require('../controllers/urlController');
const { getStats } = require('../controllers/statsController');

router.post('/shorten', shortenUrl);
router.get('/:shortCode', redirectUrl);
router.get('/:shortCode/stats', getStats); // Bonus

module.exports = router;