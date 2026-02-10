const pool = require("../database/");

const accountModel = {};

/* ........................................
*  Check if email already exists
* ..................................... */
accountModel.checkExistingEmail = async function (account_email) {
  try {
    const sql = "SELECT account_email FROM public.account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rowCount > 0;  // Returns true if email exists, false if not
  } catch (error) {
    console.error("checkExistingEmail error: " + error);
    throw error;
  }
};

/* ........................................
*  Register new account
* ..................................... */
accountModel.accountRegister = async function (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `INSERT INTO public.account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *`;
    
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    console.error("accountRegister error: " + error);
    return error.message;
  }
};


/* *****************************
* Return account data using email address
* ***************************** */
accountModel.getAccountByEmail = async function (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
};

/* **********************
 *  Get account by ID
 * ********************* */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* **********************
 *  Update account info
 * ********************* */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* **********************
 *  Update password
 * ********************* */
async function updatePassword(account_password, account_id) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [account_password, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = accountModel;