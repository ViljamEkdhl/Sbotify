const fs = require('fs');
const musicStats = require('./musicStats.js');
const { getFilepath } = require('./folderStructure.js');
const cron = require('node-cron');
var resultRatio;

module.exports = {

    //Creates a array with all the data from the last month and displays it on the server
    displayMusicTierList: function (){
        let dirname = getFilepath().toString();
        let unfilteredData = [];
        const filenames = fs.readdirSync(dirname);

        filenames.forEach(file => {
            var readFile = fs.readFileSync(dirname + '/' + file.toString()).toString();
            unfilteredData = unfilteredData.concat(JSON.parse(readFile));
            
        })
        //console.log(unfilteredData);
        filterMusicList(unfilteredData);
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
                    displayMusicTierList();
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

//Filters the music by checking at the startTime for every object in the array
//
async function filterMusicList(listToBeSorted){
    /*let uniqueStartTime = [... new Set(listToBeSorted)];
    console.log(uniqueStartTime);*/
    const uniqueIds = [];

    const unique = listToBeSorted.filter(element => {
        const isDuplicate = uniqueIds.includes(element.startTime);
        //console.log(isDuplicate);

        if (!isDuplicate) {
        uniqueIds.push(element.startTime);

        return true;
        }
        
    });
    console.log(unique);
}