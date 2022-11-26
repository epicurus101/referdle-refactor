import { Board, storage, uColours, keyboard, logic, dictionary, gameManager } from "./contents.js";

const boardManager = {
    current: null,
    boards: [],
    createBoards: function() {
        const container = document.getElementById("board-container");
        for (let i = 0; i < 6; i++) {
            const newB = new Board(i);
            container.appendChild(newB.boardDiv);
            boardManager.boards.push(newB);
        }
    },
    reset: function(){
        boardManager.boards.forEach(element => {
            element.resetBoard()
        });
        boardManager.current = null;
    },
    loadFromSave: function(daily){
        storage.loadCurrentState(boardManager.boards,daily)
    },
    cycle: function(){
        let curr = (boardManager.current != null) ? boardManager.current.index : 0;
        curr += 1;
        if (curr > 5) {
            curr = 1;
        }
        boardManager.current = boardManager.boards[curr];
        while (boardManager.current.success) {
            curr += 1
            if (curr > 5) {
                curr = 1;
            }
            boardManager.current = boardManager.boards[curr];
        }
        boardManager.current.boardDiv.onclick();
        let sq = ((boardManager.current.guessedWords.length - 1) * 5) + 1;
        document.getElementById(`b${curr}-${sq}`).scrollIntoView(false);
    },
     loadPuzzle: function(puzzle, daily) {
        console.log(puzzle)
        boardManager.boards[0].setClueGrid(puzzle);
        for (let i = 1; i < boardManager.boards.length; i++) {
            const element = boardManager.boards[i];
            element.setTarget(puzzle[i - 1])
        }
        storage.saveCurrentState(boardManager.boards, daily);
    },
    intelligentExclusion(letter,bool) {
        let index = boardManager.current.index
        if (index == 5) { return }
        for (let i = index + 1; i < 6; i++) {
            if (boardManager.boards[i].guessedWordCount > 0) {
                return
            }
        }
        // confirmed that remaining boards are clean!
        for (let i = index+1; i < 6; i++) {
            if (bool) {
                boardManager.boards[i].excluded.add(letter)
            } else {
                boardManager.boards[i].excluded.delete(letter)
            }
        }
    },
    handleSubmitWord: function(dailyMode){
        let board = boardManager.current
        const currentWordArr = board.getCurrentWordArr();
        const targetWordArr = board.getTargetWordArr();
        const currentWord = currentWordArr.join("");
        const comparisonResult = logic.getComparison(currentWordArr, targetWordArr);

        if (currentWordArr.length !== 5) {
            const event = new CustomEvent('showDictPopup', {
                detail: {
                    board: board,
                    message: "MUST BE FIVE LETTERS"
                }
            });
            document.dispatchEvent(event);
            return;
        } else if (!dictionary.words.includes(currentWord) && currentWord != board.targetWord) {
            const event = new CustomEvent('showDictPopup', {
                detail: {
                    board: board,
                    message: "NOT IN DICTIONARY"
                }
            });
            document.dispatchEvent(event);
            return;
        }
        const interval = 200;
        board.flipTiles(interval, comparisonResult);

        setTimeout(boardManager.revealTruth, interval * 6, comparisonResult, board.index);

        if (currentWord === board.targetWord) {
            board.success = true;
            board.guessedWordCount += 1;
            storage.saveCurrentState(boardManager.boards, dailyMode);
         //   setTimeout(keyboard.update, interval * 6, board);
            if (boardManager.allBoardsComplete()) {
                console.log("win state!")
                keyboard.allowInput = false;
                boardManager.clearAllHighlighting()
                setTimeout(gameManager.handleWin, interval * 8);
            } else {
                console.log("cycle")
                boardManager.cycle();
            }
        } else if (board.guessedWords.length === 5) {
            board.guessedWordCount = 5;
            storage.saveCurrentState(boardManager.boards, dailyMode);
            keyboard.allowInput = false;
            boardManager.clearAllHighlighting();
            setTimeout(gameManager.handleLoss, interval * 8);
        } else {
            setTimeout(keyboard.update, interval * 6, board);
            board.next();
            storage.saveCurrentState(boardManager.boards, dailyMode);
        }
    },
    revealTruth: function(comparisonResult, index) {
        boardManager.boards[0].revealTruth(comparisonResult, index - 1);
    },
     allBoardsComplete: function() {
        console.log('checking completion')
        for (let i = 1; i < boardManager.boards.length; i++) {
            const board = boardManager.boards[i];
            if (!board.success) {return false}
        }
        return true
    },
    clearAllHighlighting: function() {
        for (let i = 1; i < boardManager.boards.length; i++) {
            const element = boardManager.boards[i];
            element.boardDiv.style.borderColor = uColours.darkGrey;
        }
        boardManager.boards[0].fullOpacity();
    },
     totalGuesses: function() {
        let total = 0
        let boards = boardManager.boards
        for (let i = 1; i < boards.length; i++) {
            const board = boards[i];
            total += (board.guessedWordCount)
        }
        return total;
    }

}

export {boardManager}

document.addEventListener('boardSelect', (e) => {
    console.log('board clicked!')
    const num = e.detail.index;
    const board = boardManager.boards[num]
    if (num == 0 || board.success) { return }
    for (let i = 1; i < boardManager.boards.length; i++) {
        const element = boardManager.boards[i];
        element.boardDiv.style.borderColor = uColours.darkGrey;
    }
    board.boardDiv.style.borderColor = uColours.offWhite;
    boardManager.current = board;
    boardManager.boards[0].highlightRow(e.detail.index - 1);
    keyboard.reset();
    keyboard.update(board);
    // console.log(board);
});

document.addEventListener('excludeLetter', (e) => {
    let letter = e.detail.letter
    if (boardManager.current.excluded.has(letter)) {
        boardManager.current.excluded.delete(letter)
        boardManager.intelligentExclusion(letter, false)
    } else {
        boardManager.current.excluded.add(letter)
        boardManager.intelligentExclusion(letter, true)
    }
    keyboard.reset();
    keyboard.update(boardManager.current);
});

document.addEventListener('letterKey', (e) => {
    let letter = e.detail.letter
    boardManager.current.updateGuessedWords(letter)
})

document.addEventListener('delete', (e) => {
    boardManager.current.handleDelete()
})

