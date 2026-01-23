const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryItemById(inv_id);
    
    if (!data) {
      const error = new Error("Vehicle not found");
      error.status = 404;
      throw error;
    }
    
    const grid = await utilities.buildVehicleDetailHTML(data);
    let nav = await utilities.getNav();
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

invCont.triggerError = async function (req, res, next) {
  const error = new Error("Intentional 500 error for testing");
  error.status = 500;
  throw error;
};

module.exports = invCont;

