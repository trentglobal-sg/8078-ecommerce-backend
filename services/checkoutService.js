const orderService = require('./orderService');
const stripeService = require('./stripeService');
const cartService = require('./cartService');

async function checkout(userId) {
    // 1. get the cart items from the user's shopping cart
    const orderItems = await cartService.getCartContents(userId);

    // 2. create an order using the user id and the cart items
    // and get the order_id of the new order
    const newOrderId = await orderService.createOrder(userId, orderItems);

    // 3. get a new checkout session from stripe
    const session = await stripeService.createCheckoutSession(userId, orderItems, newOrderId);

    // 4. update the order with the checkout session id
    await orderService.updateOrderSessionId(newOrderId, session.id);

    // 5. todo: delete all items in the shopping cart

    return session;
}

module.exports = {
    checkout
}