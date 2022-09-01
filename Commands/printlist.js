const { MessageEmbed } = require('discord.js');
const { filterMusicList, composeTopTenList } = require('../listCreater.js');
const { getMusiclist } = require('../storage.js');

module.exports = {

    displayCustomTierList:  async function (Interaction, startDate, endDate){
        const unfilteredData = getMusiclist(Interaction.guildId, startDate, endDate);
        const filteredList = filterMusicList(unfilteredData);
        const list = composeTopTenList(filteredList);

        let test = ' ';
        list.forEach(async list => {
            test = test + 'Song: ' + list.songName + ' - ' + 'Played: ' + list.count  + '\n';
        });
    
        const embedMessage = new MessageEmbed()
        .setColor('#F0F8FF')
        .setTitle('Top ten list from ' + startDate + 'st - ' + endDate +  'st')
        .setDescription(test);

        if(test.length < 2){
            Interaction.reply('Not enough information! Try with different dates :)');
        }else{
            await Interaction.reply({embeds: [embedMessage]});
        }
    }
}