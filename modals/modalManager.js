import { EndGameModal } from "./EndGameModal.js"
import { HelpModal } from "./HelpModal.js"
import { Modal } from "./Modal.js"

const modalManager = {

    add: function(modal){
        let holder = document.getElementById("modal-holder")
        holder.appendChild(modal)
    },
    test: function(){
        let basic = new Modal("hello")
        modalManager.add(basic.modal)
    },
    endGame: function(e){
        let modal = new EndGameModal(e)
        modalManager.add(modal.modal)
    },
    showHelp: function(e){
        let modal = new HelpModal(e)
        modalManager.add(modal.modal)
    }
}

export {modalManager}

document.addEventListener("closeManagedModal", (e) => {
    let holder = document.getElementById("modal-holder")
    while (holder.hasChildNodes()) {
        holder.removeChild(holder.lastChild);
    }
})

document.addEventListener("endGame", (e) => {
    modalManager.endGame(e)
})

document.addEventListener("showHelpModal", (e) => {
    modalManager.showHelp(e)
})