const fs = require('fs');
const musicStats = require('./musicStats.js');
const { getFilepath } = require('./folderStructure.js');
var resultRatio;

module.exports = {

    displayMusicTierList: function (){
        var test = fs.readFileSync(getFilepath().toString() + '/' + musicStats.getDate().toString() + '.json').toString();
        var tierList = JSON.parse(test);
        console.log(tierList);
    },

    //This function changes the intervalls for the music top 10 list.
    //So far you can only pick Weekly, BiWeely and Monthly
    //Returning true means that the change was successfull and false means that the change wasn't possible.
    changeRatio: function (Interaction){
         
        if(Interaction.options.getString('settings') === resultRatio){
            return false;
        }else{
            resultRatio = Interaction.options.getString('settings');
            return true;
        }

    },
}