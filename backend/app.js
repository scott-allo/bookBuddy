const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');
const rewardsRoutes = require('./routes/rewards.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
