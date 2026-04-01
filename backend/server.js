require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const auth = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorMiddleware');

connectDB();
const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', auth, require('./routes/bookRoutes'));
app.use('/api/students', auth, require('./routes/studentRoutes'));
app.use('/api/publishers', auth, require('./routes/publisherRoutes'));
app.use('/api/transactions', auth, require('./routes/borrowRoutes'));
app.use('/api/dashboard', auth, require('./routes/dashboardRoutes'));
app.use('/api/reports', auth, require('./routes/reportRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
