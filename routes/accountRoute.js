const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// GET routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));  

// POST route with validation
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request - UPDATE THIS
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;