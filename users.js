const { Presence } = require('discord.js');
const { returnDate, getMonth } = require('./musicStats.js');
const musicStats = require('./musicStats.js');
const fs = require('fs'); // Needed for folders
const path = require('path');
const { getFilepath } = require('./folderStructure.js');
const folderStructure = require('./folderStructure.js');

const guildMap = new Map();
let memberList = []; //list of all the members currently listening to spotify
//let songList = []; //list of all the songs

module.exports = {
   //Creates a list of users that is on the specific guild
    addUserToList: async function (newPresence){
        
    const guild = await newPresence.client.guilds.fetch(newPresence.guild.id);
    const addUser = await guild.members.fetch(newPresence.userId);

    memberList.push(addUser);

    console.dir('--------------ADD-------------');
    console.dir(addUser.user.username);
    console.dir('--------------ADD DONE-------------');
    console.dir('--------------CURRENT SIZE = ' + memberList.length + '-------------');
    },

    removeUserFromList: async function (newPresence){
        const guild = await newPresence.client.guilds.fetch(newPresence.guild.id);

        const removeUser = await guild.members.fetch(newPresence.userId);
        const index = memberList.indexOf(removeUser);
        let userId = removeUser.user.id;
        let guildId = removeUser.guild.id;
        console.log(memberList.indexOf(removeUser));


        for (let i = 0 ; i < memberList.length; i++) {
            if (memberList[i].user.id === userId && memberList[i].guild.id === guildId) {
                memberList.splice(i, 1);
                console.dir('------------REMOVE-------------');
                console.dir(removeUser.user.username);
                console.dir('------------REMOVE DONE-------------');
                console.dir('--------------CURRENT SIZE = ' + memberList.length + '-------------');
                break;
            }
        }

    },

    //checks if user is in the list
    userInList: async function (newPresence) {
        //console.log(newPresence);
        const guild = await newPresence.client.guilds.fetch(newPresence.guild.id);
        const addUser = await guild.members.fetch(newPresence.userId);
        let index = memberList.indexOf(addUser);
        let userId = addUser.user.id;
        let guildId = addUser.guild.id;

        if(memberList.length === 0 ){return false};

        for(const member of memberList){

            if(member.user.id === userId && member.guild.id === guildId){
                return true;
            }
        }
        return false;

    },

    initiate: async function(guilds){

        for(const key of guilds.keys()){
            if(!guildMap.has(key)){
                guildMap.set(key, {
                    songList: [], 
                    guildChannel: '', 
                    resultRatio: '',
                    cronJob: ''
                })
            }
        }
        console.log(guildMap);
        await checkForMembersActivity(memberList);
    },

    getGuildMap: function(){
        return guildMap;
    }
}

function checkForMembersActivity(memberList){

    let timeDif = '';
    //console.dir(currentTime);
    loop();



    function loop() {
        //console.log('Initiate search');
        //console.dir(guildMap);

        memberList.forEach(member => {
            
        try {
            //console.log(member.presence.activities[0]);
            const activity = member.presence.activities.find(element => element.name === 'Spotify');
        
            const songInformation = {
                songName: activity.details,
                artist: activity.state,
                startTime: activity.timestamps.start,
                endTime: activity.timestamps.end,
                user: member.user.username
            }
        
            timeDif = activity.timestamps.end.getHours() + ':' + activity.timestamps.end.getMinutes();
            //console.dir(timeDif);

            if(guildMap.has(member.guild.id) === false){
                guildMap.set(member.guild.id, {songList: [], guildChannel: '', resultRatio: '', cronJob: ''});
                console.log('ADDING NEW SERVER TO guildMAP');
                //console.log(guildMap);
            }

            if(guildMap.has(member.guild.id)){
                let temp = guildMap.get(member.guild.id);
                //console.dir(temp);
                temp.songList.push(songInformation);
                saveDataToFile(temp, member.guild.id);
            }
        } catch (error) {
            console.log(error);
        }

        });
        setTimeout(() => {loop();}, 60000);// körs varje minut.
    }
}

function saveDataToFile(dataObject, guildId){
    createFolder(guildId);

    //If the file doesn't exist splice the array containing all songs to start fresh on a new day
    if(!fs.existsSync('./' + getFilepath(guildId).toString() + '/' + musicStats.getDate().toString() + '.json')){
        console.log(dataObject);
        //dataObject.songList.splice(0, dataObject.length);
        dataObject.songList = [];
        //dataObject.push('[]');
    }
    fs.writeFile(path.join(__dirname, getFilepath(guildId), musicStats.getDate() + '.json'), JSON.stringify(dataObject.songList, null, 4), { flag: 'w+' }, err => {})
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
