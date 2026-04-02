const express = require('express');
const cors = require('cors');
require('dotenv').config();

// import the database pool
const pool = require('./database');

const app = express();



// Middleware
// app.use(express.json()); <-- we cannot use express.json globally because it will mutate the signature for the Stripe webhook payload
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
const stripeRoutes = require('./routes/stripe');

// register the routes
app.use('/stripe', stripeRoutes); // put the webhook first
app.use("/api/products", [express.json()], productRoutes);
app.use("/api/users", [express.json()], userRoutes);
app.use("/api/cart", [express.json()], cartRoutes);
app.use('/api/checkout', [express.json()], checkoutRoutes);



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});