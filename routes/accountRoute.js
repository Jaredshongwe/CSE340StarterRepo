const regValidate = require('../utilities/account-validation')

// Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// "GET" route for the "My Account" link
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// "GET" route for the "My Account" link
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
        res.status(200).send('login process')
    }
)

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;
