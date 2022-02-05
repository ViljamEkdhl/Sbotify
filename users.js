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
    

    //Byt nedanstående fetch() till newPresence.guild.id istället för hårdkodad id
    const guild = await newPresence.client.guilds.fetch('271314305822097409');

    const addUser = await guild.members.fetch(newPresence.userId);
    const index = memberList.indexOf(addUser);
    console.dir(index);

    //Epic best practice
    if(index >= 0){
        //Do nothing
    }else{
        memberList.push(addUser);
    }


    console.dir('--------------ADD-------------');
    console.dir(memberList);
    },

    removeUserFromList: async function (newPresence){
        const guild = await newPresence.client.guilds.fetch('834009667884941323');

        const removeUser = await guild.members.fetch(newPresence.userId);
        const index = memberList.indexOf(removeUser);
        memberList.splice(index, 1);
        console.dir('------------REMOVE-------------');
        console.dir(memberList);

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

            console.log(member.presence.activities[0])
        
            const songInformation = {
                songName: member.presence.activities[0].details,
                artist: member.presence.activities[0].state,
                startTime: member.presence.activities[0].timestamps.start,
                endTime: member.presence.activities[0].timestamps.end,
                user: member.user.username
            }
        
            timeDif = member.presence.activities[0].timestamps.end.getHours() + ':' + member.presence.activities[0].timestamps.end.getMinutes();
            console.dir(timeDif);
            musicStats.addSongToStats(songInformation);
        });
        setTimeout(() => {loop();}, 60000);// körs varje minut.

        //Lägg detta i en try-catch och om den misslyckas 
    }


}
