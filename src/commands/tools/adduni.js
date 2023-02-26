const { SlashCommandBuilder } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("adduni")
    .setDescription("Add a univerity domain to the list")
    .addStringOption((email) =>
      email
        .setName("email")
        .setDescription("email domain for the university")
        .setRequired(true)
    )
    .addRoleOption((role) =>
      role
        .setName("role")
        .setDescription("role to link to the domain")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const email = interaction.options.getString("email");
    const role = interaction.options.getRole("role");
    console.log(email, role.id);
    // Open a new SQLite database file
    const db = new sqlite3.Database("ukgs.db");

    await db.run(
      "INSERT INTO unis (domain, roleID) VALUES (?, ?)",
      [email, role.id],
      async (err) => {
        if (err) {
          // Handle the error
          console.log(err);
          interaction.reply({
            content: "An error occurred adding this domain: " + err.toString(),
            ephemeral: true,
          });
        } else {
          // Send the email with the verification code
          interaction.reply({
            content:
              "Domain: **" +
              email +
              "** has been linked to the role: **" +
              interaction.guild.roles.fetch(role) +
              "**",
            ephemeral: true,
          });
        }
      }
    );
    // Close the database connection
    db.close();
  },
};

// const message = await interaction.deferReply({
//   fetchReply: true,
// });
//
// const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${
//   message.createdTimestamp - interaction.createdTimestamp
// }`;
// await interaction.editReply({
//   content: newMessage,
// });
