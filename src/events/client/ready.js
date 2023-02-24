const sqlite3 = require("sqlite3");

module.exports = {
  name: "ready",
  once: "true",
  async execute(client) {
    console.log(`Ready!!! ${client.user.tag} is logged in and online.`);

    // // Open a new SQLite database file
    // const db = new sqlite3.Database("verified_users.db");
    //
    // // Create a new table to store the verification codes
    // db.serialize(() => {
    //   db.run(
    //     "CREATE TABLE IF NOT EXISTS users (user_id TEXT PRIMARY KEY, email TEXT, university_id TEXT, first_verify_time INTEGER)"
    //   );
    // });
    //
    // // Close the database connection
    // db.close();
  },
};
