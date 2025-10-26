const mongoose = require('mongoose');
const User = require('./models/User'); // ✅ path to your User model

const MONGO_URI = 'mongodb+srv://parthmagar789:7798439657@cluster0.rdthoa2.mongodb.net/ACMDatabase?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Clear previous users if needed
    await User.deleteMany({});
    console.log("🧹 Existing users cleared.");

    // Dummy users with all enrollmentYear = 2025
    const dummyUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin@123',
        role: 'admin',
        memberId: 'MEM001',
        position: 'President',
        enrollmentYear: 2025,
        isPastMember: false,
        profileImgUrl: 'https://i.pravatar.cc/150?img=1'
      },
      {
        name: 'Dhanashree Shinde',
        email: 'dhanashree@example.com',
        password: 'Dhana@123',
        role: 'member',
        memberId: 'MEM002',
        position: 'Vice President',
        enrollmentYear: 2025,
        isPastMember: false,
        profileImgUrl: 'https://i.pravatar.cc/150?img=2'
      },
      {
        name: 'Parth Magar',
        email: 'parthmagar848@gmail.com',
        password: 'Parth@123',
        role: 'member',
        memberId: 'MEM003',
        position: 'Technical Lead',
        enrollmentYear: 2025,
        isPastMember: false,
        profileImgUrl: 'https://i.pravatar.cc/150?img=3'
      },
      {
        name: 'Sneha Bhingare',
        email: 'sneha9011@gmail.com',
        password: 'Jane@123',
        role: 'member',
        memberId: 'MEM004',
        position: 'Design Lead',
        enrollmentYear: 2025,
        isPastMember: false,
        profileImgUrl: 'https://i.pravatar.cc/150?img=4'
      },
      {
        name: 'Supriya Shinde',
        email: 'supriya@example.com',
        password: 'Mike@123',
        role: 'member',
        memberId: 'MEM005',
        position: 'Event Coordinator',
        enrollmentYear: 2025,
        isPastMember: false,
        profileImgUrl: 'https://i.pravatar.cc/150?img=5'
      },
      {
        name: 'Onkar Shinde',
        email: 'onkar@example.com',
        password: 'Onkar@123',
        role: 'member',
        memberId: 'MEM006',
        position: 'Media Manager',
        enrollmentYear: 2025,
        isPastMember: false,
        profileImgUrl: 'https://i.pravatar.cc/150?img=6'
      }
    ];

    // Insert all users
    for (const userData of dummyUsers) {
      const user = new User(userData);
      await user.save(); // triggers pre('save') for password hashing
    }

    console.log("🎉 Dummy users inserted successfully!");
    process.exit();
  })
  .catch(err => console.error("❌ Error connecting or inserting users:", err));
