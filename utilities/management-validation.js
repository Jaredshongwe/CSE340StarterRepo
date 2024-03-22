const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");

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

/* ******************************
* Check data and return errors or continue to update
* ***************************** */
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

/*  **********************************
 *  Inventory Validation Rules
 * ********************************* */
validate.updateRule = () => {
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
            .withMessage("Color is required."),

        body("inv_id")
            .trim()
            .isNumeric({ min: 0 })
    ];
};

/* ******************************
* Check data and return errors or continue to update
* ***************************** */
validate.checkUpdate = async (req, res, next) => {
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav();
        const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, inv_id } = req.body;
        const itemName = `${inv_make} ${inv_model}`
        const classificationSelect = await utilities.buildClassificationList(classification_id)

        res.render("inventory/edit-inventory", {
            title: `Edit ${itemName}`,
            nav,
            errors,
            classificationSelect,
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
        });
        return;
    }
    next();
};


/* ******************************
* Check Account type and return errors or continue to inventory management
* ***************************** */
validate.checkAccountType = (req, res, next) => {
    // get JWT token from request cookies
    const accessToken = req.cookies.jwt;

    if (accessToken) {
        try {
            // decode JWT token to get account type
            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const accountType = decodedToken.account_type;

            // check if account type is "Employee" or "Admin"
            if (accountType === "Employee" || accountType === "Admin") {
                // allow access to the next middleware/route handler
                return next();
            } else {
                // send message and render login view
                req.flash("error", "Unauthorized access. Please log in as an Employee or Admin.");
                return res.redirect("/account/login");
            }
        } catch (error) {
            // handle token verification errors
            console.error(error);
            req.flash("error", "Token verification failed. Please log in.");
            return res.redirect("/account/login");
        }
    } else {
        // if no token found, redirect to login view
        req.flash("error", "Unauthorized access. Please log in.");
        return res.redirect("/account/login");
    }
};


module.exports = validate 