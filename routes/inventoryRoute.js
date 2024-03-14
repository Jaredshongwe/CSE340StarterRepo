// Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const regValidate = require('../utilities/management-validation');
const utilities = require("../utilities/");

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


module.exports = router;
