const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const placesRouter=require('./routes/places');
const bookingRouter = require('./routes/booking');
const cors = require('cors'); // Import the cors package
const app = express(); // Define app here
require('dotenv').config();
// console.log(process.env.DB);

const PORT = process.env.PORT ;
const DB = process.env.DB;
const FRONTEND_URL = "http://localhost:3000";
// Use the cors middleware
app.use(cors({ // Update with your frontend URL
  origin: FRONTEND_URL,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api', authRouter);
app.use('/api',placesRouter);
app.use('/api', bookingRouter);


// MongoDB Connection
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true// Added to handle deprecation warning
})
.then(() => {
  console.log('MongoDB connected');
  // Start server after successful DB connection
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('DB connection failed:', err);
});
