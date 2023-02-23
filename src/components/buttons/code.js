const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  data: {
    name: "code",
  },
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("codeInput")
      .setTitle(`Enter the code you recieved`);

    const textInput = new TextInputBuilder()
      .setCustomId(`codeInput`)
      .setLabel(`Please enter the code you recieved`)
      .setRequired(true)
      .setStyle(1);
    modal.addComponents(new ActionRowBuilder().addComponents(textInput));

    await interaction.showModal(modal);
  },
};
