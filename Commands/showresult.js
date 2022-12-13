const { getConfig, setConfig, } = require('../storage.js');
const { scheduleTask } = require('../cronJob.js');

module.exports = {

    changeRatio: async function (Interaction, channel) {

        //let guildMap = getConfig();
        //this line creates the undefined.js because channel.guildId from index
        let config = getConfig(channel.guildId);

        if(config === undefined){
            config = {songList: [], guildChannel: '', resultRatio: ''};
        }

        try {
            config.resultRatio = Interaction.options.getString('settings');
        } catch (error) {
            
        }

        if(config.resultRatio === undefined){
            config.resultRatio = Interaction;
        }
        config.guildChannel = channel;
        setConfig(channel.guildId, config);

        //MONTHLY
        scheduleTask(channel.guildId, config.resultRatio);
        return true;
    }
}