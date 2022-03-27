const fs = require('fs');
const musicStats = require('./musicStats.js');
const { getFilepath } = require('./folderStructure.js');
const cron = require('node-cron');
const { count } = require('console');
const users = require('./users.js');
const client = require('./index.js');

module.exports = {

    //This function changes the intervalls for the music top 10 list.
    //So far you can only pick Weekly, BiWeely and Monthly
    //Returning true means that the change was successfull and false means that the change wasn't possible.
    changeRatio: async function (Interaction, channel) {
        //console.log(Interaction);
        let guildMap = users.getGuildMap();
        for(const key of guildMap){
            if(key[0] === channel.guildId){
                key[1].resultRatio = Interaction.options.getString('settings');
    
                if (key[1].resultRatio === 'result_monthly') {
                    try {
                        cron.stop;
                    } catch (error) {
                        
                    }
                    cron.schedule('* * * * *', async function () {
                        await displayMusicTierList(channel);
                        console.log('running a task every minute');
                    });
                }
            }
        }
            return true;

    },
}

    //Creates a array with all the data from the last month and displays it on the server
    async function displayMusicTierList (channel) {
        let guildMap = users.getGuildMap();
        for (const key of guildMap) {
    
            if(channel.guildId  === key[0]){
                key[1].guildChannel = channel.id;
            }

            let dirname = getFilepath(key[0]).toString();
            let unfilteredData = [];
            const filenames = fs.readdirSync(dirname);

            filenames.forEach(file => {
                var readFile = fs.readFileSync(dirname + '/' + file.toString()).toString();
                unfilteredData = unfilteredData.concat(JSON.parse(readFile));

            });

            console.dir(unfilteredData);
            const filteredList = filterMusicList(unfilteredData);

            const list = composeTopTenList(filteredList);

            if(channel.guildId === key[0]){
                await channel.send('Top ten list for: ' + channel.guild.name);
                let test = ' ';
                list.forEach(async list => {
                    //await channel.send('Song: ' + list.songName + ' - ' + 'Times played: ' + list.count);
                    test = test + 'Song: ' + list.songName + ' - ' + 'Times played: ' + list.count  + '\n';
                });
                await channel.send(test);
            }
            

        }


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