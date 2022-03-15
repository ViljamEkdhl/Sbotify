const users = require('./users.js');

// Require the necessary discord.js classes
const { Client, Intents, Presence } = require('discord.js');
const { token } = require('./config.json');
const { userInList, addUserToList } = require('./users.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


client.on('interactionCreate', async Interaction =>{

	//console.dir(Interaction);
	users.validateCommand(Interaction);

});

client.on('presenceUpdate', async (oldPresence, newPresence) => {

	//console.log(newPresence.activities);
	//FIXA DENNA IF-SATS så att endast personer med spotify som aktivitet kommer med, Om någon activity är spotify


	newPresence.activities.forEach(async function (activity) {
		
		//console.log(activity.name);
		//console.log('----------');
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