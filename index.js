const users = require('./users.js');

// Require the necessary discord.js classes
const { Client, Intents, Presence } = require('discord.js');
const { token } = require('./config.json');
const { userInList, addUserToList } = require('./users.js');
const commands = require('./commands.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });


// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('ready', () => {
	client.user.setActivity(`on ${client.guilds.cache.size} servers`);
	console.log(`Ready to serve on ${client.guilds.cache.size} servers, for ${client.users.cache.size} users.`);
	users.initiate(client.guilds.cache);
});


client.on('interactionCreate', async Interaction =>{
	/*const channel = client.channels.cache.get('834009668493639742');
	channel.send('test');*/

	commands.validateCommand(Interaction, client);
});

client.on('guildMemberRemove', () =>{
	//Might implement if it shows up that it brakes if bot leaves server
	console.log('TESTESTTEESTSETSETSETSETSETSE');
})

client.on('presenceUpdate', async (oldPresence, newPresence) => {
	newPresence.activities.forEach(async function (activity) {
		if(activity.name === 'Spotify' && await users.userInList(newPresence) === false){
			users.addUserToList(newPresence);
		}
	});
	if(newPresence.activities.find(element => element.name === 'Spotify') === undefined && await users.userInList(newPresence) === true){
		users.removeUserFromList(newPresence);
	}
});

// Login to Discord with your client's token
client.login(token);