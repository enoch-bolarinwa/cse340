
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const profileRoute = require("./routes/profileRoute");
const utilities = require("./utilities/");
const errorHandler = require("./middleware/errorHandler");
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 * ************************/
// Body parser middleware - MUST COME EARLY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Session middleware
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// JWT check middleware
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes 
app.use("/account", accountRoute);

// Profile routes
app.use("/profile", profileRoute);

// File Not Found Route - Must be last
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ 
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})