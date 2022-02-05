const users = require('./users.js');

// Require the necessary discord.js classes
const { Client, Intents, Presence } = require('discord.js');
const { token } = require('./config.json');

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

	console.log(newPresence);
	//FIXA DENNA IF-SATS så att endast personer med spotify som aktivitet kommer med.
	if(newPresence.activities.length > 0 && (newPresence.activities[0].name === 'Spotify' || newPresence.activities[1].name === 'Spotify')){
		users.addUserToList(newPresence);
	}else{
		users.removeUserFromList(newPresence);
	}
	//console.log('-------------------------------------------------------------------------------');
	console.log(newPresence);
});


// Login to Discord with your client's token
client.login(token);