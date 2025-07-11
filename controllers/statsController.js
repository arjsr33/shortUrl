const Url  = require('../models/Url');

const getStats = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
      visits: url.visits,
      createdAt: url.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getStats,
};