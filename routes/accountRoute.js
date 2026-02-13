const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Public routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));

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

// Protected routes (authentication required)
router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

router.get("/logout", 
  accountController.logout
);

router.get("/update/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
);

router.post("/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

router.post("/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Get update view
router.get("/update/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
);

// Process account update
router.post("/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password change
router.post("/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;