const pool = require('../database');

async function getUserByEmail(email) {
    if (!email) {
        throw new Error("Invalid email");
    }
    const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [email]);
    return rows[0];
}

async function getUserById(id) {
    if (!id) {
        throw new Error("Invalid userId");
    }
    const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [id]);
    return rows[0];
}

async function createUser({ name, email, password, salutation, country, marketingPreferences }) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. create the user
        const bindings = [
            name,
            email,
            password,
            salutation,
            country
        ]

        const [userResult] = await connection.execute(
            `INSERT INTO users (name, email, password, salutation, country)
                          VALUES (?, ?, ?, ?, ?)`, bindings
        );

        const userId = userResult.insertId;

        // 2. associate the selected marketing preferences with the newly created user
        for (let marketingPreferenceId of marketingPreferences) {
            await connection.execute(`
                INSERT INTO user_marketing_preferences (user_id, preference_id)
                    VALUES (?,?)    
            `, [userId, marketingPreferenceId])
        }

        await connection.commit();
    } catch (e) {
        await connection.rollback();
        console.log(e);
        throw e;
    } finally {
        await connection.release();
    }

}

async function updateUser(id, { name, email, salutation, country, marketingPreferences }) {
    if (!id || typeof id !== 'number') {
        throw new Error('Invalid user ID');
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Update user data
        await connection.execute(
            `UPDATE users SET name = ?, email = ?, salutation = ?, country = ? WHERE id = ?`,
            [name, email, salutation, country, id]
        );

        // Update marketing preferences by deleting existing ones and inserting new ones
        await connection.execute(`DELETE FROM user_marketing_preferences WHERE user_id = ?`, [id]);
        if (Array.isArray(marketingPreferences)) {
            for (let preferenceId of marketingPreferences) {

                await connection.execute(
                    `INSERT INTO user_marketing_preferences (user_id, preference_id) VALUES (?, ?)`,
                    [id, preferenceId]
                );
            }
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function deleteUser(id) {
    if (!id || typeof id !== 'number') {
        throw new Error('Invalid user ID');
    }
    await pool.execute(`DELETE FROM users WHERE id = ?`, [id]);

}

module.exports = {
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}