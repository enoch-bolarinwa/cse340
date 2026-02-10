const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// GET routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));  
router.get("/logout", accountController.logout)
router.get("/account/", 
  utilities.checkLogin,     
  controller.buildView      
)

// POST routes
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegistrationData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Protected route (authentication required)
router.get("/", 
  utilities.checkLogin,              // ← Middleware checks if logged in
  accountController.buildManagement  // ← Only runs if authenticated
)

// Get update view
router.get("/update/:account_id", 
  utilities.checkLogin,
  accountController.buildUpdateView
)

// Process account update
router.post("/update",
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  utilities.checkLogin,
  accountController.updateAccount
)

// Process password change
router.post("/update-password",
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.checkLogin,
  accountController.updatePassword
)

module.exports = router;