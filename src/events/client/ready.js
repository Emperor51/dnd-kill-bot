const sqlite3 = require("sqlite3");

module.exports = {
  name: "ready",
  once: "true",
  async execute(client) {
    console.log(`Ready!!! ${client.user.tag} is logged in and online.`);
    //
    // // Open a new SQLite database file
    // const db = new sqlite3.Database("codes.db");
    //
    // // Create a new table to store the verification codes
    // db.serialize(() => {
    //   db.run(
    //     "CREATE TABLE IF NOT EXISTS codes (code TEXT PRIMARY KEY, user_id TEXT, university_id TEXT, expires INTEGER)"
    //   );
    // });
    //
    // // Close the database connection
    // db.close();
  },
};
