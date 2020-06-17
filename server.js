const express = require('express');
const connectDB = require('./config/database');

const app = express();

//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
