
const { setMusiclist } = require('./storage.js');
let memberList = [];

module.exports = {
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
        checkForMembersActivity: function(){

            let timeDif = '';
            //console.dir(currentTime);
            loop();
        
             function loop() {
                //console.log('Initiate search');
                //console.dir(guildMap);
        
                memberList.forEach(async member => {
                    
                try {
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

                    //let object = getMusiclist(member.guild.id);
                    //object.push(songInformation);

                    setMusiclist(member.guild.id, songInformation);

        
                } catch (error) {
                    /*const test = (await member.fetch(true)).presence;
                    console.log('PRESENCE.ACTIVITIES');
                    console.log(member.user.username);
                    console.log(member.presence);
                    console.log(test);*/
                    console.log(error);
                }
        
                });
                setTimeout(() => {loop();}, 60000);
            }
        }    
}

async function reFetch(member){
    console.log('PRESENCE.ACTIVITIES');
    //console.log((await member.fetch(true)))
    
    const test = (await member.fetch(true)).presence;
    console.log(test);
}

