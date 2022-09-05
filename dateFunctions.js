

module.exports = {

    getDate: function(){
       return new Date().toLocaleDateString('sv-SE');
    },

    getMonth: function(){
        return new Date().getMonth() + 1;
    },

    getYear: function(){
        return new Date().getFullYear();
    },

    getTodaysDay: function(){
        return new Date().getDay();
    },

    getLastMonth: function(){
        console.log("TEST");
        console.log(new Date().getMonth());
        return new Date().getMonth();
    }
}


