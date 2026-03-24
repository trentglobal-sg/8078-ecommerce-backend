const cartData = require('../data/cartData');

async function getCartContents(userId) {
    return await cartData.getCartContents(userId)
}

async function updateCart(userId, cartItems) {
    // todo: service layer logic: check inventory stock
    // check if the user has bought too much of a certain products
    await cartData.updateCart(userId, cartItems);
}

module.exports = {
    getCartContents, updateCart
}