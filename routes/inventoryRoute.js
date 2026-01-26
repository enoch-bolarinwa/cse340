// Example in routes/inventoryRoute.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Wrap each route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;

