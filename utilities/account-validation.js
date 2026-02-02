const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");

/* ========================================
 * Registration Validation Rules
 * ======================================= */
const registrationRules = () => {
  return [
    // firstname is required and must be at least 2 characters
    body("account_firstname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters."),

    // lastname is required and must be at least 2 characters
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be at least 12 characters
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters.")
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
      .withMessage("Password must contain at least one uppercase, lowercase, number, and special character."),
  ];
};

/* ========================================
 * Check data and return errors or continue to registration
 * ======================================= */
const checkRegistrationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const utilities = require("../utilities/");
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors: errors.array(),
    });
    return;
  }
  next();
};

module.exports = {
  registrationRules,
  checkRegistrationData,
};