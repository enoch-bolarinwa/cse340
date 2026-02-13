const express = require("express");
const router = new express.Router();
const profileController = require("../controllers/profileController");
const utilities = require("../utilities/");
const profileValidate = require("../utilities/profile-validation");

// View profile
router.get("/view/:account_id",
  utilities.checkLogin,
  utilities.validateId('account_id'),
  utilities.handleErrors(profileController.buildProfileView)
);

// Edit profile
router.get("/edit/:account_id",
  utilities.checkLogin,
  utilities.validateId('account_id'),
  utilities.handleErrors(profileController.buildEditProfileView)
);

// Process profile update
router.post("/update",
  utilities.checkLogin,
  profileValidate.profileRules(),
  profileValidate.checkProfileData,
  utilities.handleErrors(profileController.updateProfile)
);

// Preferences view
router.get("/preferences",
  utilities.checkLogin,
  utilities.handleErrors(profileController.buildPreferencesView)
);

// Process preferences
router.post("/preferences",
  utilities.checkLogin,
  profileValidate.preferencesRules(),
  profileValidate.checkPreferencesData,
  utilities.handleErrors(profileController.updatePreferences)
);

// Activity log (Admin only)
router.get("/activity-log",
  utilities.checkAdminOnly,
  utilities.handleErrors(profileController.buildActivityLogView)
);

module.exports = router;