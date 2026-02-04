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
    errors: null,        
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

  try {
    const regResult = await accountModel.accountRegister(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", 'Congratulations, your account has been created. Please log in.');
      res.redirect("/account/login");
    } else {
      req.flash("notice", 'Sorry, registration failed. Please try again.');
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
    req.flash("notice", 'Sorry, registration failed. Please try again.');
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

module.exports = { buildLogin, buildRegister, registerAccount };