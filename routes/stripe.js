const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const orderService = require('../services/orderService');

// Webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        console.log('Checkout session completed!', session);
        if (session.metadata && session.metadata.orderId) {
            await orderService.updateOrderStatus(session.metadata.orderId, 'processing');
        }
    }

    res.status(200).json({ received: true });
});

module.exports = router;