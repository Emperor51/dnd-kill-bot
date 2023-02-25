const sqlite3 = require("sqlite3").verbose();

module.exports = {
  data: {
    name: `codeInput`,
  },
  async execute(interaction, client) {
    // Open the SQLite database file
    const db = new sqlite3.Database("codes.db");

    // Check if the verification code is valid
    const enteredCode = interaction.fields
      .getTextInputValue(`codeInput`)
      .toString();
    const currentTime = new Date().getTime();

    db.get(
      "SELECT university_id, user_id, email FROM codes WHERE code = ? AND expires > ?",
      [enteredCode, currentTime],
      async (err, row) => {
        if (err) {
          // Handle the error
          console.log(err);
        } else if (!row) {
          // Verification code is invalid or has expired
          interaction.reply({
            content:
              "This code is invalid or has expired. Please request a new code using `Enter Email`.",
            ephemeral: true,
          });
        } else if (interaction.member.user.id.toString() !== row.user_id) {
          // This verification code is not valid for your user
          interaction.reply({
            content:
              "This code is invalid for your user. Please try again with a different code.",
            ephemeral: true,
          });
        } else {
          // Add Role
          const universityID = await interaction.guild.roles.fetch(
            row.university_id
          );
          await interaction.member.roles
            .add([universityID])
            .catch(console.error);
          await interaction.member.roles
            .remove(["1078482478882373672"])
            .catch(console.error);
          // Add user to verified database
          const verifiedDb = new sqlite3.Database("verified_users.db");
          await verifiedDb.run(
            "INSERT INTO users (user_id, email, university_id, first_verify_time) VALUES (?, ?, ?, ?)",
            [row.user_id, row.email, row.university_id, new Date().getTime()],
            async (err) => {
              if (err) {
                // Handle the error
                console.log(err);
                interaction.guild.channels.cache
                  .get("1078995538680238160")
                  .send(
                    "An error occurred adding" +
                      interaction.member.user.username +
                      "to the database. They are from " +
                      universityID.name +
                      "and their email is " +
                      row.email
                  );
              } else {
                // Send the email with the verification code
                console.log(`User added to the database`);
              }
            }
          );

          // Delete the verification code from the database
          db.run("DELETE FROM codes WHERE code = ?", enteredCode);
          // Close the database
          db.close();
          // Tell the user it was a success
          interaction.reply({
            content:
              "You have now been verified as a member of" +
              universityID.name +
              "!",
            ephemeral: true,
          });
          interaction.guild.channels.cache
            .get("1039540240072851486")
            .send(
              "Welcome to the **UK Gaming Society** <@" +
                interaction.member.user.id +
                "> from **" +
                universityID.name +
                "**! Please head to <#1039536554076536862> to pick some roles."
            );
        }
      }
    );
  },
};
