const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes, ChannelType } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	
	new SlashCommandBuilder().setName('showresult').setDescription('Shows the song top-list')
	.addStringOption(option =>
		option.setName('settings')
		.setDescription('How often do you want the bot to display the tierlist?')
		.setRequired(true)
		.addChoice('Monthly', 'result_monthly')
	)
	.addChannelOption(option => 
		option.setName('destination')
		.setDescription('Where do you want the bot to publish the tier-list?')
		.setRequired(true)
		.addChannelType(ChannelType.GuildText)
	),

	new SlashCommandBuilder().setName('printlist').setDescription('Prints a list within the given parameters')
	.addIntegerOption(option =>
		option.setName('start')
			.setDescription('Start date')
			.setMinValue(1)
			.setMaxValue(31)
			.setRequired(true)
	)
	.addIntegerOption(option =>
		option.setName('stop')
			.setDescription('End date')
			.setMinValue(2)
			.setMaxValue(31)
			.setRequired(true)
	),

	new SlashCommandBuilder().setName('server-playlist').setDescription('This command creates a spotify playlist and fills it with the servers most popular songs')
	.addStringOption(option =>
		option.setName('destination')
		.setDescription('Channel to display the playlist')
		.setRequired(true)
		.addChannelType(ChannelType.GuildText)
	),
	



]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

//Deploy on multiple servers
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