const pool = require('../database');

async function getCartContents(userId) {
    const sql = `
        SELECT cart_items.id, 
               products.name, 
               cart_items.product_id, 
               cart_items.quantity,
               CAST(products.price AS DOUBLE) AS price,
               products.imageUrl,
               products.description
            FROM cart_items JOIN products
            ON cart_items.product_id = products.id
        WHERE user_id = ?
    `
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
}

async function updateCart(userId, cartItems) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. we remove all the cart items belong to the user
        await connection.execute("DELETE FROM cart_items WHERE user_id = ?", [userId]);

        // 2. re-add all the items from cartItems into the database
        // the key/value pair of item is as such:
        // {
        //    product_id: id of the product
        //    quantity: the quantity of the product
        // }
        for (const item of cartItems) {
            await connection.execute(`
                    INSERT INTO cart_items (user_id, product_id, quantity) 
                           VALUES (?, ?, ?)
                `, [userId, item.product_id, item.quantity]);
        }

        await connection.commit();
    } catch (e) {
        await connection.rollback();
        console.error(e);
        throw e;
    } finally {
        connection.release();
    }

}

module.exports = {
    getCartContents, updateCart
}