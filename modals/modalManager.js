import { EndGameModal } from "./EndGameModal.js"
import { HelpModal } from "./HelpModal.js"
import { AboutModal } from "./AboutModal.js"
import { StatsModal } from "./StatsModal.js"
import { SureModal } from "./SureModal.js"
import { Modal } from "./Modal.js"
import { NewPlayerModal } from "./NewPlayerModal.js"

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
    },
    showAbout: function(e){
        let modal = new AboutModal(e)
        modalManager.add(modal.modal)
    },
    showStats: function(e){
        let modal = new StatsModal(e)
        modalManager.add(modal.modal)
    },
    showSure: function(e){
        let modal = new SureModal(e)
        modalManager.add(modal.modal)
    },
    new: function(e){
        let modal = new NewPlayerModal(e)
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

document.addEventListener("showAboutModal", (e) => {
    modalManager.showAbout(e)
})

document.addEventListener("showStatsModal", (e) => {
    modalManager.showStats(e)
})

document.addEventListener("showSureModal", (e) => {
    modalManager.showSure(e)
})