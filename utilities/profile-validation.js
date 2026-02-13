const { body, validationResult } = require("express-validator");
const utilities = require(".");

/* ========================================
 * Profile Update Validation Rules
 * ======================================= */
const profileRules = () => {
  return [
    body("bio")
      .trim()
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio must not exceed 500 characters."),

    body("phone")
      .trim()
      .optional()
      .matches(/^[\d\s\-\+\(\)]+$/)
      .withMessage("Please provide a valid phone number.")
      .isLength({ min: 10, max: 20 })
      .withMessage("Phone number must be between 10-20 characters."),

    body("date_of_birth")
      .optional()
      .isDate()
      .withMessage("Please provide a valid date.")
      .custom((value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13 || age > 120) {
          throw new Error("You must be between 13 and 120 years old.");
        }
        return true;
      }),
  ];
};

/* ========================================
 * Check profile data
 * ======================================= */
const checkProfileData = async (req, res, next) => {
  const { bio, phone, date_of_birth } = req.body;
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const profileModel = require("../models/profile-model");
    const profileData = await profileModel.getProfileByAccountId(req.body.account_id);
    
    res.render("profile/edit", {
      errors: errors.array(),
      title: "Edit Profile",
      nav,
      profileData: { ...profileData, bio, phone, date_of_birth }
    });
    return;
  }
  next();
};

/* ========================================
 * Preferences Validation Rules
 * ======================================= */
const preferencesRules = () => {
  return [
    body("theme")
      .trim()
      .isIn(['light', 'dark', 'auto'])
      .withMessage("Invalid theme selection."),

    body("language")
      .trim()
      .isIn(['en', 'es', 'fr', 'de'])
      .withMessage("Invalid language selection."),
  ];
};

/* ========================================
 * Check preferences data
 * ======================================= */
const checkPreferencesData = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const profileModel = require("../models/profile-model");
    const preferences = await profileModel.getPreferencesByAccountId(res.locals.accountData.account_id);
    
    res.render("profile/preferences", {
      errors: errors.array(),
      title: "User Preferences",
      nav,
      preferences
    });
    return;
  }
  next();
};

module.exports = {
  profileRules,
  checkProfileData,
  preferencesRules,
  checkPreferencesData,
};