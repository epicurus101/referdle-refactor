import { Modal, statElement, common, uColours, storage } from '../js/contents.js'

export class StatsModal extends Modal {

    graph
    textBoxes
    shareButton
    sideW = common.width * 0.6;

    constructor(e) {
        super("statsModal")
        this.replaceHeading("Statistics")
        this.content.appendChild(document.createElement("br"))

        let h1 = document.createElement("div")
        h1.classList.add("button-holder")
        this.content.appendChild(h1)

        let b1 = document.createElement("div")
        b1.textContent = "Practice"
        b1.classList.add("stat-mode-button")

        let b2 = document.createElement("div")
        b2.textContent = "Daily"
        b2.classList.add("stat-mode-button")

        let buttons = [b1,b2]

        buttons.forEach(element => {
            h1.appendChild(element)
            element.style.fontSize = (this.sideW / 20) + 'px'
            element.onclick = (e) => {
                if (e) {e.stopPropagation()}
                buttons.forEach(b => {
                    b.style.color = uColours.black
                    b.style.backgroundColor = uColours.offWhite
                });
                element.style.color = uColours.black
                element.style.backgroundColor = uColours.yellow
                self.clearContent()
                this.switchStats(element.textContent == "Daily")
                if (storage.resultExists(element.textContent == "Daily")) {
                    this.addShareButton(element.textContent == "Daily")
                }
            }
        }); 

        b1.onclick()

    }

    clearContent(bool) {
        if (this.graph) {
            this.content.removeChild(this.graph)
            this.graph = null
        }
        if (this.textBoxes) {
            this.content.removeChild(this.textBoxes)
            this.textBoxes = null

        }
        if (this.shareButton){
            this.content.removeChild(this.shareButton)
            this.shareButton = null
        }
    }

    switchStats(bool) {
        statElement.sideW = this.sideW;
        statElement.sideH = this.sideW * 0.5;
        this.textBoxes = statElement.getTextBoxes(bool)
        this.content.appendChild(this.textBoxes)
    
        this.graph = statElement.getGraph(bool)
        this.content.appendChild(this.graph);
    }

    addShareButton(daily) {
        let button = document.createElement("div")
        this.shareButton = button;
        button.setAttribute("id", "share-button")
        button.onclick = (e2) => {
            e2.stopPropagation();
            document.dispatchEvent(new CustomEvent(`showCopiedPopup`, {detail: {
                modal: self.modal,
            }}));
            let result = storage.loadResult(daily)
            let shareText = result.getText()
            navigator.clipboard.writeText(shareText);
            if (common.developerMode) { console.log(shareText) }
        }
        this.content.appendChild(button)
        button.style.height = common.width * 0.075 + 'px'

        let label = document.createElement("label")
        label.htmlFor = "share-button"
        label.innerHTML = `Share latest ${daily ? "Daily" : "Practice"} result`
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

    }


    onClose() {
        super.onClose()
    }


}




