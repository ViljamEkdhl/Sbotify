//const showResults = require('./showResults.js');
const { changeRatio } = require('./showResults.js');
const { MessageAttachment } = require('discord.js');

module.exports = {
    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction, client){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'showresult'){
        const channel = Interaction.options.getChannel('destination');
        const setting = Interaction.options.getString('settings');
        //console.log(Interaction);
        if (await changeRatio(Interaction, channel) === false){
            await Interaction.reply('Unable to change setting due to it already being the active setting!');
        }else{
            //console.log(channel);
            //await showResults.displayMusicTierList(channel);
            await Interaction.reply('Setting was successfully changed!');
        }
    };

    if(commandName === 'printlist'){
        const startDate = Interaction.options.getInteger('integerstart');
        const endDate = Interaction.options.getInteger('integerend');

        if(startDate > endDate){
            await Interaction.reply('The start date cannot come after the end date :)');
        }

    };
   },
}