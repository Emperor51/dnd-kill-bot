const { SlashCommandBuilder, SelectStringMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require ("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("menu")
        .setDescription("Returns a select menu!"),
    async execute(interaction, client) {
        const menu = new SelectStringMenuBuilder()
            .setCustomId(`sub-menu`)
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(new SelectStringMenuBuilder({
                label: `Option #1`,
                value: `option 1!`
            }), new SelectStringMenuBuilder({
                label: `Option #2`,
                value: `option 2!`
            }));

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(menu)]
        })
    },
};