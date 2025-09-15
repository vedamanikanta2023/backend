const { db } = require("../db");

const getUserFromDB = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, username, email, role, createdAt FROM users WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) {
          console.error("DB Error:", err);
          return reject(err);
        }

        resolve(result[0]); // return first row
      }
    );
  });
};

module.exports = { getUserFromDB };
