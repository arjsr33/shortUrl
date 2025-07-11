const Url = require('../models/Url');
const shortid = require('shortid');
const validUrl = require('valid-url');
console.log(Url)

const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  // Validate URL
  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // Check if URL already exists
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json({
        originalUrl: url.originalUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
      });
    }

    // Create short code
    const shortCode = shortid.generate();
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

    // Save to database
    url = new Url({
      originalUrl,
      shortCode,
    });

    await url.save();

    res.json({
      originalUrl,
      shortUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Increment visit count
    url.visits++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
};