import {animateCSS} from '../js/contents.js'

document.addEventListener('showCopiedPopup', (e) => {

    let modal = document.getElementById("endGameModal")
    const content = modal.querySelector(".modal-content")
    const button = modal.querySelector('#share-button')

    let popup = document.createElement("div")

    let child = document.createElement("span")
    child.textContent = `Copied to Clipboard`
    child.style.display = "table-cell"
    child.style.verticalAlign = "middle"
    popup.appendChild(child)
    popup.setAttribute("id", `copiedPopup`);
    popup.classList.add("animate__animated");
    popup.style.setProperty('--animate-duration', '2s');

    content.appendChild(popup)
    console.log(button.offsetTop, button.offsetLeft)

    popup.style.height = button.offsetHeight + 'px'
    popup.style.width = button.offsetWidth + 'px'
    popup.style.left = button.offsetLeft + 'px'
    popup.style.top = button.offsetTop + 'px'
    child.style.fontSize = button.offsetWidth / 9 + 'px'
    animateCSS(`#copiedPopup`, "fadeOut").then(() => { // wow learn how this works some time!
        if (content) {
            content.removeChild(popup)
        }
    });


});