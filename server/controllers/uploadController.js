const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

// configure (reads from env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const buffer = req.file.buffer;

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'acm_profiles' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Upload failed', error });
      }
      return res.json({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(buffer).pipe(stream);
};

// Update profile photo endpoint (requires auth middleware)
// expects req.user._id (adjust to your auth scheme)
exports.updateProfilePhoto = async (req, res) => {
  try {
    const User = require('../models/User');
    const userId = req.user && req.user._id; // replace with your auth property
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { profilePhoto } = req.body;
    if (!profilePhoto) return res.status(400).json({ message: 'No profilePhoto provided' });

    const updated = await User.findByIdAndUpdate(userId, { profilePhoto }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};