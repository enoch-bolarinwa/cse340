const invModel = require("../models/inventory-model");

const Util = {};


Util.getNav = async function (req, res, next) {

console.log(data)

  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};


Util.buildClassificationGrid = async function(data){
  let grid = "";
  if(data.length > 0){
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += '<li>';
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`;
      grid += '</a>';
      grid += '<div class="namePrice">';
      grid += '<hr>';
      grid += '<h2>';
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `${vehicle.inv_make} ${vehicle.inv_model}`;
      grid += '</a>';
      grid += '</h2>';
      grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`;
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
* Build the vehicle detail HTML
* ************************************ */
Util.buildVehicleDetailHTML = async function(vehicle) {
  let detailHTML = '<div class="vehicle-detail-container">';
  
  // Image section
  detailHTML += '<div class="vehicle-image">';
  detailHTML += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`;
  detailHTML += '</div>';
  
  // Details section
  detailHTML += '<div class="vehicle-info">';
  detailHTML += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`;
  
  // Price - formatted with commas and dollar sign
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(vehicle.inv_price);
  detailHTML += `<p class="vehicle-price"><strong>Price:</strong> ${formattedPrice}</p>`;
  
  // Description
  detailHTML += `<p class="vehicle-description"><strong>Description:</strong> ${vehicle.inv_description}</p>`;
  
  // Color
  detailHTML += `<p class="vehicle-color"><strong>Color:</strong> ${vehicle.inv_color}</p>`;
  
  // Mileage - formatted with commas
  const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);
  detailHTML += `<p class="vehicle-mileage"><strong>Mileage:</strong> ${formattedMileage} miles</p>`;
  
  detailHTML += '</div>'; // Close vehicle-info
  detailHTML += '</div>'; // Close container
  
  return detailHTML;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;