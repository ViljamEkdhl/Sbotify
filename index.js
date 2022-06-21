

// Require the necessary discord.js classes
const { Client, Intents, Presence } = require('discord.js');
const { token } = require('./config.json');
const { userInList, addUserToList, checkForMembersActivity, removeUserFromList } = require('./listeningUsers.js');
const { changeRatio } = require('./showResults.js')
const commands = require('./commands.js');
const { getConfig } = require('./storage.js')

const sweepSettings = {
	interval: 14400, // 4h
	filter: function(err){},
	
}

// Create a new client instance
const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES],
	sweepers: {
		presences: sweepSettings,
	},

});


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('ready',() => {
	client.user.setActivity(`on ${client.guilds.cache.size} servers`);
	console.log(`Ready to serve on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);
	checkForMembersActivity();

	for (const [key, value] of client.guilds.cache.entries()) {
		const config = getConfig(key.toString());
		try {
			if (config.resultRatio != '') {
				//Dåligt sätt atm :c
				//changeRatio(config.resultRatio, key);
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