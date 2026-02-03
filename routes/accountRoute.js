const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// GET routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// POST route with validation
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt (TEMPORARY)
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;