import {gameManager, common, keyboard, animateCSS} from  '../js/contents.js'

let interval
let child

document.addEventListener('reviewMode', (e) => {
    console.log('heard review mode')
    create(e.detail.daily)
});

function create(daily) {
    console.log('review');

    const modal = document.createElement("div")
    modal.setAttribute("id", "reviewPopup") // rename!!
    modal.style.display = "table";

    child = document.createElement("span")
    child.setAttribute('id', 'review-text')
    child.style.display = "table-cell"
    modal.appendChild(child)
    child.style.verticalAlign = "middle"
    child.style.whiteSpace = "pre-wrap";
    child.style.fontSize = common.width * 0.035 + 'px'
    child.style.fontVariantNumeric = "tabular-nums";
    keyboard.allowInput = false;

    if (daily) {
        let nextDay = gameManager.firstDay.getTime() + (gameManager.getDay() + 1) * (1000 * 60 * 60 * 24)
        let ending = new Date();
        ending.setTime(nextDay);
        updateText()
        function updateText(){
            let remaining = getTimeRemaining(ending)
            let hours = String(remaining.hours).padStart(2,"0")
            let minutes = String(remaining.minutes).padStart(2,"0")
            let seconds = String(remaining.seconds).padStart(2,"0")
            child.textContent = `Next Daily Puzzle: ${hours}h${minutes}m${seconds}s.\r\n Switch to Practice mode to keep playing.`
        }
        interval = setInterval(updateText,1000)

    } else {
        child.textContent = "> New Practice Puzzle <"
        child.style.fontSize = common.width * 0.04 + 'px'
        modal.onclick = function(e) {
            e.stopPropagation();
            destroy()
            document.dispatchEvent(new CustomEvent('newPractice'))
        }
        repeatAnim()

    }
    const holder = document.getElementById("top-bar")
    holder.appendChild(modal)
}

function repeatAnim(){

    const holder = document.getElementById("top-bar")

    if (holder) {
        console.log(holder)
        console.log('trying to animate')
        animateCSS('#top-bar', 'pulse').then(() => { // wow learn how this works some time!
            setTimeout(repeatAnim, 10000)
        });
    }
}

function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)));
    
    return {
      total,
      hours,
      minutes,
      seconds
    };
  }
  
document.addEventListener('switchMode', (e) => {
    destroy()
})

function destroy(){

    const holder = document.getElementById("top-bar")
    if (holder) {
        holder.classList.remove('animate__animated', 'animate__pulse')
    }

    if (interval) { clearInterval(interval) }
    let popup = document.getElementById("reviewPopup")
    if (popup) {
        if (popup.parentElement) {
            popup.parentElement.removeChild(popup)
        }

    }
}