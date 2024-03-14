// manController.js

const utilities = require("../utilities");
const managementModel = require("../models/management-model");
const inventoryModel = require("../models/inventory-model");

/* ****************************************
 * Deliver Management view
 * *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
        classificationSelect,
    });
}

/* ****************************************
 * Deliver Classification view
 * *************************************** */
async function buildClassification(req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: 'Add New Classification',
        nav,
        errors: null,
    });
}


/* ****************************************
*  Process Classification
* *************************************** */
async function registerClassification(req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const regResult = await managementModel.addClassification(
        classification_name
    )

    if (regResult) {
        req.flash(
            "notice",
            `The ${classification_name} Classification added Successfully`
        )
        nav = await utilities.getNav()
        res.status(201).render("inventory/management", {
            title: 'Vehicle Management',
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the adding classification failed.")
        res.status(501).render("inventory/management", {
            title: 'Vehicle Management',
            nav,
        })
    }
}


/* ****************************************
 * Deliver Add Inventory view
 * *************************************** */
async function buildAddInventory(req, res, next) {
    const classifications = await inventoryModel.getClassifications();
    let nav = await utilities.getNav();

    res.render("inventory/add-inventory", {
        title: 'Add New Inventory',
        nav,
        classifications: classifications.rows,
        errors: null,
    });
}

/* ****************************************
*  Process Add Inventory
* *************************************** */
async function addInventory(req, res) {
    let nav = await utilities.getNav();
    const { classification_name, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;

    // Call model function to add inventory item to database
    const regResult = await managementModel.addInventory(
        classification_name,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
    );

    if (regResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} Was added Successfully`
        )
        nav = await utilities.getNav()
        res.status(201).render("inventory/management", {
            title: 'Vehicle Management',
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the adding classification failed.")
        res.status(501).render("inventory/management", {
            title: 'Vehicle Management',
            nav,
        })
    }
}

module.exports = { buildManagement, buildClassification, registerClassification, buildAddInventory, addInventory };
