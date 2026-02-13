const profileModel = require("../models/profile-model");
const activityModel = require("../models/activity-model");
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

/* ****************************************
 *  Build profile view
 * **************************************** */
async function buildProfileView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = parseInt(req.params.account_id);
    
    // Verify user can access this profile
    if (res.locals.accountData.account_id !== account_id && 
        res.locals.accountData.account_type !== 'Admin') {
      req.flash("notice", "You do not have permission to view this profile.");
      return res.redirect("/account/");
    }
    
    const profileData = await profileModel.getProfileByAccountId(account_id);
    const activityData = await activityModel.getActivityByAccountId(account_id, 10);
    
    res.render("profile/view", {
      title: `${profileData.account_firstname}'s Profile`,
      nav,
      errors: null,
      profileData,
      activityData
    });
  } catch (error) {
    console.error("buildProfileView error:", error);
    req.flash("notice", "Error loading profile.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Build edit profile view
 * **************************************** */
async function buildEditProfileView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = parseInt(req.params.account_id);
    
    // Verify user can edit this profile
    if (res.locals.accountData.account_id !== account_id) {
      req.flash("notice", "You can only edit your own profile.");
      return res.redirect("/account/");
    }
    
    const profileData = await profileModel.getProfileByAccountId(account_id);
    
    res.render("profile/edit", {
      title: "Edit Profile",
      nav,
      errors: null,
      profileData
    });
  } catch (error) {
    console.error("buildEditProfileView error:", error);
    req.flash("notice", "Error loading edit page.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Process profile update
 * **************************************** */
async function updateProfile(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_id, bio, phone, date_of_birth } = req.body;
    const accountId = parseInt(account_id);
    
    // Verify ownership
    if (res.locals.accountData.account_id !== accountId) {
      req.flash("notice", "Unauthorized access.");
      return res.redirect("/account/");
    }
    
    const updateResult = await profileModel.updateProfile(
      accountId,
      bio,
      phone,
      date_of_birth,
      null
    );
    
    if (updateResult) {
      // Log activity
      await activityModel.logActivity(
        accountId,
        "profile_update",
        "Profile information updated",
        req.ip
      );
      
      req.flash("notice", "Profile updated successfully.");
      res.redirect(`/profile/view/${accountId}`);
    } else {
      req.flash("notice", "Profile update failed.");
      const profileData = await profileModel.getProfileByAccountId(accountId);
      res.status(501).render("profile/edit", {
        title: "Edit Profile",
        nav,
        errors: null,
        profileData
      });
    }
  } catch (error) {
    console.error("updateProfile error:", error);
    req.flash("notice", "Error updating profile.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Build preferences view
 * **************************************** */
async function buildPreferencesView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    
    const preferences = await profileModel.getPreferencesByAccountId(account_id);
    
    res.render("profile/preferences", {
      title: "User Preferences",
      nav,
      errors: null,
      preferences
    });
  } catch (error) {
    console.error("buildPreferencesView error:", error);
    req.flash("notice", "Error loading preferences.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Process preferences update
 * **************************************** */
async function updatePreferences(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const { theme, email_notifications, sms_notifications, language } = req.body;
    
    const updateResult = await profileModel.updatePreferences(
      account_id,
      theme,
      email_notifications === 'on',
      sms_notifications === 'on',
      language
    );
    
    if (updateResult) {
      // Log activity
      await activityModel.logActivity(
        account_id,
        "preferences_update",
        "User preferences updated",
        req.ip
      );
      
      req.flash("notice", "Preferences updated successfully.");
      res.redirect("/profile/preferences");
    } else {
      req.flash("notice", "Preferences update failed.");
      const preferences = await profileModel.getPreferencesByAccountId(account_id);
      res.status(501).render("profile/preferences", {
        title: "User Preferences",
        nav,
        errors: null,
        preferences
      });
    }
  } catch (error) {
    console.error("updatePreferences error:", error);
    req.flash("notice", "Error updating preferences.");
    res.redirect("/profile/preferences");
  }
}

/* ****************************************
 *  Build activity log view (Admin only)
 * **************************************** */
async function buildActivityLogView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const activityData = await activityModel.getAllActivity(100);
    
    res.render("profile/activity-log", {
      title: "System Activity Log",
      nav,
      errors: null,
      activityData
    });
  } catch (error) {
    console.error("buildActivityLogView error:", error);
    req.flash("notice", "Error loading activity log.");
    res.redirect("/account/");
  }
}

module.exports = {
  buildProfileView,
  buildEditProfileView,
  updateProfile,
  buildPreferencesView,
  updatePreferences,
  buildActivityLogView
};