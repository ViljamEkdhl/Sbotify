const fs = require('fs'); // Needed for folders
const path = require('path');

let folderName = 'Configs/'

module.exports = {
  //Creates the "Configs" folder
  createConfigFolder: function (){
    try {
      if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }
},

//Creates a configfile for a guild
createGuildConfigFile: function(guildId){
  const dirPath = path.join(__dirname, folderName);

  fs.writeFile(dirPath + guildId, '', { flag: 'wx' }, function (err) {
    if (err) throw err;
    console.log('Configfile created for ' + guildId);
  });
},

saveGuildConfigs: function(){

}
}