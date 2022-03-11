const { Presence } = require('discord.js');
const { returnDate, getMonth } = require('./musicStats.js');
const musicStats = require('./musicStats.js');
const fs = require('fs'); // Needed for folders
const path = require('path');
const { getFilepath } = require('./folderStructure.js');
const { displayMusicTierList, changeRatio } = require('./showResults.js');
const showResults = require('./showResults.js');

let memberList = []; //list of all the members currently listening to spotify
let songList = []; //list of all the songs

module.exports = {

    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'initiate'){
        await checkForMembersActivity(memberList);
        showResults.displayMusicTierList(); // move this to show result because theres not meant to be an initiate command.
    };
    if(commandName === 'showresult'){
        console.log(Interaction.options.getString('settings'));
        if (changeRatio(Interaction) === false){
            await Interaction.reply('Unable to change setting due to it already being the active setting!');
        }else{
            await Interaction.reply('Setting was successfully changed!');
        }
    }
   },

   //Creates a list of users that is on the specific guild
    addUserToList: async function (newPresence){
    const guild = await newPresence.client.guilds.fetch('271314305822097409');
    const addUser = await guild.members.fetch(newPresence.userId);

    memberList.push(addUser);

    console.dir('--------------ADD-------------');
    console.dir(addUser.user.username);
    console.dir('--------------ADD DONE-------------');
    console.dir('--------------CURRENT SIZE = ' + memberList.length + '-------------');
    },

    removeUserFromList: async function (newPresence){
        const guild = await newPresence.client.guilds.fetch('271314305822097409');

        const removeUser = await guild.members.fetch(newPresence.userId);
        const index = memberList.indexOf(removeUser);
        memberList.splice(index, 1);
        console.dir('------------REMOVE-------------');
        console.dir(removeUser.user.username);
        console.dir('------------REMOVE DONE-------------');
        console.dir('--------------CURRENT SIZE = ' + memberList.length + '-------------');

    },

    //checks if user is in the list
    userInList: async function (newPresence) {
        const guild = await newPresence.client.guilds.fetch('271314305822097409');
        const addUser = await guild.members.fetch(newPresence.userId);
        console.log(addUser);
        const index = memberList.indexOf(addUser);
        console.log(index);

        if(index === -1){
            return false;
        }else{
            return true;
        }
    }
}

function checkForMembersActivity(memberList){
    let date = new Date();
    let currentTime = date.getHours() + ':' + date.getMinutes();

    let timeDif = '';
    //console.dir(currentTime);
    loop();

    function loop() {
        console.log('Initiate search');
        console.log(getFilepath().toString() + '/' + musicStats.getDate().toString() + '.json');
        memberList.forEach(member => {
            console.log(member.presence.activities[0]);
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
            saveDataToFile(songList);

        });
        setTimeout(() => {loop();}, 60000);// körs varje minut.

        //if sats för att kolla date-time och se när dagen tar slut för att kanske spara ner all data som samlats?
    }


}

function saveDataToFile(dataObject){
    createFolder();
    //If the file doesn't exist splice the array containing all songs to start fresh on a new day
    if(!fs.existsSync('./' + getFilepath().toString() + '/' + musicStats.getDate().toString() + '.json')){
        console.log('DATAOBJECT SIZE');
        console.log(dataObject.length);
        dataObject.splice(0, dataObject.length);
        dataObject.push('[]');
    }
    fs.writeFile(path.join(__dirname, getFilepath(), musicStats.getDate() + '.json'), JSON.stringify(dataObject, null, 4), { flag: 'w+' }, err => {})
}

function createFolder(){
    try {
        if (!fs.existsSync(getFilepath())) {
            fs.mkdirSync(getFilepath(), {recursive: true})
        }
      } catch (err) {
        console.error(err)
    }
}
