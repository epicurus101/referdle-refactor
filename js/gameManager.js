import { storage, keyboard, boardManager, puzzles, logic, modalManager } from "./contents.js"

const gameManager = {
    firstDay: new Date("2 Nov 2022"),
    dailyMode: null,
    startup: function () {


        let buttons = document.querySelectorAll(".play-mode-button")
        if (gameManager.isGameInProgress(true) || gameManager.isDailyAvailable()) {
            buttons[0].onclick()
        } else {
            buttons[1].onclick()
        }
        if (!storage.returningPlayer()) {
            modalManager.new()
            storage.rememberPlayer()
        }

    },


    //put housekeeping here - void function
    processDaily: function () {
        let status = storage.getSaveStatus(true)
        let dayDiff = gameManager.getDay() - storage.getLastDaily()

        if (dayDiff == 1) { //played it yesterday
            if (status == "playable") {
                storage.addToStats("X", true) // you didn't finish! so counts as an X
            }
            storage.deleteSave(true) // always delete yesterday's save
        } else if (dayDiff > 1) {
            if (status == "playable") {
                storage.addToStats("X", true) // you didn't finish! so counts as an X
            } else {
                storage.addToStats("B", true) //B represents a break but shouldn't affect % game stats
            }
            storage.deleteSave(true) // always delete old saves
        }
    },

    processPractice: function () {
        let status = storage.getSaveStatus(false)
        if (status == "completed" || status == "failed") {
            storage.deleteSave(false)
        }
    },

    isGameInProgress: function (daily) {
        return (storage.getSaveStatus(daily) == "playable")
    },

    isDailyAvailable: function () { // have I completed the daily yet?
        let day = gameManager.getDay();
        let dayDiff = day - storage.getLastDaily()
        console.log("dayDiff is ", dayDiff)
        if (dayDiff == 0) {
            return false
        } else {
            return true
        }
    },
    getDay: function () {
        const today = new Date().getTime();
        const diff = today - gameManager.firstDay;
        const daysDiff = Math.floor(diff / (24 * 60 * 60 * 1000));
        return daysDiff;
    },
    //call this whenever loading a new daily
    updateDaily: function () { //consider use of globals to avoid this bs?!
        let day = gameManager.getDay()
        storage.updateDaily(day)
    },

    resetGame: function () {
        keyboard.reset();
        boardManager.reset();
        document.getElementById(`b1-1`).scrollIntoView(false);
        keyboard.allowInput = true;
    },
    enterDaily: function () {
        gameManager.processDaily()
        if (gameManager.isGameInProgress(true)) {
            console.log("daily in prog")
            boardManager.loadFromSave(true)
            boardManager.cycle();
        } else if (gameManager.isDailyAvailable()) { // still need to work through this!!!
            console.log('new daily')
            let puzzle = puzzles.get(gameManager.getDay());
            puzzle.forEach((word, index) => { puzzle[index] = word.toUpperCase() })
            boardManager.loadPuzzle(puzzle, true)
            gameManager.updateDaily()
            boardManager.cycle();
        } else {
            console.log('old daily')
            boardManager.loadFromSave(true)
            keyboard.allowInput = false;
            boardManager.clearAllHighlighting()
            const event = new CustomEvent('reviewMode', { detail: { daily: true } });
           // document.dispatchEvent(event)
            setTimeout(() => {document.dispatchEvent(new CustomEvent("reviewMode", {
                detail:
                    { daily: true }
            }))}, 1 );
        }
    },
    enterPractice: function () {
        gameManager.processPractice()
        keyboard.allowInput = true
        if (gameManager.isGameInProgress(false)) {
            boardManager.loadFromSave(false)
            boardManager.cycle();
        } else {
            let puzzle = logic.newPuzzle();
            boardManager.loadPuzzle(puzzle, false);
            boardManager.cycle();
        }
    },
     handleWin: function() {
        console.log('winning')
        let guesses = boardManager.totalGuesses()
        let daily = gameManager.dailyMode
        storage.addToStats(guesses, gameManager.dailyMode)
        let streak = storage.getStreak(daily).current
        const event = new CustomEvent('endGame', {
            detail: {
                win: true,
                guesses: guesses,
                boards: boardManager.boards,
                streak: streak,
                daily: daily,
                dailyNo: gameManager.getDay(),
            }
        });
        document.dispatchEvent(event);
        console.log('event dispatched')
    },
    handleLoss: function() {
        console.log('lost')
        let guesses = boardManager.totalGuesses()
        let daily = gameManager.dailyMode
        storage.addToStats("X", gameManager.dailyMode)
        let streak = storage.getStreak(daily).current
        const event = new CustomEvent('endGame', {
            detail: {
                win: false,
                guesses: guesses,
                boards: boardManager.boards,
                streak: streak,
                daily: daily,
                dailyNo: gameManager.getDay(),
            }
        });
        document.dispatchEvent(event);
    }

}

export { gameManager }

document.addEventListener('switchMode', (e) => {
    let daily = (e.detail.to == "Daily")
    if (daily != gameManager.dailyMode) { // only respond to change
        gameManager.dailyMode = daily
        gameManager.resetGame()
        if (daily) {
            gameManager.enterDaily()
        } else {
            gameManager.enterPractice()
        }
    }
})

document.addEventListener('submit', (e) => {
    boardManager.handleSubmitWord(gameManager.dailyMode)
})

document.addEventListener('newPractice', (e) => {
    gameManager.resetGame()
    gameManager.enterPractice()
})