import { Modal, statElement, common, storage} from '../js/contents.js'

export class EndGameModal extends Modal {

    daily;

    constructor(e) {
        super("endGameModal")
        this.replaceHeading("Game Over")

        this.daily = e.detail.daily
        this.addText(e.detail.win, e.detail.guesses, e.detail.daily, e.detail.boards);
        statElement.sideW = common.width * 0.6;
        statElement.sideH = statElement.sideW * 0.5;

        let textBoxes = statElement.getTextBoxes(e.detail.daily)
        this.content.appendChild(textBoxes)
        let graph2 = statElement.getGraph(e.detail.daily)
        this.content.appendChild(graph2);

        let button = document.createElement("div")
        button.setAttribute("id", "share-button")
        button.onclick = (e2) => {
            e2.stopPropagation();
            document.dispatchEvent(new CustomEvent(`showCopiedPopup`, {detail: {
                modal: self.modal,
            }}));
            let result = storage.loadResult(e.detail.daily)
            let shareText = result.getText()
            navigator.clipboard.writeText(shareText);
            if (common.developerMode) { console.log(shareText) }
        }
        this.content.appendChild(button)
        button.style.height = common.width * 0.075 + 'px'

        let label = document.createElement("label")
        label.htmlFor = "share-button"
        label.innerHTML = "Share result"
        label.style.fontSize = common.width * 0.03 + 'px'
        button.appendChild(label)

        const img = new Image();
        img.src = "images/share.png"
        let size = common.width * 0.1 + 'px'
        img.style.display = "inline-block"
        img.style.width = size
        img.style.height = size
        img.style.margin = "0px"
        button.appendChild(img)
    }

    onOpen() {
        let board = document.getElementById("board-container")
        board.style.filter = "blur(10px)"
    }


    onClose() {
        super.onClose()
        let board = document.getElementById("board-container")
        board.style.filter = "blur(0)"
        document.dispatchEvent(new CustomEvent("reviewMode", {
            detail:
                { daily: self.daily }
        }))
    }

    addText(win, guesses, daily, boards) {

        const text1 = document.createElement("div")
        text1.classList.add("modal-body")
        this.content.appendChild(text1)

        if (win == true) {
            let mode = daily ? "the Daily Referdle" : "a Practice Referdle"
            text1.textContent = `\r\nYou completed ${mode} in ${guesses}/25 guesses`
        } else {
            text1.textContent = `\r\nThe answers were ${boards[1].targetWord.toUpperCase()}, ${boards[2].targetWord.toUpperCase()}, ${boards[3].targetWord.toUpperCase()}, ${boards[4].targetWord.toUpperCase()} and ${boards[5].targetWord.toUpperCase()}\r\nYou can keep on playing in Practice Mode`
        }

    }

}




