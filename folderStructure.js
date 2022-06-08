const { getMonth, getYear, getTodaysDay } = require("./musicStats")

let folderName = 'Data/'

module.exports = {
getFilepath: function (guildId){
  //console.log(guildId);
  return folderName +  guildId + '/' + getYear() + '/' + getMonth();
},
getFilepathLlastMonth: function (guildId){
  //console.log(guildId);
  return folderName +  guildId + '/' + getYear() + '/' + (getMonth() - 1);
},
getFilepathLastDay: function(guildId){
return folderName + guildId + '/' + getYear() + '/' + getMonth() + '/' +  getTodaysDay();
}
}