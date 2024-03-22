// Resources
const regValidate = require('../utilities/account-validation')
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

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

// "GET" route for the "My Account" link
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Logout Route
router.get("/logout", utilities.handleErrors(accountController.logout));

// Update Account Route
router.get("/update", utilities.handleErrors(accountController.buildEditView));

router.post(
    "/update",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

router.post(
    "/change-password",
    regValidate.passwordRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router;
