const fs = require("fs");
const universities = require(`../../universities.json`);
const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

module.exports = {
  data: {
    name: `codeInput`,
  },
  async execute(interaction, client) {
    // Read the codes from the JSON file
    var codes = require(`../../codes.json`);
    console.log(codes);
    // Check if the entered code is valid
    const enteredCode = interaction.fields
      .getTextInputValue(`codeInput`)
      .toString(); // replace with the actual entered code
    console.log(codes[enteredCode.toString()].expires > new Date().getTime());
    if (
      codes.hasOwnProperty(enteredCode.toString()) &&
      codes[enteredCode.toString()].expires > new Date().getTime()
    ) {
      console.log("HELLO, IM A VALID CODE: " + codes[enteredCode].id);
      // Code is valid
      const universityID = await interaction.guild.roles.fetch(
        codes[enteredCode].id.toString()
      );
      console.log(universityID);
      await interaction.member.roles.add([universityID]).catch(console.error);
      //console.log(interaction.member.roles);
      // Do something to mark the code as used (e.g. delete it from the JSON file)
      //delete codes[enteredCode.toString()];
      //fs.writeFileSync("./src/codes.json", JSON.stringify(codes));
    } else {
      interaction.reply({
        content: "Code is invalid or has expired, please try again",
        ephemeral: true,
      });
    }
  },
};
