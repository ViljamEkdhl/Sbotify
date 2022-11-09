

// Require the necessary discord.js classes
const { Client, Intents, Presence, Options, Collection } = require('discord.js');
const fs = require('fs');
const { token } = require('./config.json');
const { userInList, addUserToList, checkForMembersActivity, removeUserFromList } = require('./listeningUsers.js');
const { scheduleTask } = require('./cronJob.js');
const commands = require('./Commands/allCommands.js');
const { getConfig, setClient } = require('./storage.js')


const sweepSettings = {
	interval: 14400,
	lifetime: 3600,
	
}

// Create a new client instance
const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES],
	sweepers: {
		messages: sweepSettings,
		threads: sweepSettings,
		presences: 
		{
			interval: 14400, //28800 = 8 hours
			filter: () => function name(value, key, collection) {
				
				if(value.status == 'offline'){
					//console.log(value.status);
					return true;
				}else{
					return false;
				}
			},
		}
	},

});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	
	
});

client.on('ready',() => {
	client.user.setActivity(`on ${client.guilds.cache.size} servers`);
	console.log(`Ready to serve on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);
	setClient(client);
	checkForMembersActivity();

	for (const [key, value] of client.guilds.cache.entries()) {
		const config = getConfig(key.toString());
		//console.dir(config[0].resultRatio);
		try {
			if (config.resultRatio != '') {
				scheduleTask( key, config.resultRatio);
			}
		} catch (error) {
			console.log(key + ' Does not have any settings yet');

		}

	}
	
});


client.on('interactionCreate', async Interaction =>{
	/*const channel = client.channels.cache.get('834009668493639742');
	channel.send('test');*/

	commands.validateCommand(Interaction, client);
});

client.on('guildMemberRemove', () =>{
	//Might implement if it shows up that it brakes if bot leaves server
	console.log('TESTESTTEESTSETSETSETSETSETSE');
});

client.on('presenceUpdate', async (oldPresence, newPresence) => {
	const userIsInList = await userInList(newPresence);
	
	newPresence.activities.forEach(async function (activity) {
		if(activity.name === 'Spotify' && userIsInList === false){
			addUserToList(newPresence);
		}
	});
	if(newPresence.activities.find(element => element.name === 'Spotify') === undefined && userIsInList === true){
		removeUserFromList(newPresence);
	}
});

// Login to Discord with your client's token
client.login(token);