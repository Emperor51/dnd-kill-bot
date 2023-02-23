require("dotenv").config();

const { TOKEN } = process.env;
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
//client.colour = "";

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(TOKEN);

//OLD//
// require("dotenv").config(); //to start process from .env file
// //const mailer = require('./mailer');
// const { REST, Routes } = require('discord.js');
// const {Client, GatewayIntentBits}=require("discord.js");
// const fs = require('fs');
// const nodemailer = require("nodemailer");
// const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
// const client=new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.MessageContent,
//         GatewayIntentBits.GuildMembers,
//     ]
// });
//
//
// const univeristies = {
//     "unimail.winchester.ac.uk" : 1039535162897219624,
//     "live.uwe.ac.uk" : 1078120741792395335
// }
//
// const commands = [
//     {
//         name: 'ping',
//         description: 'Replies with Pong!',
//     },
//     {
//         name: 'verify',
//         description: 'Use to verify your univeristy email',
//         options: [
//             {
//                 name: 'email',
//                 description: 'Univeristy email address',
//                 required: true,
//                 type: 3
//             }
//         ]
//     },
//     {
//         name: 'code',
//         description: 'Use to verify your univeristy email',
//         options: [
//             {
//                 name: 'code',
//                 description: 'The code you recieved in your email',
//                 required: true,
//                 type: 3
//             }
//         ]
//     },
// ];
//
// //Load the (/) commands
// (async () => {
//     try {
//         console.log('Started refreshing application (/) commands.');
//
//         await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
//
//         console.log('Successfully reloaded application (/) commands.');
//     } catch (error) {
//         console.error(error);
//     }
// })();
//
// //Output when logged in
// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`);
//     client.channels.cache.get('1078140889345576961').send('Please use `/verify` to verify yourself on this discord server!')
// });
//
// client.on('interactionCreate', async interaction => {
//     if (!interaction.isChatInputCommand()) return;
//
//     if (interaction.commandName === 'ping') {
//         await interaction.reply('Pong!');
//     }
//     const email = interaction.options.getString('email');
//     if (interaction.commandName === 'verify') {
//         //await interaction.deferReply({ ephemeral: true });
//         //await interaction.user.send({content: 'Please check your emails!' + interaction.options.email,  ephemeral: true});
//         if (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email)) {
//             if (univeristies[email.substring(email.lastIndexOf("@") + 1)] !== undefined) {
//                 await mailer(email, generateCode(univeristies[email.substring(email.lastIndexOf("@") + 1)]));
//                 await interaction.reply({
//                     content: 'Please check the email sent to ' + email,
//                     ephemeral: true
//                 });
//             } else {
//                 await interaction.reply({
//                     content: "We don't currently support the email ending: " +
//                         univeristies[email.substring(email.lastIndexOf("@") + 1)] +
//                         "Please contact an Admin for support",
//                     ephemeral: true
//                 });
//             }
//         } else {
//             await interaction.reply({
//                 content: "Please enter a valid email address",
//                 ephemeral: true
//             })
//         }
//     }
//     if (interaction.commandName === 'verify') {
//
//     }
// });
//
// function generateCode(university) {
//     let codes = {};
//
//     // Check if the codes.json file exists
//     if (fs.existsSync('./codes.json')) {
//         // Read the codes from the JSON file
//         const data = fs.readFileSync('./codes.json');
//         // Check if the file is empty
//         if (data.length > 0) {
//             codes = JSON.parse(data);
//         }
//     }
//
//     // Generate a 6-digit code
//     const code = Math.floor(Math.random() * 900000) + 100000;
//
//     // Set the code to expire in 1 hour (3600 seconds)
//     const expirationTime = new Date().getTime() + 3600000;
//
//     codes[code] = { id: university, expires: expirationTime };
//     fs.writeFileSync('./codes.json', JSON.stringify(codes));
//
//     //Return the code
//     return code
// }
//

//
// client.handleComonents();
//
// client.login(process.env.TOKEN);
