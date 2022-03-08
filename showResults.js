const fs = require('fs');
const musicStats = require('./musicStats.js');
const { getFilepath } = require('./folderStructure.js');
const cron = require('node-cron');
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

            if(resultRatio === 'result_monthly'){
                cron.schedule('0 0 1 * *', function() {
                    console.log('running a task every minute');
                });
            }
            if(resultRatio === 'result_weekly'){
                cron.schedule('0 0 0 0 5', function() {
                    //Doesn't do anything atm
                });
            }
            if(resultRatio === 'result_biweekly'){
                cron.schedule('0 0 14 * *', function() {
                    //Doesn't do anything atm
                });
                cron.schedule('0 0 28 * *', function() {
                    //Doesn't do anything atm
                });

            }
            return true;
        }

    },
}