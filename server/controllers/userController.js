// ...new file...
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const {user} = req.body;
    console.log("trying to update profile");
    console.log(req.body);
    console.log("user from body: ", user);
    const userId = (user && (user.id || user._id));
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, profilePhoto } = req.body;



    const update = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (profilePhoto !== undefined) update.profileImgUrl = profilePhoto;
 

    const updated = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json(updated);
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};