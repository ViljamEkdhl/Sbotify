let SONGLIST = [];

module.exports = {

    addSongToStats: function (songInformation){
        SONGLIST.push(songInformation);

        console.dir(SONGLIST);
    },

    getDate: function(){
       return date = new Date().toLocaleDateString('sv-SE');
    }
}


