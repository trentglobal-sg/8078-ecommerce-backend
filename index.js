const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// import in the routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart')
const checkoutRoutes = require('./routes/checkout');
const stripeRoute = require('./routes/stripe');

// register the routes
app.use("/api/products", [express.json()], productRoutes);
app.use("/api/users", [express.json()], userRoutes);
app.use("/api/cart", [express.json()], cartRoutes);
app.use('/api/checkout', [express.json()], checkoutRoutes);
app.use('/stripe', stripeRoute);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});