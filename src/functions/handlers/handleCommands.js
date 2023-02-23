const fs = require("fs");
const { REST, Routes } = require("discord.js");
const { CLIENT_ID } = process.env;
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    console.log(commandFolders);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      console.log(commandFiles);
      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        await commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(
          `Command ${command.data.name} has passed through the handler`
        );
      }
    }

    await (async () => {
      try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: client.commandArray,
        });

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();
  };
};
