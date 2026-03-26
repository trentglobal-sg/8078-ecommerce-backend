const pool = require('../database');

async function getOrdersByUserId(userId) {
    const [rows] = await pool.execute(`SELECT * FROM orders WHERE user_id = ?`, [userId]);
    return rows;
}

/**
 * 
 * @param {*} userId The ID of the user
 * @param {*} orderItems An array of order items, with the key product_id and quantity
 */
async function createOrder(userId, orderItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let total =0;
        for (let item of orderItems) {
            total = total + item.price;
        }

        // create the row in the orders table
        const sql = `INSERT INTO orders (user_id, total) VALUES (?, ?)`;
        const [orderResult] = await connection.execute(sql, [userId, total]);
        const orderId = orderResult.insertId;

        // for each item in the shopping cart
        // create one order_item row
        for (let item of orderItems) {
            await connection.execute(`
                INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
            [orderId, item.product_id, item.quantity ]);
        }
        await connection.commit();
        return orderId;
    } catch (e) {
        await connection.rollback();
        console.error(e);
        throw e;
    } finally {
        await connection.release();
    }
}

async function getOrderDetails(orderId) {
    const sql = `
        SELECT 
            order_items.product_id,
            products.name,
            products.price
            order_items.quantity
            products.imageUrl 
          FROM order_items
        JOIN products
          ON order_items.product_id = products.id
        JOIN orders
          ON order_items.order_id = orders.id
        WHERE orders.user_id = ?
    `
    const [rows] = await connection.execute(sql, [orderId]);
    return rows;
}

async function updateOrderStatus(orderId, status) {
    if (! ['pending', 'completed', 'cancelled', 'shipping', 'processing'].includes(status)) {
        throw new Error("Invalid status");
    }
    await pool.execute(`UPDATE orders SET status= ? WHERE id =?`, [status, orderId]);
}
/**
 * 
 * @param {*} orderId 
 * @param {*} sessionId id of the checkout session that is created by Stripe
 */
async function updateOrderSessionId(orderId, sessionId) {
    await pool.execute(`UPDATE orders SET checkout_session_id = ? WHERE id = ?`, [sessionId, orderId]);
}

module.exports = {
    getOrderDetails,
    getOrdersByUserId,
    updateOrderSessionId,
    updateOrderStatus,
    createOrder
}