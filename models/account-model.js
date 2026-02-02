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

/* ........................................
*  Get account by email
* ..................................... */
accountModel.getAccountByEmail = async function (account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("getAccountByEmail error: " + error);
    throw error;
  }
};

module.exports = accountModel;