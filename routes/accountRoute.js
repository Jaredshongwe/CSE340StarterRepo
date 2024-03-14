// Resources
const regValidate = require('../utilities/account-validation')
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
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// "GET" route for the "My Account" link
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

module.exports = router;
