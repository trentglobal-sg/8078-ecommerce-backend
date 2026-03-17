const pool = require('../database');

async function getAllProducts() {
    const [rows] = await pool.execute(`SELECT id,
                                              name,
                                              CAST(price AS DOUBLE) AS price,
                                              imageUrl,
                                              description
                                        FROM products`
        );
    return rows;
}

async function getProductById(id) {
    const [rows] = await pool.execute(`
            SELECT * FROM products WHERE id = ?
        `, [id]);
}

module.exports = {
    getAllProducts, getProductById
}