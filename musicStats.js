let SONGLIST = [];

module.exports = {

    addSongToStats: function (songInformation){
        SONGLIST.push(songInformation);

        console.dir(SONGLIST);
    }
}

