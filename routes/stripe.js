const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');

const orderService = require('../services/orderService');

const router = express.Router();

// we cannot use express.json for this route because it will alter the request payload
// as it will contain special characters. We muse use express.raw({type:"application/json"})
router.post('/webhook', express.raw({ type: "application/json" }), async (req, res) => {

    let event = null;
    try {
        // extract the signature from the headers (signature is a JWT)
        const sig = req.headers['stripe-signature'];
        // decrypt the body
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (e) {
        console.error("Webhook error:", e);
        return res.status(400).json({
            "error": e.message
        })
    }

    // the stripe event has been constructed successfully
    if (event.type == "checkout.session.completed") {
        const session = event.data.object;
        orderService.updateOrderStatus(session.metadata.orderId, "processing");
        // todo: other business logic
        // 1. create shipping order
        // 2. update stock in inventor
        // 3. send invoice to user's email

    }

    res.json({
        received: true
    })

})

module.exports = router;