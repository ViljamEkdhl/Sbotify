const showResults = require('./showResults.js');
const { changeRatio } = require('./showResults.js');

module.exports = {
    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction, client){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'initiate'){
        await showResults.displayMusicTierList(client);
    };
    if(commandName === 'showresult'){
        //console.log(Interaction);
        if (changeRatio(Interaction) === false){
            await Interaction.reply('Unable to change setting due to it already being the active setting!');
        }else{
            await Interaction.reply('Setting was successfully changed!');
        }
    }
   },
}