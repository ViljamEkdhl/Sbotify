const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('initiate').setDescription('Initiates the bot'),
	
	new SlashCommandBuilder().setName('showresult').setDescription('Shows the song top-list')
	.addStringOption(option =>
		option.setName('settings')
		.setDescription('How often do you want the bot to display the tierlist?')
		.setRequired(true)
		.addChoice('Weekly', 'result_weekly')
		.addChoice('BiWeekly', 'result_biweekly')
		.addChoice('Monthly', 'result_monthly')
	),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);


(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
//Deploy on single server
/*rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);*/