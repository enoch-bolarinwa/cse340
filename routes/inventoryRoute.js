// Example in routes/inventoryRoute.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Wrap each route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

router.get("/trigger-error", utilities.handleErrors(invController.triggerError));
// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));
// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to process add classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Existing routes...

// Route to build delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirm));

// Route to process deletion
router.post("/delete", utilities.handleErrors(invController.deleteInventory));

// routes/inventoryRoute.js
router.get("/add-classification", 
  utilities.checkAccountType,  // Only Employee/Admin
  inventoryController.buildAddClassification
)

router.get("/add-inventory", 
  utilities.checkAccountType,
  inventoryController.buildAddInventory
)

router.get("/edit/:inv_id", 
  utilities.checkAccountType,
  inventoryController.buildEditInventory
)

router.get("/delete/:inv_id", 
  utilities.checkAccountType,
  inventoryController.buildDeleteInventory
)

module.exports = router;

