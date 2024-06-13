const pool = require("../config/db");

exports.checkIfPictureChanged = async (data, column, database) =>{
    const res = await pool.query(
      `SELECT * FROM ${database} WHERE ${column} = $1`,
      [data]
    );
    return res.rows[0];
}
