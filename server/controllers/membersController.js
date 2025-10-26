const User = require('../models/User');

/**
 * GET /api/members
 * Returns all members (role: member)
 */
exports.getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' }).select('-password');
    return res.json(members);
  } catch (err) {
    console.error('getMembers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/members/:id
 */
exports.getMember = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member) return res.status(404).json({ message: 'Member not found' });
    return res.json(member);
  } catch (err) {
    console.error('getMember error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * POST /api/members
 * Create a new member. Expects { name, email, password?, position?, memberId?, enrollmentYear?, profileImgUrl? }
 */
exports.createMember = async (req, res) => {
  try {
    const { name, email, password, position, memberId, enrollmentYear, profileImgUrl } = req.body;

    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const idToUse = memberId || `MEM${Date.now().toString().slice(-6)}`;

    const newUser = new User({
      name,
      email,
      password: password || 'Member@123',
      role: 'member',
      memberId: idToUse,
      position: position || '',
      enrollmentYear: enrollmentYear || new Date().getFullYear(),
      profileImgUrl: profileImgUrl || ''
    });

    await newUser.save();
    const result = newUser.toObject();
    delete result.password;
    return res.status(201).json(result);
  } catch (err) {
    console.error('createMember error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/members/:id
 * Update member fields
 */
exports.updateMember = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, position, memberId, enrollmentYear, profileImgUrl, isPastMember } = req.body;

    // If email changed, ensure uniqueness
    if (email) {
      const other = await User.findOne({ email, _id: { $ne: id } });
      if (other) return res.status(400).json({ message: 'Email already in use' });
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (position !== undefined) update.position = position;
    if (memberId !== undefined) update.memberId = memberId;
    if (enrollmentYear !== undefined) update.enrollmentYear = enrollmentYear;
    if (typeof isPastMember !== 'undefined') update.isPastMember = isPastMember;
    if (profileImgUrl !== undefined) update.profileImgUrl = profileImgUrl;

    const updated = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'Member not found' });

    return res.json(updated);
  } catch (err) {
    console.error('updateMember error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/members/:id
 */
exports.deleteMember = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await User.findByIdAndDelete(id).select('-password');
    if (!removed) return res.status(404).json({ message: 'Member not found' });
    return res.json({ message: 'Member deleted', member: removed });
  } catch (err) {
    console.error('deleteMember error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};