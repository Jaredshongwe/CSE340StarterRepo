const pool = require("../database/")


/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classification_name) {
    try {
        const getMaxIdQuery = "SELECT MAX(classification_id) AS max_id FROM classification";
        const maxIdResult = await pool.query(getMaxIdQuery);

        let nextId;
        if (maxIdResult.rows.length > 0) {
            nextId = maxIdResult.rows[0].max_id + 1;
        } else {
            nextId = 1; // If no existing records, start from 1
        }

        const alterSequenceQuery = `ALTER SEQUENCE classification_classification_id_seq RESTART WITH ${nextId}`;
        await pool.query(alterSequenceQuery);

        const insertQuery = "INSERT INTO classification (classification_id, classification_name) VALUES ($1, $2) RETURNING *";
        return await pool.query(insertQuery, [nextId, classification_name]);

    } catch (error) {
        return error.message
    }
}

/* *****************************
*   Add new inventory
* *************************** */
async function addInventory(classification_name, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const getMaxIdQuery = "SELECT MAX(inv_id) AS max_id FROM inventory";
        const maxIdResult = await pool.query(getMaxIdQuery);

        let nextId;
        if (maxIdResult.rows.length > 0) {
            nextId = maxIdResult.rows[0].max_id + 1;
        } else {
            nextId = 1;
        }

        const alterSequenceQuery = `ALTER SEQUENCE inventory_inv_id_seq RESTART WITH ${nextId}`;
        await pool.query(alterSequenceQuery);
        const classification_id = parseInt(classification_name);

        const insertQuery = `INSERT INTO inventory ( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        return await pool.query(insertQuery, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);

    } catch (error) {
        console.log(error);
        return error.message
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ****************************************
*  Delete Inventory Item
* *************************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        new Error("Delete Inventory Error")
    }

}


module.exports = { addClassification, addInventory, updateInventory, deleteInventoryItem };