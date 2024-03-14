const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model");

/*  **********************************
 *  Classification Validation Rules
 * ********************************* */
validate.classificationRule = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Classification name must contain only alphabetic characters."), // on error this message is sent.
    ]
}

validate.checkClassification = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty() == true) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
};


/*  **********************************
 *  Inventory Validation Rules
 * ********************************* */
validate.inventoryRule = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Make is required."),

        body("inv_model")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Model is required."),

        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Description is required."),

        body("inv_price")
            .trim()
            .isNumeric({ min: 0 })
            .withMessage("Please provide a valid price."),

        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() })
            .withMessage("Please provide a valid year."),

        body("inv_miles")
            .trim()
            .isNumeric({ min: 0 })
            .withMessage("Please provide valid mileage."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Color is required.")
    ];
};

validate.checkInventory = async (req, res, next) => {
    let errors = [];
    const classifications = await inventoryModel.getClassifications();
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body;
        const classification_name = req.body.classification_name;
        res.render("inventory/add-inventory", {
            title: "Add New Inventory",
            nav,
            errors,
            classifications: classifications.rows.map(classification => ({
                ...classification,
                selected: classification.classification_id === classification_name
            })),
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        });
        return;
    }
    next();
};



module.exports = validate 