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
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("accountRegister error: " + error);
    throw error;
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

module.exports = accountModel;