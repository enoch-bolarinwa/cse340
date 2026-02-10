// Example in routes/inventoryRoute.js
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Public routes (no authentication needed)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Protected routes - require Employee or Admin access
router.get("/", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildManagement)
);

router.get("/add-classification", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get("/edit/:inv_id", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

router.get("/delete/:inv_id", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteConfirm)
);

router.post("/delete", 
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;