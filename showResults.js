const fs = require('fs');
const musicStats = require('./musicStats.js');
const { getFilepath } = require('./folderStructure.js');

module.exports = {

    displayMusicTierList: function (){
        var test = fs.readFileSync(getFilepath().toString() + '/' + musicStats.getDate().toString() + '.json').toString();
        var tierList = JSON.parse(test);
        console.log(tierList);
    },
}