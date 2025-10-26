const mongoose = require('mongoose');
const User = require('./models/User'); // ✅ path to your User model

const MONGO_URI = 'mongodb+srv://parthmagar789:7798439657@cluster0.rdthoa2.mongodb.net/ACMDatabase?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connected to MongoDB");




    // Past members (realistic names)
    const pastMembers = [
      // 2022
      { name: 'Aarav Joshi', email: 'aarav.joshi22@example.com', password: 'Aarav@22', position: 'Member', enrollmentYear: 2022 },
      { name: 'Riya Kapoor', email: 'riya.kapoor22@example.com', password: 'Riya@22', position: 'Member', enrollmentYear: 2022 },
      { name: 'Aditya Mehta', email: 'aditya.mehta22@example.com', password: 'Aditya@22', position: 'Member', enrollmentYear: 2022 },
      { name: 'Isha Rane', email: 'isha.rane22@example.com', password: 'Isha@22', position: 'Member', enrollmentYear: 2022 },
      { name: 'Karan Malhotra', email: 'karan.malhotra22@example.com', password: 'Karan@22', position: 'Member', enrollmentYear: 2022 },

      // 2023
      { name: 'Snehal Patil', email: 'snehal.patil23@example.com', password: 'Snehal@23', position: 'Member', enrollmentYear: 2023 },
      { name: 'Ananya Shah', email: 'ananya.shah23@example.com', password: 'Ananya@23', position: 'Member', enrollmentYear: 2023 },
      { name: 'Dhruv Agarwal', email: 'dhruv.agarwal23@example.com', password: 'Dhruv@23', position: 'Member', enrollmentYear: 2023 },
      { name: 'Mihika Desai', email: 'mihika.desai23@example.com', password: 'Mihika@23', position: 'Member', enrollmentYear: 2023 },
      { name: 'Rohan Verma', email: 'rohan.verma23@example.com', password: 'Rohan@23', position: 'Member', enrollmentYear: 2023 },

      // 2024
      { name: 'Tanishq Goyal', email: 'tanishq.goyal24@example.com', password: 'Tanishq@24', position: 'Member', enrollmentYear: 2024 },
      { name: 'Aishwarya Nair', email: 'aishwarya.nair24@example.com', password: 'Aishwarya@24', position: 'Member', enrollmentYear: 2024 },
      { name: 'Vedant Kulkarni', email: 'vedant.kulkarni24@example.com', password: 'Vedant@24', position: 'Member', enrollmentYear: 2024 },
      { name: 'Prisha Rao', email: 'prisha.rao24@example.com', password: 'Prisha@24', position: 'Member', enrollmentYear: 2024 },
      { name: 'Yash Malhotra', email: 'yash.malhotra24@example.com', password: 'Yash@24', position: 'Member', enrollmentYear: 2024 }
    ];

    // Assign memberId, role, isPastMember, profileImgUrl
    let memberCount = 7; // start after current users
    pastMembers.forEach(user => {
      user.memberId = `MEM${memberCount.toString().padStart(3, '0')}`;
      user.role = 'member';
      user.isPastMember = true;
      user.profileImgUrl = `https://i.pravatar.cc/150?img=${memberCount}`;
    });

    const allUsers = [...pastMembers];

    for (const userData of allUsers) {
      const user = new User(userData);
      await user.save();
    }

    console.log("🎉 Current and past members inserted successfully!");
    process.exit();
  })
  .catch(err => console.error("❌ Error connecting or inserting users:", err));
