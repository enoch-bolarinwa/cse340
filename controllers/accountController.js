const bcrypt = require("bcryptjs");
const utilities = require("../utilities/");
const accountModel = require("../models/account-model");

/* ........................................
*  Deliver login view
* ..................................... */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    account_firstname: "",   
    account_lastname: "",    
    account_email: "",       
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
  });
}

/* ........................................
*  Process registration
* ..................................... */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();

  // Collect incoming data from req.body
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  // Store the new account with the hashed password
  try {                                                    // ← THIS WAS MISSING
    const regResult = await accountModel.accountRegister(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {                                       // ← CHANGED result TO regResult
      req.flash("notice", 'Congratulations, your account has been created. Please log in.');
      res.redirect("/account/login");
    } else {
      req.flash("notice", 'Sorry, registration failed. Please try again.');
      res.redirect("/account/register");
    }
  } catch (error) {                                        // ← NOW catch has a matching try
    req.flash("notice", 'Sorry, registration failed. Please try again.');
    res.redirect("/account/register");
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };