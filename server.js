const express = require('express');
const connectDB = require('./config/database');

const app = express();

//Connect Database
connectDB();

//Initialize middleware
app.use(express.json({ extended: false }));

// app.get('/', (req, res) => res.send('API running'));

//Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/product', require('./routes/api/product'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
