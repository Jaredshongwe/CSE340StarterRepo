const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}


/* ********************************************
 *  Get details for a specific inventory item
 * ******************************************** */
async function getInventoryItemById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inv_id]
        );
        return data.rows[0]; // Return the first (and should be only) item
    } catch (error) {
        console.error("getInventoryItemById error: " + error);
    }
}

/* ********************************************
 *  Get all reviews for a specific inventory item
 * ******************************************** */
async function getReviewsByInventoryId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.reviews WHERE inv_id = $1`,
            [inv_id]
        );
        return data.rows; // Return all reviews for the specified inventory item
    } catch (error) {
        console.error("getReviewsByInventoryId error: " + error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

async function addReview(title, description, rating, inv_id, username) {
    try {
        const insertQuery = `INSERT INTO reviews ( rev_title, rev_description, username, rating, inv_id )
         VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        return await pool.query(insertQuery, [title, description, username, rating, inv_id]);

    } catch (error) {
        console.log(error);
        return error.message
    }
}
module.exports = { getClassifications, getInventoryByClassificationId, getInventoryItemById, getReviewsByInventoryId, addReview };