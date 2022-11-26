import { uColours, keyboard, boardManager, dictionary, derivatives, puzzles, storage, gameManager, common, logic } from './contents.js';


document.addEventListener("DOMContentLoaded", () => {

    initialisation()

    async function initialisation(){
        storage.initialise();
        colourConform();
        playButtons();
        keyboard.initialise();
        boardManager.createBoards();
        dimensionConform();
        await puzzles.load();
        await dictionary.load();
        await derivatives.load();
        gameManager.startup();
    }

    function colourConform() {
        var r = document.querySelector(':root');

        Object.keys(uColours).forEach(key => {
            r.style.setProperty('--' + key, uColours[key]);
        })
    }

    function dimensionConform(){
        let game = document.getElementById("game")
        common.height = game.offsetHeight
        common.width = game.offsetWidth
        var r = document.querySelector(':root');
        r.style.setProperty('--height', game.offsetHeight);
        r.style.setProperty('--width', game.offsetWidth)
        console.log(window.getComputedStyle(r).getPropertyValue("--custom"))

        let bc = document.getElementById("board-container")
        let sq = document.querySelector(".square")
        let board = boardManager.boards[1]
        let sqWidth = sq.offsetWidth
        bc.style.fontSize = sqWidth * 0.6 + 'px'
        r.style.setProperty(`--squareHeight`, sqWidth) // must first set square in order to measure deficit
        console.log('width is ', sqWidth)


        let container = document.getElementById("board-container")
        console.log(`container height: ${container.offsetHeight}`)
        console.log(`board height: ${board.boardDiv.offsetHeight}`)

        let shortfall = (3 * board.boardDiv.offsetHeight) - container.offsetHeight
        let maxReduction = sqWidth * 0.2 * 15
        let actualReduction = Math.max(Math.min(shortfall, maxReduction)/15,0)
        console.log(shortfall, maxReduction, actualReduction)
        let sqHeight = sqWidth - actualReduction
        r.style.setProperty(`--squareHeight`, sqHeight)

        if (shortfall < 0) {
            let heightAdjust = (shortfall * -1) / 3
            r.style.setProperty(`--keyHeightAdjust`, heightAdjust)
        }
    }

    function playButtons() {
        let buttons = document.querySelectorAll(".play-mode-button")
        buttons.forEach(element => {
            element.onclick = () => {
                console.log("clicked!")
                buttons.forEach(e => {
                    e.style.color = uColours.offWhite
                    e.style.backgroundColor = uColours.black
                    e.style.border = "0px"
                });
                element.style.color = uColours.black
                element.style.backgroundColor = uColours.yellow
                element.style.border = "1px solid rgb(0,0,0)"
                const event = new CustomEvent('switchMode', {
                    detail: {
                        to: element.textContent,
                    }
                });
                document.dispatchEvent(event);
            }
        });
    }

})
