const fs = require("fs");
const universities = require(`../../universities.json`);
const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

module.exports = {
  data: {
    name: `emailInput`,
  },
  async execute(interaction, client) {
    console.log(interaction.fields);

    const email = interaction.fields.getTextInputValue(`emailInput`);

    //Check if input matches a valid email address
    if (
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        email
      )
    ) {
      //Check if that valid email is in the universities list
      if (
        universities.hasOwnProperty(email.substring(email.lastIndexOf("@") + 1))
      ) {
        await mailer(
          email,
          generateCode(
            universities[email.substring(email.lastIndexOf("@") + 1)]
          )
        );
        await interaction.reply({
          content: "Please check the email sent to " + email,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "We don't currently support the email ending: " +
            email.substring(email.lastIndexOf("@") + 1) +
            ". Please contact an Admin for support",
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content: "Please enter a valid email address",
        ephemeral: true,
      });
    }
  },
};

function generateCode(university) {
  let codes = {};

  // Check if the codes.json file exists
  if (fs.existsSync("./src/codes.json")) {
    // Read the codes from the JSON file
    const data = fs.readFileSync("./src/codes.json");
    // Check if the file is empty
    if (data.length > 0) {
      codes = JSON.parse(data);
    }
  }

  // Generate a 6-digit code
  const code = Math.floor(Math.random() * 900000) + 100000;

  // Set the code to expire in 1 hour (3600 seconds)
  const expirationTime = new Date().getTime() + 3600000;

  codes[code] = { id: university, expires: expirationTime };
  fs.writeFileSync("./src/codes.json", JSON.stringify(codes));
  //Return the code
  return code;
}

async function mailer(toAddress, verifyCode) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service: "gmail",
    auth: {
      user: EMAIL_USER, // generated ethereal user
      pass: EMAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: '"UK Gaming Society" <winchestergamingsociety@gmail.com>', // sender address
      to: toAddress, // list of receivers
      subject: "Verify your Discord Account", // Subject line
      text: "Please enter the following code in discord: " + verifyCode, // plain text body
      //html: "<b>Hello world?</b>", // html body
    },
    function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      }
    }
  );
}
