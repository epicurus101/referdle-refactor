import { Board, storage, uColours } from "./contents.js";

const boardManager = {
    current: null,
    boards: [],

    createBoards: function() {
        // console.log("creating boards")
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
        // console.log(boards)
        storage.saveCurrentState(boardManager.boards, daily);
        console.log(`we saved a ${daily ? "daily" : "practice"} puzzle`)
    }


}

export {boardManager}

document.addEventListener('boardSelect', (e) => {
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
});