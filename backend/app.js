const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');
const rewardsRoutes = require('./routes/rewards.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/rewards', rewardsRoutes);

module.exports = app;
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);
