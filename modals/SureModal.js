import { uColours, Modal, common } from '../js/contents.js'

export class SureModal extends Modal {

    constructor(e) {
        super("sure-modal")
        this.replaceHeading("Abandon Game?")
        this.content.removeChild(this.span)
        this.modal.onclick = null;
        this.content.appendChild(document.createElement("br"))
        let text = document.createElement("div")
        text.textContent = `Abandoning the game counts as a loss in your statistics and will reset your streak.\r\n\r\nAre you sure you want to abandon this game?`
        text.classList.add("modal-body")
        this.content.appendChild(text)
        this.content.appendChild(document.createElement("br"))

        let h1 = document.createElement("div")
        h1.classList.add("button-holder")
        this.content.appendChild(h1)

        let b1 = document.createElement("div")
        b1.textContent = "Keep Playing"
        b1.style.backgroundColor = uColours.green
        b1.classList.add("sure-mode-button")

        let b2 = document.createElement("div")
        b2.textContent = "Abandon"
        b2.style.backgroundColor = uColours.yellow
        b2.classList.add("sure-mode-button")

        let buttons = [b1, b2]
        buttons.forEach(element => {
            h1.appendChild(element)
            console.log("changing a button")
            element.onclick = () => {

                console.log("clicked")
                element.style.color = uColours.black
                element.style.backgroundColor = uColours.yellow
                element.style.border = "1px solid rgb(0,0,0)"
                if (element.textContent == "Keep Playing") {
                    this.closeModal()
                } else if (element.textContent == "Abandon") {
                    this.closeModal()
                }
            }
        });

    }

    onOpen() {
        super.onOpen()
    }


    onClose() {
        super.onClose()

    }


}










// import { uColours, storage } from '../js/contents.js';

// const modal = document.getElementById("sureModal");

// document.addEventListener('showSureModal', () => {
//     modal.style.display = "block"
// })


// modal.style.display = "block"
// const content = modal.querySelector('.modal-content')
// const width = content.offSetWidth


// let buttons = modal.querySelectorAll(".sure-mode-button")
// console.log(buttons)
// buttons.forEach(element => {
//     console.log("changing a button")
//     element.style.fontSize = (width / 100) + 'px'
//     element.onclick = () => {

//         console.log("clicked")
//         element.style.color = uColours.black
//         element.style.backgroundColor = uColours.yellow
//         element.style.border = "1px solid rgb(0,0,0)"
//         if (element.textContent == "Back") {
//             modal.style.display = "none"
//         } else if (element.textContent == "Quit") {
//             modal.style.display = "none"
//             document.dispatchEvent(new CustomEvent('quitGame'));
//         }
//     }
// }); 

// modal.style.display = "none"