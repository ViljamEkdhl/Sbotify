const { Presence } = require('discord.js');
const musicStats = require('./musicStats.js');

let memberList = [];

module.exports = {

    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'initiate'){
        await checkForMembersActivity(memberList);
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
        memberList.forEach(member => {
            console.log(member.presence.activities[0]);
            const activity = member.presence.activities.find(element => element.name === 'Spotify');

            //console.log(member.presence.activities[0])
        
            const songInformation = {
                songName: activity.details,
                artist: activity.state,
                startTime: activity.timestamps.start,
                endTime: activity.timestamps.end,
                user: member.user.username
            }
        
            timeDif = activity.timestamps.end.getHours() + ':' + activity.timestamps.end.getMinutes();
            console.dir(timeDif);
            musicStats.addSongToStats(songInformation);
        });
        setTimeout(() => {loop();}, 60000);// körs varje minut.

        //Lägg detta i en try-catch och om den misslyckas 
    }


}
