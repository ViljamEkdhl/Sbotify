const fs = require('fs');
const musicStats = require('./musicStats.js');
const { getFilepathLlastMonth } = require('./folderStructure.js');
const cron = require('node-cron');
const users = require('./users.js');
const { MessageEmbed } = require('discord.js');

module.exports = {

    //This function changes the intervalls for the music top 10 list.
    //Returning true means that the change was successfull and false means that the change wasn't possible.
    changeRatio: async function (Interaction, channel) {
        //console.log(Interaction);
        let guildMap = users.getGuildMap();
        //console.log(guildMap);
        const guild = guildMap.get(channel.guildId);

        guild.resultRatio = Interaction.options.getString('settings');
        guild.guildChannel = channel;
    
        if (guild.resultRatio === "result_monthly") {
            console.log("is monthly " + channel.guildId);
			if (guild.cronJob != "") {
                console.log("cronjob stopped " + channel.guildId);
				guild.cronJob.stop();
			}

			guild.cronJob = cron.schedule("1 0 1 * *", async function () {
                console.log("cronjob ran " + channel.guildId);
				await displayMusicTierList(guild.guildChannel);
			},{
                scheduled: true
            });
		}
        return true;

    },
}

    //Creates a array with all the data from the last month and displays it on the server
    async function displayMusicTierList (guildChannel) {

        let dirname = getFilepathLlastMonth(guildChannel.guildId).toString();
        let unfilteredData = [];
        const filenames = fs.readdirSync(dirname);

        filenames.forEach(file => {
            var readFile = fs.readFileSync(dirname + '/' + file.toString()).toString();
            unfilteredData = unfilteredData.concat(JSON.parse(readFile));

        });

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