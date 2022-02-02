const musicStats = require('./musicStats.js');

module.exports = {

    //Checks the type of "/"-Command and redirects to correct function
   validateCommand: async function (Interaction){

    if(!Interaction.isCommand()) return;

    const { commandName } = Interaction;

    if(commandName === 'initiate'){
        await createListOfMembers(Interaction);
    }
   }
}


//Creates a list of users that is on the specific guild
async function createListOfMembers(Interaction){

    const guild = await Interaction.client.guilds.fetch('834009667884941323');
    let memberlist = await guild.members.fetch();

    //Skapar en lista med användare där den filtrerar ut användare som är bottar, som inte har en presence/activities och som lyssnar på musik
    memberlist = guild.members.cache.filter(member => !member.user.bot && member.presence?.activities?.length && member.presence.activities[0].type === 'LISTENING');

    /*memberlist.forEach(member => {
        //console.dir(member.presence)
        console.log('-----------------------------------------------------------')
        console.dir(member.presence.activities)
    });*/

    checkForMembersActivity(memberlist);

}

function checkForMembersActivity(memberlist){
    let songName = '';
    let artist = '';
    let date = new Date();
    let currentTime = date.getHours() + ':' + date.getMinutes();

    let timeDif = '';
    console.dir(currentTime);

    //while(true){}
    memberlist.forEach(member => {
        console.log(member.presence.activities[0])

        const songInformation = {
            songName: member.presence.activities[0].details,
            artist: member.presence.activities[0].state,
            startTime: member.presence.activities[0].timestamps.start,
            endTime: member.presence.activities[0].timestamps.end
        }


        timeDif = member.presence.activities[0].timestamps.end.getHours() + ':' + member.presence.activities[0].timestamps.end.getMinutes();
        console.dir(timeDif);
        musicStats.addSongToStats(songInformation);
    });

}
