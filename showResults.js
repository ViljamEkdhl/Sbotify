const musicStats = require('./dateFunctions.js');
const cron = require('node-cron');
const { MessageEmbed } = require('discord.js');
const { getMusiclist, getConfig, getCronJob, setCronJob, setConfig } = require('./storage.js')

module.exports = {

    //This function changes the intervalls for the music top 10 list.
    //Returning true means that the change was successfull and false means that the change wasn't possible.
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
        if (config.resultRatio === "result_monthly") {
            console.log("is monthly " + channel.guildId);
			if (getCronJob(channel.guildId) != undefined) {
                console.log("cronjob stopped " + channel.guildId);
                const task = getCronJob(channel.guildId);
				task.stop();
			}

            const task = cron.schedule("40 15 21 * *", async function () {
                console.log("cronjob ran " + channel.guildId);
				await displayMusicTierList(config.guildChannel, channel.guildId);
			},{
                scheduled: true
            })
			setCronJob(channel.guildId, task);
		}
        return true;
    },
}

    //Creates a array with all the data from the last month and displays it on the server
    async function displayMusicTierList (guildChannel, guildId) {

        const unfilteredData = getMusiclist(guildId);
        const filteredList = filterMusicList(unfilteredData);
        const list = composeTopTenList(filteredList);
 
        await guildChannel.send('Top ten list for: ' + guildChannel.guild.name);

        let test = ' ';
        list.forEach(async list => {
            test = test + 'Song: ' + list.songName + ' - ' + 'Played: ' + list.count  + '\n';
        });

        const embedMessage = new MessageEmbed()
        .setColor('#F0F8FF')
        .setTitle('Most played songs for: ' + guildChannel.guild.name)
        .setDescription(test);
    

        await guildChannel.send({ embeds: [embedMessage] });

    }

//Filters the music by checking at the startTime for every object in the array
function filterMusicList(listToBeSorted) {
    const uniqueIds = [];

    const unique = listToBeSorted.filter(element => {
        const isDuplicate = uniqueIds.includes(element.startTime);

        if (!isDuplicate) {
            uniqueIds.push(element.startTime);

            return true;
        }

    });
    //console.log(unique);
    return unique;
}
/**
 * 
 * @param {any[]} sortedList 
 */
function composeTopTenList(sortedList) {
    const topTen = [];
    //console.log(sortedList);

    for (const song of sortedList) {
        const isDuplicate = topTen.findIndex(object => {
            return object.songName === song.songName;
        });
        //console.dir(isDuplicate);

        if (isDuplicate === -1) {
            topTen.push({
                songName: song.songName,
                artist: song.artist,
                startTime: song.startTime,
                count: 1
            })
        } else {
            const index = topTen.findIndex(object => {
                return object.songName === song.songName;
            });

            if (index !== -1) {
                topTen[index].count = topTen[index].count + 1;
            }
        }

    }
    topTen.sort((b, a) => a.count - b.count);
    topTen.splice(10, topTen.length);
    return topTen;

}