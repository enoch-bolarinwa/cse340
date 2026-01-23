/* ***************************
 *  Get vehicle by inventory ID
 * ************************** */
invModel.getInventoryItemById = async function (inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryItemById error: " + error);
    throw error;
  }
};