
const process = {
    saveStatus: function(save){
        // console.log(save)
        let boards = []
        for (let i = 0; i < save.length; i++) {
            const board = save[i];
            // console.log("here's the board", board)
            let result = process.boardStatus(board)
            // console.log("status: ", result)
            boards.push(result)
        }
        if (boards.includes("failed")) {
            return "failed"
        } else if (boards.includes("playable")) {
            return "playable"
        } else {
            return "completed"
        }
    },
    boardStatus: function(board){
        if (board.guessedWords.length == 0) {return "playable"}
        let lastWord = board.guessedWords.at(-1).join("")
        if (lastWord == board.targetWord) {
            return "completed"
        } else if (board.guessedWords.length == 5) {
            return "failed"
        } else {
            return "playable"
        }
    },
    calculateStreak: function (stats) {
        console.log('calculate streak using:', stats)
        let current = null
        let streak = 0
        let max = 0
        for (let i = stats.length - 1; i >= 0; i--) {
            if ((stats[i] == "X" || stats[i] == "B") && current == null) {
                current = streak // store one and only one value
                streak = 0
            } else if (stats[i] == "X" || stats[i] == "B") {
                streak = 0
            } else {
                streak += 1
                max = Math.max(streak,max)
            }
        }
        return {current: streak, max: max}
    },
    boardToObject: function (board) {
        let object = {};
        object.targetWord = board.targetWord;
        object.guessedWords = JSON.parse(JSON.stringify(board.guessedWords));
        if (object.guessedWords.length > board.guessedWordCount) {
            object.guessedWords.pop()
            object.guessedWords.push([]) //cleanup half words!
        }
        object.excluded = Array.from(board.excluded);
        object.guessedWordCount = board.guessedWordCount;

        return object;
    },


}

export {process}