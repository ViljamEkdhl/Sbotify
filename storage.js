const { getDate, getMonth, getYear } = require("./dateFunctions");
const fs = require('fs'); // Needed for folders
const { dir } = require("console");

const cronMap = new Map();

module.exports = {
    getConfig: function(guildId){
        if(guildId === undefined){return};
        const dirPath = 'Configs/'

        try {
            if (fs.existsSync(dirPath + guildId.toString() + '.json')) {
                let configFile = fs.readFileSync(dirPath + guildId.toString() + '.json', {encoding: 'utf-8'});
                return JSON.parse(configFile);
            }
        } catch (error) {
            console.log(guildId + ' This guild doesnt have a configfile setup, do that by using the /command ');
        }

    },

    setConfig: function(guildId, config){
        const dirpath = 'Configs/';
        writeTofile(dirpath, config, guildId);
    },

    getMusiclist: function(guildId, startDate, endDate){
        const dirpath = 'Data/' + guildId + '/' + getYear() + '/' + getMonth();
        
        let unfilteredData = [];
        const filenames = fs.readdirSync(dirpath);

        filenames.forEach(file => {
            const readFile = fs.readFileSync(dirpath + '/' + file.toString()).toString();
            unfilteredData = unfilteredData.concat(JSON.parse(readFile));
        });

        return unfilteredData;
    },

    setMusiclist: function(guildId, musicList){
        const dirpath = 'Data/' +  guildId + '/' + getYear() + '/' + getMonth() + '/';
        writeTofile(dirpath, musicList, getDate());
    
    },

    getCronJob: function(guildId){
        const test = cronMap.get(guildId)
        console.log(cronMap);
        console.log('Test is = ' + test);
        return test;
    },

    setCronJob: function(guildId, cronJob){

        console.log('guildId = ' + guildId + ' cronjob is = ' + cronJob)
        cronMap.set(guildId, cronJob);
    }
}

function writeTofile(dirpath, content, fileName){
    createFolder(dirpath);
    fs.writeFileSync(dirpath + fileName  + '.json', JSON.stringify(content, null, 4), { flag: 'w+' }, err => {
        console.log(err);
    });
}

function createFolder(filePath){

    try {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, {recursive: true})
        }
      } catch (err) {
        console.error(err);
    }
}