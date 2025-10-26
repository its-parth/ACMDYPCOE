const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
// const auth = require('../middleware/auth'); // uncomment/replace with your auth middleware

// multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload  (uploads image and returns { url })
router.post('/', /* auth, */ upload.single('image'), uploadController.uploadImage);

// PUT /api/users/me/photo  (update user's profilePhoto — optional if you use /api/users/me already)
router.put('/profile-photo', /* auth, */ async (req, res, next) => {
  // delegate to controller.updateProfilePhoto if you want to separate file upload from DB update
  return uploadController.updateProfilePhoto(req, res, next);
});

module.exports = router;