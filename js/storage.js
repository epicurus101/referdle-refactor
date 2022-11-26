import { process } from "./contents.js";


const storage = {
    version: "1.06",
    initialise: function(){
        if (localStorage.getItem("storageVersion") != storage.version) {
            console.log('clearing data')
            localStorage.clear()
            localStorage.setItem("storageVersion", storage.version)
        }
    },
    doesKeyExist: function(str){
        let save = localStorage.getItem(str)
        return (save != null && save != "null")
    },
    returningPlayer: function(){
        return storage.doesKeyExist("returningPlayer")
    },
    rememberPlayer: function(){
        localStorage.setItem("returningPlayer", true)
    },
    saveExists: function(daily){
        return storage.doesKeyExist(daily ? "saveGame-D" : "saveGame-P")
    },
    getSave: function(daily){
        if (storage.saveExists(daily)){
            let save = localStorage.getItem(daily ? "saveGame-D" : "saveGame-P")
        //    console.log("here's the save we're getting: ", save)
            return JSON.parse(save)
        }
    },
    getLastDaily: function() {
        if (storage.doesKeyExist("lastDaily")) {
            return Number(localStorage.getItem("lastDaily"))
        } else {
            return -1
        }
    },
    updateDaily: function(day){
        localStorage.setItem("lastDaily", day)
    },
    getSaveStatus: function(daily) {
     //   console.log('getting status for daily?', daily)
        if (storage.saveExists(daily)) {
            return process.saveStatus(storage.getSave(daily))
        } else {
            return null
        }
    },
    getStreak: function(daily){
        let stats = storage.loadStats(daily)
        return process.calculateStreak(stats)
    },

    addToStats: function(item, daily){
        let stats = storage.loadStats(daily);
        stats.push(item);
        storage.saveStats(stats, daily);
    },

    saveStats: function(stats, daily){
        let str = JSON.stringify(stats);
        localStorage.setItem(daily ? "stats-D" : "stats-P", str);
    },
    
    loadStats: function(daily){
        let key = daily ? "stats-D" : "stats-P"
        if (storage.doesKeyExist(key)) {
            let save = localStorage.getItem(key)
      //      console.log('load stats', save)
            let parsed = JSON.parse(save)
   //         console.log('here is the parsed version', parsed)
            return parsed
        } else {
            return []
        }
    },

    saveCurrentState: function(boards, daily){
      //  console.log(`saving daily? ${daily}`, boards)
        let objectArray = [];
        for (let i = 1; i < boards.length; i++) {
            const board = boards[i];
            let object = process.boardToObject(board);
            objectArray.push(object);
        }
        let str = JSON.stringify(objectArray);
        let key = daily ? "saveGame-D" : "saveGame-P"
     //   console.log("saving a game with key ", key)
        localStorage.setItem(key, str);
    },

     loadCurrentState: function(boards, daily){  // needs to be carefully managed - ensure save is available
        let save = localStorage.getItem(daily ? "saveGame-D" : "saveGame-P");
        // console.log(save)
        let objectArray = JSON.parse(save);
        // console.log(objectArray)
        let targetWords = []
        for (let i = 0; i < objectArray.length; i++) {
            let saveData = objectArray[i];
            let board = boards[i+1];
            targetWords.push(saveData.targetWord);
            board.loadFromSave(saveData);
        }
        console.log(targetWords)
        boards[0].setClueGrid(targetWords);
        for (let i = 0; i < boards.length-1; i++) {
            let board = boards[i+1]; // only does 1 to 5
            let comparisons = board.getAllBoardComparisons();
            for (let z = 0; z < comparisons.length; z++) {
                const comparison = comparisons[z];
                boards[0].revealTruth(comparison, i)
            }
        }
        return true;
    },
     deleteSave: function(daily){
        localStorage.setItem(daily ? "saveGame-D" : "saveGame-P", null);
    }
}


export {storage}






