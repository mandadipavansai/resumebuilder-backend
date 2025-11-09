const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Configure dotenv at the very top
dotenv.config();

// Now, import your other files
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const authRouter = require('./routes/authroutes');
const resumeRoutes = require('./routes/resumeroutes');
const aiRoutes = require('./routes/ai-routes');

const app = express();

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/resume', resumeRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});