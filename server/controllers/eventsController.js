const Event = require('../models/Event');

/**
 * GET /api/events
 */
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, time: 1 });
    const mapped = events.map(e => {
      const obj = e.toObject();
      obj.id = obj._id;
      delete obj._id;
      delete obj.__v;
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    console.error('getEvents error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/events/:id
 */
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const obj = event.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch (err) {
    console.error('getEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/events
 */
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, poster, photos, createdBy } = req.body;
    if (!title || !description || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const photosArray = Array.isArray(photos) ? photos : (photos ? photos.split(',').map(p => p.trim()) : []);
    const event = new Event({
      title,
      description,
      date,
      time,
      venue,
      poster,
      photos: photosArray,
      createdBy
    });
    const saved = await event.save();
    const obj = saved.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    res.status(201).json(obj);
  } catch (err) {
    console.error('createEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/events/:id
 */
exports.updateEvent = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.photos && typeof update.photos === 'string') {
      update.photos = update.photos.split(',').map(p => p.trim());
    }
    const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const obj = event.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    res.json(obj);
  } catch (err) {
    console.error('updateEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/events/:id
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted', id: req.params.id });
  } catch (err) {
    console.error('deleteEvent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};