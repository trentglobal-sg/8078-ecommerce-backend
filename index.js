const express = require('express');
const cors = require('cors');
require('dotenv').config();

// import the database pool
const pool = require('./database');

const app = express();



// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// import in the routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');

// register the routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});