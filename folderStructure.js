const { getMonth, getYear } = require("./musicStats")

const folderName = 'Data/'

module.exports = {
  getFilepath: function (){
    return folderName + getYear() + '/' + getMonth();
},

}