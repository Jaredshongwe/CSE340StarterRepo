// Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const regValidate = require('../utilities/management-validation');
const invValidate = require('../utilities/inventory-validation');
const utilities = require("../utilities/");

// Route to inventory management
router.get("/", regValidate.checkAccountType);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build specific inventory item detail view
router.get("/detail/:invId", invController.buildInventoryItemDetail);

// Route to handle inventory item modification
router.get("/edit/:invId", invController.editInventoryView);

// Route for inventory table
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Process the add inventory form submission
router.post("/update/",
    regValidate.updateRule(),
    regValidate.checkUpdate,
    utilities.handleErrors(invController.updateInventory));

// Route to build specific confirm delete view
router.get("/delete/:invId", utilities.handleErrors(invController.deleteView));

// Process delete item
router.post("/delete", utilities.handleErrors(invController.deleteItem));

// Route to build specific review view
router.get("/review/:invId", utilities.checkLogin, utilities.handleErrors(invController.reviewView));

// Process the add inventory form submission
router.post("/review/",
    utilities.checkLogin,
    invValidate.reviewRule(),
    invValidate.checkReview,
    utilities.handleErrors(invController.addReview));

module.exports = router;
