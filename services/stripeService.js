// NOTE: Use `2026-02-25.clover`
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-02-25.clover'
});

/**
 * 
 * @param {*} userId 
 * @param {*} orderItems An array of the items that the user is buying. Need `name`, `imageUrl`, `price`, `quantity`, `product_id`
 * @param {*} orderId 
 */
async function createCheckoutSession(userId, orderItems, orderId) {
    const lineItems = await createLineItems(orderItems);
    console.log(lineItems);
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items: lineItems,
        success_url: 'https://www.google.com',
        cancel_url: 'https://www.yahoo.com',
        mode: "payment",
        metadata: {
            userId: userId,
            orderId: orderId
        }
    })
    return session;
}

async function createLineItems(orderItems) {
    const lineItems = [];
    for (let orderItem of orderItems) {
        // create one line item per shopping cart item
        const item = {
            price_data:{
                currency: 'sgd',
                product_data: {
                    name: orderItem.name,
                    images: [orderItem.imageUrl || "https://via.placeholder.com/150"],
                    metadata:{
                        product_id: orderItem.product_id
                    }
                },
                // unit_amount is in cents
                unit_amount: Math.round(orderItem.price * 100)
            },
            quantity: orderItem.quantity
        }
        lineItems.push(item);
    }
    return lineItems;
}

module.exports = {
    createCheckoutSession
}