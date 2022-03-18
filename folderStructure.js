const { getMonth, getYear } = require("./musicStats")

let folderName = 'Data/'

module.exports = {
getFilepath: function (guildId){
  //console.log(guildId);
  return folderName +  guildId + '/' + getYear() + '/' + getMonth();
},

}