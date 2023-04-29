const { SlashCommandBuilder } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addkill")
    .setDescription("Add a kill to the tracker")
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription("player who got the kill")
        .setRequired(true)
    )
    .addIntegerOption((kill) =>
      kill
        .setName("kill")
        .setDescription("number of enemies killed")
        .setRequired(true)
    )
    .addStringOption((comment) =>
      comment
        .setName("comment")
        .setDescription("comment about the kill e.g. monster type")
        .setRequired(false)
    )
    .addBooleanOption((boss) =>
      boss
        .setName("boss")
        .setDescription("was the enemy a boss")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const kill = interaction.options.getInteger("kill");
    const comment = interaction.options.getString("comment");
    const boss = interaction.options.getBoolean("boss");
    let now = new Date().toISOString(); //now.format("dd/MM/yyyy hh:mm TT");
    now.toLocaleString()

    console.log("A new kill has been made", user, kill, comment, boss)
    const db = new sqlite3.Database("kills.db")

    await db.run(
      "INSERT INTO kills (user, killCount, comment, boss, dateTime) VALUES (?, ?, ?, ?, ?)",
      [user.id, kill, comment, boss, now],
      async (err) => {
        if (err) {
          // Handle the error
          console.log(err);
          interaction.reply({
            content: "An error occurred adding this kill: " + err.toString(),
            ephemeral: true,
          });
        } else {
          // Send the email with the verification code
          interaction.reply({
            content: `Kill has been added! User: ${user}, Kill Count: ${kill}, Comment: ${comment}, Boss: ${boss}, Time: ${now}`,
            ephemeral: false,
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
