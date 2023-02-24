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

    // interaction.guild.channels.cache
    //   .get("1039540240072851486")
    //   .send(
    //     "Welcome to the **UK Gaming Society** <@225640637234544641> from **University of Bath**! Please head to <#1039536554076536862> to pick some roles."
    //   );

    const textInput = new TextInputBuilder()
      .setCustomId(`emailInput`)
      .setLabel(`Please enter your Univeristy Email`)
      .setRequired(true)
      .setStyle(1);
    modal.addComponents(new ActionRowBuilder().addComponents(textInput));

    await interaction.showModal(modal);
  },
};
