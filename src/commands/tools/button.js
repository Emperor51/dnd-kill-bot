const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Return a button!"),
  async execute(interaction, client) {
    const button1 = new ButtonBuilder()
      .setCustomId("verify")
      .setLabel("Enter Email")
      .setStyle(ButtonStyle.Primary);
    const button2 = new ButtonBuilder()
      .setCustomId("code")
      .setLabel("Enter Code")
      .setStyle(ButtonStyle.Primary);

    await interaction.channel.send({
      components: [new ActionRowBuilder().addComponents(button1, button2)],
    });
  },
};
