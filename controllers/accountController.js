const bcrypt = require("bcryptjs");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const activityModel = require("../models/activity-model");
const jwt = require("jsonwebtoken");  
require("dotenv").config();           

/* ........................................
*  Deliver login view
* ..................................... */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,        
    account_email: "",   
  });
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;  // ← IMPORTANT: Stop here
  }
  
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      
      return res.redirect("/account/");  // ← REDIRECT TO ACCOUNT MANAGEMENT
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

/* ****************************************
 *  Build account management view
 * ************************************ */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ........................................
*  Deliver registration view
* ..................................... */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}

/* ........................................
*  Process registration
* ..................................... */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();

  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;  
  }

  // Store the new account with the hashed password
  try {
    const regResult = await accountModel.accountRegister(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      res.redirect("/account/login");  
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.");
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
 *  Deliver account update view
 * **************************************** */
async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData
  })
}

/* ****************************************
 *  Process account update
 * **************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname, 
    account_email,
    account_id
  )
  
  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.locals.accountData = accountData
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body
    })
  }
}

/* ****************************************
 *  Process password update
 * **************************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  // Hash the new password
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password.")
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: await accountModel.getAccountById(account_id)
    })
  }
  
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
  
  if (updateResult) {
    req.flash("notice", "Password changed successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: await accountModel.getAccountById(account_id)
    })
  }
}

/* ****************************************
 *  Process logout
 * **************************************** */
async function logout(req, res, next) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

// Add these to your accountController.js

async function buildUpdateView(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData
  })
}

async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname, 
    account_email,
    account_id
  )
  
  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body
    })
  }
}

async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password.")
    const accountData = await accountModel.getAccountById(account_id)
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData
    })
  }
  
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
  
  if (updateResult) {
    req.flash("notice", "Password changed successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    const accountData = await accountModel.getAccountById(account_id)
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData
    })
  }
}

/* ****************************************
 *  Deliver account update view
 * **************************************** */
async function buildUpdateView(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = parseInt(req.params.account_id);
    
    if (res.locals.accountData.account_id !== account_id) {
      req.flash("notice", "You can only edit your own account.");
      return res.redirect("/account/");
    }
    
    const accountData = await accountModel.getAccountById(account_id);
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData
    });
  } catch (error) {
    console.error("buildUpdateView error:", error);
    req.flash("notice", "Error loading update page.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Process account update
 * **************************************** */
async function updateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    const accountId = parseInt(account_id);
    
    if (res.locals.accountData.account_id !== accountId) {
      req.flash("notice", "Unauthorized access.");
      return res.redirect("/account/");
    }
    
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      accountId
    );
    
    if (updateResult) {
      await activityModel.logActivity(
        accountId,
        "account_update",
        "Account information updated",
        req.ip
      );
      
      req.flash("notice", "Account updated successfully.");
      const accountData = await accountModel.getAccountById(accountId);
      res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData
      });
    } else {
      req.flash("notice", "Account update failed.");
      res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData: req.body
      });
    }
  } catch (error) {
    console.error("updateAccount error:", error);
    req.flash("notice", "Error updating account.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Process password update
 * **************************************** */
async function updatePassword(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_password, account_id } = req.body;
    const accountId = parseInt(account_id);
    
    if (res.locals.accountData.account_id !== accountId) {
      req.flash("notice", "Unauthorized access.");
      return res.redirect("/account/");
    }
    
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("notice", "Password hashing failed.");
      const accountData = await accountModel.getAccountById(accountId);
      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData
      });
    }
    
    const updateResult = await accountModel.updatePassword(hashedPassword, accountId);
    
    if (updateResult) {
      await activityModel.logActivity(
        accountId,
        "password_change",
        "Password changed successfully",
        req.ip
      );
      
      req.flash("notice", "Password changed successfully.");
      const accountData = await accountModel.getAccountById(accountId);
      res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData
      });
    } else {
      req.flash("notice", "Password change failed.");
      const accountData = await accountModel.getAccountById(accountId);
      res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData
      });
    }
  } catch (error) {
    console.error("updatePassword error:", error);
    req.flash("notice", "Error changing password.");
    res.redirect("/account/");
  }
}

/* ****************************************
 *  Process logout
 * **************************************** */
async function logout(req, res, next) {
  try {
    if (res.locals.loggedin && res.locals.accountData) {
      await activityModel.logActivity(
        res.locals.accountData.account_id,
        "logout",
        "User logged out",
        req.ip
      );
    }
    
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out.");
    return res.redirect("/");
  } catch (error) {
    console.error("logout error:", error);
    res.clearCookie("jwt");
    return res.redirect("/");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateView,    
  updateAccount,      
  updatePassword,     
  logout
};

