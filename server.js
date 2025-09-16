require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const trainRoutes = require('./routes/trainRoutes');
const hotelRoutes = require('./routes/hotelRoutes');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');

const app = express();
connectDB();

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/train', trainRoutes);
app.use('/api/hotels', hotelRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
