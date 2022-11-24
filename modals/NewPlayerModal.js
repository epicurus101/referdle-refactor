import { Modal, common } from '../js/contents.js'

export class NewPlayerModal extends Modal {

    constructor(e) {
        super("new-modal")
        this.content.removeChild(this.header)
     //   this.replaceHeading("Welcome to Referdle!")

        let holder = document.createElement("div")
        holder.style.display = "flex"
        holder.style.alignItems = "center"
        holder.style.justifyItems = "flex-start"
        holder.style.justifyContent = "flex-start"
        this.content.appendChild(holder)

        const img = new Image();
        img.src = "images/cluebot_circle.png"
        img.classList.add("modal-image")
        img.style.width = "25%"
        img.style.margin = "0px"
        img.style.marginRight = "5%"
        img.style.display = "inline-block"
        holder.appendChild(img)

        let head = document.createElement("h2")
        head.textContent = "Welcome to Referdle!"
        head.style.display = "inline-block"
        holder.appendChild(head)

        console.log(img.offsetHeight, img.offsetWidth)

        // let computed = window.getComputedStyle(holder)
        // console.log(computed.offsetHeight, computed.offsetWidth)

        const text1 = document.createElement("div");
        text1.classList.add("modal-body");
        this.content.appendChild(text1)
        text1.textContent = `Cluebot loves to play Wordle. Cluebot just sent you the grid they solved today with all the letters removed.`
            + `\r\n\r\n`

        let br2 = document.createElement("div")
        br2.classList.add("break")
        this.content.appendChild(br2)

        const text2 = document.createElement("div");
        text2.classList.add("modal-body");
        text2.textContent = `Your task is to work out each word that Cluebot guessed, by guessing valid five-letter words. Read the 'How to Play' section in the menu for more!\r\n\r\n`
        this.content.appendChild(text2)

        const img2 = new Image();
        img2.src = "images/grid_connect.png"
        console.log(img2)
        img2.classList.add("modal-image")
        this.content.appendChild(img2)

    }

    onOpen() {
        super.onOpen()
    }


    onClose() {
        super.onClose()

    }


}

