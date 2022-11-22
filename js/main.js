import { uColours, keyboard, boardManager, dictionary, puzzles, storage, gameManager, common } from './contents.js';


document.addEventListener("DOMContentLoaded", () => {

    initialisation()

    async function initialisation(){
        colourConform();
        playButtons();
        keyboard.initialise();
        boardManager.createBoards();
        dimensionConform();
        storage.initialise();
        await puzzles.load();
        await dictionary.load();
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
