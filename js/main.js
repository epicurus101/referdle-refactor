import { uColours } from './contents.js';


document.addEventListener("DOMContentLoaded", () => {

    colourConform();
    playButtons();


    function colourConform() {
        var r = document.querySelector(':root');

        Object.keys(uColours).forEach(key => {
            r.style.setProperty('--' + key, uColours[key]);
        })
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
