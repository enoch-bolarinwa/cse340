const pool = require("../database/");

/* **********************
 *  Log activity
 * ********************* */
async function logActivity(account_id, activity_type, activity_description, ip_address = null) {
  try {
    const sql = `
      INSERT INTO activity_log (account_id, activity_type, activity_description, ip_address)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    
    const data = await pool.query(sql, [account_id, activity_type, activity_description, ip_address]);
    return data.rows[0];
  } catch (error) {
    console.error("logActivity error: " + error);
    return null;
  }
}

/* **********************
 *  Get user's activity history
 * ********************* */
async function getActivityByAccountId(account_id, limit = 50) {
  try {
    const result = await pool.query(
      `SELECT * FROM activity_log 
       WHERE account_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [account_id, limit]
    );
    return result.rows;
  } catch (error) {
    console.error("getActivityByAccountId error: " + error);
    return [];
  }
}

/* **********************
 *  Get all activity (Admin only)
 * ********************* */
async function getAllActivity(limit = 100) {
  try {
    const result = await pool.query(
      `SELECT al.*, a.account_firstname, a.account_lastname, a.account_email
       FROM activity_log al
       JOIN account a ON al.account_id = a.account_id
       ORDER BY al.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  } catch (error) {
    console.error("getAllActivity error: " + error);
    return [];
  }
}

/* **********************
 *  Get activity by type
 * ********************* */
async function getActivityByType(activity_type, limit = 50) {
  try {
    const result = await pool.query(
      `SELECT al.*, a.account_firstname, a.account_lastname
       FROM activity_log al
       JOIN account a ON al.account_id = a.account_id
       WHERE al.activity_type = $1
       ORDER BY al.created_at DESC
       LIMIT $2`,
      [activity_type, limit]
    );
    return result.rows;
  } catch (error) {
    console.error("getActivityByType error: " + error);
    return [];
  }
}

/* **********************
 *  Delete old activity logs
 * ********************* */
async function deleteOldActivity(days = 90) {
  try {
    const sql = `
      DELETE FROM activity_log 
      WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '${days} days'
      RETURNING *`;
    
    const data = await pool.query(sql);
    return data.rows.length;
  } catch (error) {
    console.error("deleteOldActivity error: " + error);
    return 0;
  }
}

module.exports = {
  logActivity,
  getActivityByAccountId,
  getAllActivity,
  getActivityByType,
  deleteOldActivity
};