const fs = require("fs");
const universities = require(`../../universities.json`);
const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
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
      "SELECT university_id, user_id FROM codes WHERE code = ? AND expires > ?",
      [enteredCode, currentTime],
      async (err, row) => {
        if (err) {
          // Handle the error
          console.log(err);
        } else if (!row) {
          // Verification code is invalid or has expired
          console.log("Invalid verification code");
        } else if (interaction.member.user.id.toString() !== row.user_id) {
          // This verification code is not valid for your user
          console.log("Verification code not valid for this user");
        } else {
          // Add Role
          const universityID = await interaction.guild.roles.fetch(
            row.university_id
          );
          // Verification code is valid
          console.log(`Email verified for university ID ${universityID}`);
          //console.log(universityID);
          await interaction.member.roles
            .add([universityID])
            .catch(console.error);
          // Delete the verification code from the database
          db.run("DELETE FROM codes WHERE code = ?", enteredCode);
          // Close the database
          db.close();
          // Tell the user it was a success
          interaction.reply({
            content: "Great Success!",
            ephemeral: true,
          });
        }
      }
    );

    // console.log(codes);
    // // Check if the entered code is valid
    // // replace with the actual entered code
    // console.log(codes[enteredCode.toString()].expires > new Date().getTime());
    // if (
    //   codes.hasOwnProperty(enteredCode.toString()) &&
    //   codes[enteredCode.toString()].expires > new Date().getTime()
    // ) {
    //   console.log("HELLO, IM A VALID CODE: " + codes[enteredCode].id);
    //   // Code is valid
    //
    //   //console.log(interaction.member.roles);
    //   // Do something to mark the code as used (e.g. delete it from the JSON file)
    //   delete codes[enteredCode.toString()];
    //   //fs.writeFileSync("./src/codes.json", JSON.stringify(codes));
    //   interaction.reply({
    //     content: "Success! You now have the role " + universityID.name,
    //     ephemeral: true,
    //   });
    // } else {
    //   delete codes[enteredCode.toString()];
    // }
  },
};
