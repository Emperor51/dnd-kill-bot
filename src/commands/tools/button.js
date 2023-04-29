const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle, SelectMenuBuilder, EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Return a button!"),
  async execute(interaction, client) {
    const button1 = new ButtonBuilder()
      .setCustomId("quick")
      .setLabel("Quick Add")
      .setStyle(ButtonStyle.Success);
    const button2 = new ButtonBuilder()
      .setCustomId("special")
      .setLabel("Special Add")
      .setStyle(ButtonStyle.Primary);
    const button3 = new ButtonBuilder()
      .setCustomId("list")
      .setLabel("List Kills")
      .setStyle(ButtonStyle.Secondary);
    const playerList = new SelectMenuBuilder()
      .setCustomId("playerSelect")
      .setPlaceholder('Please select a player.')
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions([
        {
          label: `Aria (Chelsea)`,
          value: `689908785715609752`
        },
        {
          label: `Han (Matthew)`,
          value: `453256268128321556`
        },
        {
          label: `Lotgred (Callum)`,
          value: `116942744928124937`
        },
        {
          label: `Nanzo (Matt)`,
          value: `325577612229476362`
        },
        {
          label: `Sollen (Katy)`,
          value: `697155562646929458`
        },
        {
          label: `Thymur (Archie)`,
          value: `177305511849361409`
        },
      ])
    const killsEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('Kill Counter')
      .setDescription('Kill Counter for the D&D Campaign Tyrrany of Phandalever.')
      .setFields([
        {
          name: `Aria`,
          value: `0`,
          inline: true
        },
        {
          name: `Han`,
          value: `0`,
          inline: true
        },
        {
          name: `Lotgred`,
          value: `0`,
          inline: true
        },
        {
          name: `Nanzo`,
          value: `0`,
          inline: true
        },
        {
          name: `Sollen`,
          value: `0`,
          inline: true
        },
        {
          name: `Thymur`,
          value: `0`,
          inline: true
        },
      ])

    await interaction.channel.send({
      embeds: [killsEmbed],
      components: [
        new ActionRowBuilder().addComponents(playerList),
        new ActionRowBuilder().addComponents(button1, button2, button3),
      ],
    });
  },
};
