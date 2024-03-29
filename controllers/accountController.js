const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "message",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const { account_name } = accountData;
            const account_firstname = accountData.account_firstname;
            const account_type = accountData.account_type;
            const accessToken = jwt.sign({ account_email, account_firstname, account_name, account_type }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }

    } catch (error) {
        return new Error('Access Forbidden')
    }
}


/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav();

    // Retrieve account name from the JWT token
    const accessToken = req.cookies.jwt;
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const account_firstname = decodedToken.account_firstname;
    const account_type = decodedToken.account_type;

    // Pass the username to the header partial
    res.locals.account_username = account_firstname;

    // Render the management view with the account name
    res.status(200).render("account/management", {
        title: "Account Management",
        welcome: `Welcome ${account_firstname}`,
        account_type: account_type,
        nav,
    });
}

/* ****************************************
*  Logout Function
* *************************************** */
const logout = (req, res) => {
    // Clear session or cookie indicating that the client is logged out
    res.clearCookie("jwt");
    // Redirect to the homepage or any other desired location
    res.redirect("/");
};


/* ***************************
 *  Build edit account view
 * ************************** */
async function buildEditView(req, res, next) {

    // Retrieve email from the JWT token
    const accessToken = req.cookies.jwt;
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const account_email = decodedToken.account_email;

    let nav = await utilities.getNav()

    const accountData = await accountModel.getAccountByEmail(account_email)

    res.render("account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
    })
}

/* ****************************************
*  Process Update
* *************************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body

    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    const accessToken = req.cookies.jwt;
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const account_type = decodedToken.account_type;

    if (updateResult) {
        req.flash(
            "message",
            `Congratulations, Your account has been updated.`
        )
        res.status(201).render("account/management", {
            title: "Account Management",
            welcome: `Welcome ${account_firstname}`,
            account_type: account_type,
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/management", {
            title: "Account Management",
            welcome: `Welcome ${account_firstname}`,
            account_type: account_type,
            nav,
        })
    }
}

/* ****************************************
*  Process Change password
* *************************************** */
async function changePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body

    // Retrieve account name from the JWT token
    const accessToken = req.cookies.jwt;
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const account_firstname = decodedToken.account_firstname;
    const account_type = decodedToken.account_type;

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing password change.')
        res.status(500).render("account/register", {
            title: "Account Management",
            welcome: `Welcome ${account_firstname}`,
            account_type: account_type,
            nav,
        })
    }

    const updateResult = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )

    if (updateResult) {
        req.flash(
            "message",
            `Password successfully changed.`
        )
        res.status(201).render("account/management", {
            title: "Account Management",
            welcome: `Welcome ${account_firstname}`,
            account_type: account_type,
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the password update failed.")
        res.status(501).render("account/management", {
            title: "Account Management",
            welcome: `Welcome ${account_firstname}`,
            account_type: account_type,
            nav,
        })
    }
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, logout, buildEditView, updateAccount, changePassword }