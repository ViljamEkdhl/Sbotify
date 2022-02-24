let SONGLIST = [];

module.exports = {

    addSongToStats: function (songInformation){
        SONGLIST.push(songInformation);

        console.dir(SONGLIST);
    },

    getDate: function(){
       return new Date().toLocaleDateString('sv-SE');
    },

    getMonth: function(){
        return new Date().getMonth() + 1;
    },

    getYear: function(){
        return new Date().getFullYear();
    }
}


