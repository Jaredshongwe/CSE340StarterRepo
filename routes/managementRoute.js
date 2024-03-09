// managementRoute.js

const express = require("express");
const router = express.Router();
const manController = require("../controllers/manController");
const regValidate = require('../utilities/management-validation');
const utilities = require("../utilities/");


// Route to deliver management view
router.get("/", utilities.handleErrors(manController.buildManagement));

// Route to deliver management view
router.get("/add-classification", utilities.handleErrors(manController.buildClassification));

// Process the registration data
router.post(
    "/add-classification",
    regValidate.classificationRule(),
    regValidate.checkClassification,
    utilities.handleErrors(manController.registerClassification)
);

// Route to deliver add inventory view
router.get("/add-inventory", utilities.handleErrors(manController.buildAddInventory));

// Process the add inventory form submission
router.post("/add-inventory",
    regValidate.inventoryRule(),
    regValidate.checkInventory,
    utilities.handleErrors(manController.addInventory));


module.exports = router;
