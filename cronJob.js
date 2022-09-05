const musicStats = require('./dateFunctions.js');
const cron = require('node-cron');
const { MessageEmbed } = require('discord.js');
const { getMusiclist, getConfig, getCronJob, setCronJob, setConfig, getClient, getLastMonthMusicList } = require('./storage.js');
const { filterMusicList, composeTopTenList } = require('./listCreater.js');


module.exports = {

    scheduleTask: async function(guildId, resultRatio){
        let config = getConfig(guildId);
        console.dir(config);

        if (resultRatio === "result_monthly") {
            console.log("is monthly " + guildId);
            if (getCronJob(guildId) != undefined) {
                console.log("cronjob stopped " + guildId);
                const task = getCronJob(guildId);
                task.stop();
            }

            
            const task = cron.schedule("7 0 1 * *", async function () {
                console.log(config.guildChannel.id);
                console.log("cronjob ran " + guildId);
                console.log(config.guildChannel.id);
                await displayMusicTierList(config.guildChannel.id, guildId);
            },{
                scheduled: true
            })
            setCronJob(guildId, task);
        }
    },
}

//Creates a array with all the data from the last month and displays it on the server
async function displayMusicTierList (guildChannelId, guildId) {
    console.log('1');
    const client = getClient();
    const guildChannel = await client.channels.cache.get(guildChannelId);

    console.log(guildChannel);

    const unfilteredData = getLastMonthMusicList(guildId); //THIS FUCKED IT UP I BELIEVE
    const filteredList = filterMusicList(unfilteredData);
    const list = composeTopTenList(filteredList);

    console.log('2');
    await guildChannel.send('Top ten list for: ' + guildChannel.name);
    console.log('3');

    let test = ' ';
    list.forEach(async list => {
        test = test + 'Song: ' + list.songName + ' - ' + 'Played: ' + list.count  + '\n';
    });
    console.log('4');

    const embedMessage = new MessageEmbed()
    .setColor('#F0F8FF')
    .setTitle('Most played songs for: ' + guildChannel.guild.name)
    .setDescription(test);

    console.log('EMBEDDED MESSAGE');
    console.log(embedMessage);
    await guildChannel.send({ embeds: [embedMessage] });

}