const mongoose = require('mongoose');
const Event = require('./models/Event'); // ✅ Adjust path if needed

const MONGO_URI = 'mongodb+srv://parthmagar789:7798439657@cluster0.rdthoa2.mongodb.net/ACMDatabase?retryWrites=true&w=majority';

// 🌱 Dummy event data
const events = [
  // 🔹 Upcoming Events
  {
    title: "TechFusion 2025",
    description: "A national-level tech symposium featuring coding, robotics, and AI challenges.",
    date: "2025-11-15",
    time: "10:00 AM",
    venue: "DYPCOE Auditorium",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000001/techfusion_poster.jpg",
    photos: ["https://res.cloudinary.com/demo/image/upload/v1730000002/techfusion1.jpg"],
    createdBy: "admin",
  },
  {
    title: "ACM Hackathon 2.0",
    description: "A 24-hour hackathon organized by ACM DYPCOE to solve real-world problems.",
    date: "2025-12-02",
    time: "9:00 AM",
    venue: "Computer Department Lab 301",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000100/hackathon_poster.jpg",
    photos: [],
    createdBy: "acm_admin",
  },
  {
    title: "Machine Learning Workshop",
    description: "Hands-on workshop on supervised and unsupervised learning models using Python.",
    date: "2025-11-10",
    time: "2:00 PM",
    venue: "IT Seminar Hall",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000200/ml_workshop.jpg",
    photos: [],
    createdBy: "faculty_member",
  },
  {
    title: "Cybersecurity Awareness Week",
    description: "A week-long event focusing on ethical hacking, phishing awareness, and data security.",
    date: "2025-12-18",
    time: "11:30 AM",
    venue: "Hall A, Main Building",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000300/cybersecurity_week.jpg",
    photos: [],
    createdBy: "student_council",
  },
  {
    title: "Tech Carnival",
    description: "An exhibition showcasing student projects in AI, IoT, and AR/VR.",
    date: "2025-11-25",
    time: "10:00 AM",
    venue: "Quadrangle Area",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000400/tech_carnival.jpg",
    photos: [],
    createdBy: "acm_team",
  },
  {
    title: "Women in Tech Meetup",
    description: "A networking and mentorship session for women pursuing careers in technology.",
    date: "2025-12-05",
    time: "3:00 PM",
    venue: "CSE Seminar Hall",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000500/women_in_tech.jpg",
    photos: [],
    createdBy: "event_admin",
  },
  {
    title: "Cloud Computing Bootcamp",
    description: "Two-day bootcamp covering AWS, GCP, and Azure fundamentals.",
    date: "2025-11-20",
    time: "9:00 AM",
    venue: "Lab 402",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000600/cloud_bootcamp.jpg",
    photos: [],
    createdBy: "tech_club",
  },
  {
    title: "Annual ACM Meet 2025",
    description: "Celebrating another successful year of ACM DYPCOE with awards and highlights.",
    date: "2025-12-28",
    time: "5:00 PM",
    venue: "Main Auditorium",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000700/acm_meet.jpg",
    photos: [],
    createdBy: "acm_dypcoe",
  },
  {
    title: "AI Art Exhibition",
    description: "An art show powered by generative AI models created by students.",
    date: "2025-11-30",
    time: "4:00 PM",
    venue: "Innovation Center",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000800/ai_art_exhibition.jpg",
    photos: [],
    createdBy: "innovation_team",
  },
  {
    title: "Open Source Contribution Drive",
    description: "A session to guide students through contributing to open source projects on GitHub.",
    date: "2025-11-12",
    time: "11:00 AM",
    venue: "Lab 305",
    poster: "https://res.cloudinary.com/demo/image/upload/v1730000900/open_source_drive.jpg",
    photos: [],
    createdBy: "open_source_club",
  },

  // 🔹 Past Events
  {
    title: "Web Dev Crash Course",
    description: "A three-day bootcamp on building modern websites using React and Node.js.",
    date: "2025-08-25",
    time: "9:30 AM",
    venue: "Computer Dept. Lab 201",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000000/webdev_course.jpg",
    photos: [],
    createdBy: "acm_admin",
  },
  {
    title: "Orientation 2025",
    description: "Welcome event for first-year students introducing them to ACM and tech clubs.",
    date: "2025-07-10",
    time: "10:00 AM",
    venue: "Main Hall",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000100/orientation.jpg",
    photos: [],
    createdBy: "faculty_admin",
  },
  {
    title: "Data Structures Contest",
    description: "Coding competition testing knowledge of arrays, stacks, and linked lists.",
    date: "2025-09-15",
    time: "11:00 AM",
    venue: "Lab 304",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000200/dsa_contest.jpg",
    photos: [],
    createdBy: "acm_team",
  },
  {
    title: "Mini Project Expo",
    description: "Showcase of 2nd-year students’ projects on real-world problem statements.",
    date: "2025-08-05",
    time: "1:00 PM",
    venue: "CSE Department",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000300/project_expo.jpg",
    photos: [],
    createdBy: "event_coordinator",
  },
  {
    title: "Git & GitHub Workshop",
    description: "Hands-on workshop teaching version control basics and collaborative coding.",
    date: "2025-09-10",
    time: "3:00 PM",
    venue: "Lab 102",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000400/github_workshop.jpg",
    photos: [],
    createdBy: "open_source_club",
  },
  {
    title: "AI Quiz Mania",
    description: "Quiz competition on artificial intelligence and machine learning concepts.",
    date: "2025-06-25",
    time: "12:00 PM",
    venue: "Lecture Hall 5",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000500/ai_quiz.jpg",
    photos: [],
    createdBy: "quiz_committee",
  },
  {
    title: "Python for Beginners",
    description: "Introductory session on Python programming and its applications.",
    date: "2025-05-20",
    time: "10:30 AM",
    venue: "Lab 108",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000600/python_beginners.jpg",
    photos: [],
    createdBy: "faculty_trainer",
  },
  {
    title: "Career Guidance Seminar",
    description: "Industry experts discussing software career paths and interview preparation.",
    date: "2025-07-30",
    time: "2:00 PM",
    venue: "Main Auditorium",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000700/career_guidance.jpg",
    photos: [],
    createdBy: "placement_team",
  },
  {
    title: "TechTalk: Future of AI",
    description: "Guest lecture by an AI researcher on the evolution of artificial intelligence.",
    date: "2025-08-18",
    time: "4:00 PM",
    venue: "Seminar Hall B",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000800/ai_future.jpg",
    photos: [],
    createdBy: "tech_club",
  },
  {
    title: "CodeSprint 2025",
    description: "A 3-hour coding sprint focused on problem-solving and speed coding.",
    date: "2025-09-05",
    time: "9:00 AM",
    venue: "Online (HackerRank)",
    poster: "https://res.cloudinary.com/demo/image/upload/v1729000900/codesprint.jpg",
    photos: [],
    createdBy: "acm_dypcoe",
  }
];

// 🌱 Seed Function
async function seedEvents() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');

    await Event.insertMany(events);
    console.log('🌱 Dummy events inserted successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();
