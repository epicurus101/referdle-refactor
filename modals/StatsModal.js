import { Modal, statElement, common, uColours } from '../js/contents.js'

export class StatsModal extends Modal {

    graph
    textBoxes
    sideW = common.width * 0.6;

    constructor(e) {
        super("statsModal")
        this.replaceHeading("Statistics")
        this.content.appendChild(document.createElement("br"))

        let b1 = document.createElement("div")
        b1.textContent = "Practice"
        b1.classList.add("stat-mode-button")

        let b2 = document.createElement("div")
        b2.textContent = "Daily"
        b2.classList.add("stat-mode-button")

        let buttons = [b1,b2]

        buttons.forEach(element => {
            this.content.appendChild(element)
            element.style.fontSize = (this.sideW / 20) + 'px'
            element.onclick = (e) => {
                if (e) {e.stopPropagation()}
                buttons.forEach(b => {
                    b.style.color = uColours.offWhite
                    b.style.backgroundColor = uColours.black
                    b.style.border = "0px"
                });
                element.style.color = uColours.black
                element.style.backgroundColor = uColours.yellow
                element.style.border = "1px solid rgb(0,0,0)"
                this.switchStats(element.textContent == "Daily")
            }
        }); 

        b1.onclick()

    }

    switchStats(bool) {
        if (this.graph) {
            this.content.removeChild(this.graph)
        }
        if (this.textBoxes) {
            this.content.removeChild(this.textBoxes)
        }
    
        statElement.sideW = this.sideW;
        statElement.sideH = this.sideW * 0.5;
        this.textBoxes = statElement.getTextBoxes(bool)
        this.content.appendChild(this.textBoxes)
    
        this.graph = statElement.getGraph(bool)
        this.content.appendChild(this.graph);
    }

    onOpen() {

    }


    onClose() {
        super.onClose()
    }


}




