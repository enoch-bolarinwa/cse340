const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const utilities = require(".");

/* ========================================
 * Registration Validation Rules
 * ======================================= */
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters."),

    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters.")
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
      .withMessage("Password must contain at least one uppercase, lowercase, number, and special character."),
  ];
};

/* ========================================
 * Check registration data
 * ======================================= */
const checkRegistrationData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ========================================
 * Login Validation Rules
 * ======================================= */
const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ];
};

/* ========================================
 * Check login data
 * ======================================= */
const checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    });
    return;
  }
  next();
};

/* ========================================
 * Update Account Validation Rules
 * ======================================= */
const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters."),
    
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),
    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const account = await accountModel.checkExistingEmail(account_email);
        if (account && account.account_id != account_id) {
          throw new Error("Email exists. Please use a different email");
        }
      })
  ];
};

/* ========================================
 * Check update data
 * ======================================= */
const checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.body.account_id);
    res.render("account/update", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      accountData
    });
    return;
  }
  next();
};

/* ========================================
 * Password Validation Rules
 * ======================================= */
const passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ];
};

/* ========================================
 * Check password data
 * ======================================= */
const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(req.body.account_id);
    res.render("account/update", {
      errors: errors.array(),
      title: "Update Account",
      nav,
      accountData
    });
    return;
  }
  next();
};

module.exports = {
  registrationRules,
  checkRegistrationData,
  loginRules,
  checkLoginData,
  updateAccountRules,
  checkUpdateData,
  passwordRules,
  checkPasswordData,
};