const fs = require("fs");
const nodemailer = require("nodemailer");
const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
const sqlite3 = require("sqlite3").verbose();

module.exports = {
  data: {
    name: `emailInput`,
  },
  async execute(interaction, client) {
    // Get email from the field
    const email = interaction.fields.getTextInputValue(`emailInput`);
    // Check if input matches a valid email address
    if (
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        email
      )
    ) {
      const db = new sqlite3.Database("ukgs.db");
      // See if domain is valid //
      db.get(
        "SELECT domain, roleID FROM unis WHERE domain = ?",
        email.substring([email.lastIndexOf("@") + 1]),
        async (err, row) => {
          if (err) {
            console.log(err);
          } else if (!row) {
            console.log(
              "Invalid Domain: " + email.substring([email.lastIndexOf("@") + 1])
            );
          } else {
            // See if email has already been used //
            db.get(
              "SELECT email FROM users WHERE email = ?",
              email,
              async (err, row2) => {
                if (err) {
                  // Handle the error
                  console.log(err);
                } else if (!row2) {
                  // Email the address with a generated 6-digit code //
                  generateCode(
                    db,
                    email,
                    interaction.member.user.id,
                    row.roleID,
                    (err, code) => {
                      if (err) {
                        console.error(err);
                      } else {
                      }
                    }
                  );
                  // Tell the user that the email has been sent. Make it only visible to them
                  await interaction.reply({
                    content: "Please check the email sent to **" + email + "**",
                    ephemeral: true,
                  });
                } else {
                  await interaction.reply({
                    content:
                      "The email address **" + email + "** is already in use.",
                    ephemeral: true,
                  });
                }
              }
            );

            db.close();
          }
        }
      );
    } else {
      // Tell the user if the email they entered was invalid
      await interaction.reply({
        content: "Please enter a valid email address",
        ephemeral: true,
      });
    }
  },
};

// Generate a new verification code
function generateCode(db, email, userID, university, callback) {
  let code = Math.floor(100000 + Math.random() * 900000);
  let currentTime = new Date().getTime();
  // Open the SQLite database file
  db.get("SELECT code FROM codes WHERE code = ?", code, (err, row) => {
    if (err) {
      // Handle the error
      console.log(err);
      return "ERROR";
    } else if (row) {
      // The code is already in the database, generate a new one
      generateCode(userID, university, callback);
    } else {
      // The code is not in the database, insert it
      const expirationTime = currentTime + 60 * 60 * 1000; // 1 hour

      db.run(
        "INSERT INTO codes (code, user_id, email, university_id, expires) VALUES (?, ?, ?, ?, ?)",
        [
          code.toString(),
          userID.toString(),
          email,
          university.toString(),
          expirationTime,
        ],
        async (err) => {
          if (err) {
            // Handle the error
            console.log(err);
          } else {
            // Send the email with the verification code
            console.log(
              `Verification code ${code} generated and inserted into database`
            );
            await mailer(email, code);
            return code;
          }
        }
      );
    }
  });
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
      text:
        "Welcome to the UK Gaming Society. \nPlease enter the following code in Discord: " +
        verifyCode, // plain text body
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
