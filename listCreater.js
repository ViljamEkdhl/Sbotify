

module.exports = {
    filterMusicList: function(listToBeSorted){
        const uniqueIds = [];

        const unique = listToBeSorted.filter(element => {
            const isDuplicate = uniqueIds.includes(element.startTime);
    
            if (!isDuplicate) {
                uniqueIds.push(element.startTime);
    
                return true;
            }
    
        });
        //console.log(unique);
        return unique;
    },
    composeTopTenList: function(sortedList){
        const topTen = [];
        //console.log(sortedList);

        for (const song of sortedList) {
            const isDuplicate = topTen.findIndex(object => {
                return object.songName === song.songName;
            });
            //console.dir(isDuplicate);

            if (isDuplicate === -1) {
                topTen.push({
                    songName: song.songName,
                    artist: song.artist,
                    startTime: song.startTime,
                    count: 1
                })
            } else {
                const index = topTen.findIndex(object => {
                    return object.songName === song.songName;
                });

                if (index !== -1) {
                    topTen[index].count = topTen[index].count + 1;
                }
            }

        }
        topTen.sort((b, a) => a.count - b.count);
        topTen.splice(10, topTen.length);
        return topTen;
    }
}