import { common , gameManager} from "../js/contents.js";

const menuPopup = document.getElementById("menu-popup");
menuPopup.style.display = "none"

const button = document.getElementById("menu-button")

let menuActive = false

let reviewMode = false

button.onclick = () => {
    menuActive = !menuActive;
    if (menuActive) {
        showMenu();
    } else {
        hideMenu();
    }
}

window.onclick = (e) => {
    if (menuActive && e.target != menuPopup && e.target != button) {
        hideMenu();
        menuActive = false;
    }
}

function showMenu() {

    menuPopup.style.display = "block";
    let board = document.getElementById("board-container")

    menuPopup.style.width = (common.width * 0.4) + 'px'
    menuPopup.style.height = common.width * 0.1 + 'px'
    menuPopup.style.left = board.offsetLeft + board.offsetWidth - menuPopup.offsetWidth + `px`
    menuPopup.style.top =  (board.offsetTop) + `px`

    const data = [
        ["How to Play", "help", "showHelpModal"],
        ["Tips & Tricks", "tips", "showTips"],
        ["Statistics", "graph", "showStatsModal"],
        ["Abandon Game", "abandon", "showSureModal"],
        ["About", "info", "showAboutModal"]
    ]

    for (let index = 0; index < data.length; index++) {
        if (index == 3 && gameManager.dailyMode == true) {
            continue
        }

        let inf = data[index];

        const element = document.createElement("div")
        element.classList.add("menu-item")
        element.style.flexDirection = "row"
        menuPopup.appendChild(element)
        element.onclick = () => {
            if (!reviewMode || index !=3) {
                document.dispatchEvent( new CustomEvent(inf[2]))
            }

        }

        const text = document.createElement("div")
        text.classList.add("menu-text")
        text.style.lineHeight = common.width * 0.1 + 'px';
        text.style.fontSize = common.width * 0.03 + 'px';
        element.appendChild(text)
        text.textContent = inf[0]

        const img = new Image();
        img.src = "images/" + inf[1] + ".png"
        img.style.width = common.width * 0.1 + 'px'
        img.style.height = common.width * 0.1 + 'px'
        img.style.borderRadius = common.width * 0.05 + 'px'
        img.classList.add("menu-logo")
        element.appendChild(img)
    }

};

function hideMenu() {
    while (menuPopup.hasChildNodes()) {
        menuPopup.removeChild(menuPopup.lastChild)
      }
      menuPopup.style.display = "none"
}

document.addEventListener('showTips', ()=> {
    window.open("tips.html");
})

// need to make sure these are linked in properly!

document.addEventListener('endGame', ()=> {
    reviewMode = true
})

document.addEventListener('startAgain', ()=> {
    reviewMode = false
})