

module.exports = {

    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'initiate'){
        await createListOfMembers(Interaction);
    }
   }
}


//Creates a list of users that is on the specific guild
async function createListOfMembers(Interaction){

    const guild = await Interaction.client.guilds.fetch('834009667884941323')
    const members = await guild.members.fetch();

    await console.log(members);

    /*await Interaction.reply(
        members.forEach(members => {
            console.log(members);
        })
    );*/
}
