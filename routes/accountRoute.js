// accountRoute.js

// Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// "GET" route for the "My Account" link
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// "GET" route for the "My Account" link
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;
