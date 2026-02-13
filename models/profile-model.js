const pool = require("../database/");

/* **********************
 *  Get profile by account_id
 * ********************* */
async function getProfileByAccountId(account_id) {
  try {
    const result = await pool.query(
      `SELECT p.*, a.account_firstname, a.account_lastname, a.account_email
       FROM user_profile p
       JOIN account a ON p.account_id = a.account_id
       WHERE p.account_id = $1`,
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getProfileByAccountId error: " + error);
    return null;
  }
}

/* **********************
 *  Create or update profile
 * ********************* */
async function updateProfile(account_id, bio, phone, date_of_birth, profile_image_url) {
  try {
    const sql = `
      INSERT INTO user_profile (account_id, bio, phone, date_of_birth, profile_image_url, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (account_id) 
      DO UPDATE SET 
        bio = $2,
        phone = $3,
        date_of_birth = $4,
        profile_image_url = COALESCE($5, user_profile.profile_image_url),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`;
    
    const data = await pool.query(sql, [account_id, bio, phone, date_of_birth, profile_image_url]);
    return data.rows[0];
  } catch (error) {
    console.error("updateProfile error: " + error);
    return null;
  }
}

/* **********************
 *  Get user preferences
 * ********************* */
async function getPreferencesByAccountId(account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM user_preferences WHERE account_id = $1',
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getPreferencesByAccountId error: " + error);
    return null;
  }
}

/* **********************
 *  Update user preferences
 * ********************* */
async function updatePreferences(account_id, theme, email_notifications, sms_notifications, language) {
  try {
    const sql = `
      INSERT INTO user_preferences (account_id, theme, email_notifications, sms_notifications, language)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (account_id)
      DO UPDATE SET
        theme = $2,
        email_notifications = $3,
        sms_notifications = $4,
        language = $5
      RETURNING *`;
    
    const data = await pool.query(sql, [account_id, theme, email_notifications, sms_notifications, language]);
    return data.rows[0];
  } catch (error) {
    console.error("updatePreferences error: " + error);
    return null;
  }
}

/* **********************
 *  Delete profile
 * ********************* */
async function deleteProfile(account_id) {
  try {
    const sql = 'DELETE FROM user_profile WHERE account_id = $1 RETURNING *';
    const data = await pool.query(sql, [account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("deleteProfile error: " + error);
    return null;
  }
}

module.exports = {
  getProfileByAccountId,
  updateProfile,
  getPreferencesByAccountId,
  updatePreferences,
  deleteProfile
};