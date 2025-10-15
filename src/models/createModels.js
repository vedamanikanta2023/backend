const UserDetails = require("./userDetails");
const Users = require("./users");

function createUpdateTables(alter = false) {
  (async () => {
    try {
      await UserDetails.sync({ alter }); // creates or updates only this table
      console.log("✅ UserDetails table created or updated successfully");
    } catch (err) {
      console.error("❌ Error creating table:", err);
    }
  })();

  (async () => {
    try {
      await Users.sync({ alter }); // creates or updates only this table
      console.log("✅ Users table created or updated successfully");
    } catch (err) {
      console.error("❌ Error creating table:", err);
    }
  })();
}

module.exports = createUpdateTables;
