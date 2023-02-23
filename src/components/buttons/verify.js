const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: {
    name: "verify",
  },
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("emailInput")
      .setTitle(`Enter your Univeristy Email`);

    const textInput = new TextInputBuilder()
      .setCustomId(`emailInput`)
      .setLabel(`Please enter your Univeristy Email`)
      .setRequired(true)
      .setStyle(1);
    modal.addComponents(new ActionRowBuilder().addComponents(textInput));

    await interaction.showModal(modal);
  },
};
