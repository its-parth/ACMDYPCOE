const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const uploadRoutes = require('./routes/upload');
const cors = require('cors');
const usersRoutes = require('./routes/users');
require('dotenv').config();

// app.use(cors({ origin: 'http://localhost:3000' }));

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', usersRoutes);
// ...after express app created...
// mouting request for cloudinary - step 1
app.use('/api/upload', uploadRoutes);
// ...existing code...
app.get('/', (req, res) => {
  res.send('ACM Club Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));