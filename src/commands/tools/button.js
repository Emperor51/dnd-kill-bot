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
    const button3 = new ButtonBuilder()
      .setLabel("Help")
      .setURL("https://forms.gle/bQoPRo6JCsNKc5Qc6")
      .setStyle(ButtonStyle.Link);
    await interaction.channel.send({
      content: `Welcome to the UK Gaming Society! Please verify your student status using the buttons below. 
      \nFirst, click \`Enter Email\` below and type in your full student email address e.g. \`'john.appleseed@university.ac.uk'\`
      \nSecond, check your emails. When you receive your 6-digit code, click \`Enter Code\`, type in your code, and press \`Submit\`
      \nYou should now be verified with your University. If we don't support your university yet or something else goes wrong, 
click the help link, fill in the form, and we'll try and help as soon as possible.
      \n*Please note, your email address is stored alongside your DiscordID. This is automatically deleted if you leave this server.*`,
      components: [
        new ActionRowBuilder().addComponents(button1, button2, button3),
      ],
    });
  },
};
