/* ****************************************
*  Error Handler Middleware
**************************************** */
const errorHandler = (err, req, res, next) => {
  let nav = res.locals.nav || '';
  let message = err.message || 'An unexpected error occurred';
  let status = err.status || 500;
  
  console.error(`Error at: "${req.originalUrl}": ${message}`);
  
  res.status(status).render("errors/error", {
    title: `${status} Error`,
    message,
    nav,
  });
};

module.exports = errorHandler;