const { Presence } = require('discord.js');
const { returnDate, getMonth } = require('./musicStats.js');
const musicStats = require('./musicStats.js');
const fs = require('fs'); // Needed for folders
const path = require('path');
const { getFilepath } = require('./folderStructure.js');
const { displayMusicTierList, changeRatio } = require('./showResults.js');
const showResults = require('./showResults.js');
const folderStructure = require('./folderStructure.js');

const guildMap = new Map();
let memberList = []; //list of all the members currently listening to spotify
let songList = []; //list of all the songs

module.exports = {

    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'initiate'){
        if(!guildMap.has(Interaction.guildId)){
            guildMap.set(Interaction.guildId, [])
            console.log(guildMap);
        }
        await checkForMembersActivity(guildMap.get(Interaction.guildId));

        await Interaction.reply('Initiate!');
        //showResults.displayMusicTierList(); // move this to show result because theres not meant to be an initiate command.
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

   //Creates a list of users that is on the specific guild
    addUserToList: async function (newPresence){
        
    const guild = await newPresence.client.guilds.fetch(newPresence.guild.id);
    const addUser = await guild.members.fetch(newPresence.userId);

    /*console.dir(guild.id);
    console.dir(guildMap.get(guild.id));
    console.dir(addUser);*/

    if(guildMap.has(guild.id)){
        let temp = guildMap.get(guild.id);
    
        console.dir('--------------ADD-------------');
        temp.push(addUser);
        console.dir('-----' + guild.id + '---------CURRENT SIZE = ' + temp.length + '------' + addUser.user.username + '-------');
        guildMap.set(guild.id, temp);
    }

    /*console.dir('--------------ADD-------------');
    console.dir(addUser.user.username);
    console.dir('--------------ADD DONE-------------');
    console.dir('--------------CURRENT SIZE = ' + memberList.length + '-------------');*/
    },

    removeUserFromList: async function (newPresence){
        const guild = await newPresence.client.guilds.fetch(newPresence.guild.id);

        const removeUser = await guild.members.fetch(newPresence.userId);
        let index = '';
        //memberList.splice(index, 1);

        if(guildMap.has(guild.id)){
            let temp = guildMap.get(guild.id);
            index = temp.indexOf(removeUser);;
            temp.splice(index, 1);
            console.dir('------' + guild.id + '--------CURRENT SIZE = ' + temp.length + '------' + removeUser.user.username + '-------');
        }

        /*console.dir('------------REMOVE-------------');
        console.dir(removeUser.user.username);
        console.dir('------------REMOVE DONE-------------');
        console.dir('--------------CURRENT SIZE = ' + memberList.length + '-------------');*/

    },

    //checks if user is in the list
    userInList: async function (newPresence) {
        console.log('------------------------------------------------');
        //console.log(newPresence);
        console.log('------------------------------------------------');
        const guild = await newPresence.client.guilds.fetch(newPresence.guild.id);
        const addUser = await guild.members.fetch(newPresence.userId);
        let index = '';

        if(guildMap.has(guild.id)){
            let temp = guildMap.get(guild.id);
            index = temp.indexOf(addUser);
        }



        if(index === -1){
            return false;
        }else{
            return true;
        }
    }
}

function checkForMembersActivity(memberList){

    let timeDif = '';
    //console.dir(currentTime);
    loop();

    function loop() {
        console.log('Initiate search');

        memberList.forEach(member => {
            console.log(member.presence.activities[0]);
            //console.log(getFilepath(member.guild.id).toString() + '/' + musicStats.getDate().toString() + '.json');
            const activity = member.presence.activities.find(element => element.name === 'Spotify');
        
            const songInformation = {
                songName: activity.details,
                artist: activity.state,
                startTime: activity.timestamps.start,
                endTime: activity.timestamps.end,
                user: member.user.username
            }
        
            timeDif = activity.timestamps.end.getHours() + ':' + activity.timestamps.end.getMinutes();
            console.dir(timeDif);
            songList.push(songInformation);
            saveDataToFile(songList, member.guild.id);

        });
        setTimeout(() => {loop();}, 60000);// körs varje minut.

    }


}

function saveDataToFile(dataObject, guildId){
    createFolder(guildId);
    console.log('------------------------------------------------');
    console.log(dataObject);
    console.log('------------------------------------------------');
    //If the file doesn't exist splice the array containing all songs to start fresh on a new day
    if(!fs.existsSync('./' + getFilepath(guildId).toString() + '/' + musicStats.getDate().toString() + '.json')){
        dataObject.splice(0, dataObject.length);
        //dataObject.push('[]');
    }
    fs.writeFile(path.join(__dirname, getFilepath(guildId), musicStats.getDate() + '.json'), JSON.stringify(dataObject, null, 4), { flag: 'w+' }, err => {})
}

function createFolder(guildId){
    try {
        if (!fs.existsSync(getFilepath(guildId))) {
            fs.mkdirSync(getFilepath(guildId), {recursive: true})
        }
      } catch (err) {
        console.error(err);
    }
}
