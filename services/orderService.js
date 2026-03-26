const orderData = require('../data/orderData');

async function getOrdersByUserId(userId) {
    // if we store the price of the product
    // in the shopping cart, then we
    // should check if the prices have changed
    //
    // or detect orders that have been cancelled
    return await orderData.getOrdersByUserId(userId);
}

async function createOrder(userId, orderItems) {
    // sample business logic:
    // check if the inventory still has stock
    return await orderData.createOrder(userId, orderItems);
}

async function updateOrderSessionId(orderId, sessionId) {
    // todo: audit log
    return await orderData.updateOrderSessionId(orderId, sessionId);
}

async function getOrderDetails(orderId) {
    return await orderData.getOrderDetails(orderId);
}

async function updateOrderStatus(orderId, status) {
    // sample business logic
    // if status change to "cancelled": maybe send an email to the user
    // if status change to "shipping": send the shipment info to the user
    return await orderData.updateOrderStatus(orderId, status);
}

module.exports = {
    getOrderDetails,
    getOrdersByUserId,
    updateOrderSessionId,
    updateOrderStatus,
    createOrder
}