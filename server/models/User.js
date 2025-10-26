const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },

  // 🔹 New fields
  memberId: { type: String, unique: true }, // e.g. "MEM001", "MEM002"
  position: { type: String }, // e.g. "President", "Vice President", "Developer"
  enrollmentYear: { type: Number }, // e.g. 2023
  isPastMember: { type: Boolean, default: false },
  profileImgUrl: { type: String, default: "" },

  // 🔹 Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true }); // adds createdAt & updatedAt automatically

// 🔹 Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔹 Compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
