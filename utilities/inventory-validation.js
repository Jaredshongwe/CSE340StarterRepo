const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");

/* ********************************
 *  Review Validation Rules
 * ******************************** */
validate.reviewRule = () => {
    return [
        body("title")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Title is required."),

        body("description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Description is required."),

        body("rating")
            .trim()
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5."),
    ];
};

/* ******************************
* Check data and return errors or continue to add review
* ***************************** */
validate.checkReview = async (req, res, next) => {
    const { title, description, rating, inv_id } = req.body;

    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    const itemName = `${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}`

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("inventory/review", {
            title: "Review " + itemName,
            nav,
            errors: errors.array(),
            rev_title: title,
            description,
            rating,
            inv_id,
        });

        return;
    }
    next();
};

module.exports = validate;