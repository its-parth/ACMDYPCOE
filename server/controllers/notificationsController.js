const Notification = require('../models/Notification');

const mapDoc = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  return obj;
};

/**
 * GET /api/notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    const items = await Notification.find().sort({ date: -1, createdAt: -1 });
    const mapped = items.map(mapDoc);
    res.json(mapped);
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/notifications/:id
 */
exports.getNotification = async (req, res) => {
  try {
    const item = await Notification.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Notification not found' });
    res.json(mapDoc(item));
  } catch (err) {
    console.error('getNotification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/notifications
 * Body: { title, description, date, image, createdBy }
 */
exports.createNotification = async (req, res) => {
  try {
    const { title, description, date, image, createdBy } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newItem = new Notification({ title, description, date, image: image || '', createdBy: createdBy || '' });
    const saved = await newItem.save();
    res.status(201).json(mapDoc(saved));
  } catch (err) {
    console.error('createNotification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/notifications/:id
 */
exports.updateNotification = async (req, res) => {
  try {
    const update = { ...req.body };
    const item = await Notification.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ message: 'Notification not found' });
    res.json(mapDoc(item));
  } catch (err) {
    console.error('updateNotification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
  try {
    const item = await Notification.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    console.error('deleteNotification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};