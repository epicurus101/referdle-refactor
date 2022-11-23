import {gameManager, common} from  '../js/contents.js'

let interval

document.addEventListener('reviewMode', (e) => {
    console.log('heard review mode')
    create(e.detail.daily)
});

function create(daily) {
    console.log('review');

    const modal = document.createElement("div")
    modal.setAttribute("id", "reviewPopup") // rename!!
    modal.style.display = "table";

    const child = document.createElement("span")
    child.style.display = "table-cell"
    modal.appendChild(child)
    child.style.verticalAlign = "middle"
    child.style.whiteSpace = "pre-wrap";
    child.style.fontSize = common.width * 0.03 + 'px'
    child.style.fontVariantNumeric = "tabular-nums";

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
        modal.onclick = function(e) {
            e.stopPropagation();
            destroy()
            document.dispatchEvent(new CustomEvent('newPractice'))
        }
    }
    const holder = document.getElementById("top-bar")
    holder.appendChild(modal)
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

    if (interval) { clearInterval(interval) }
    let popup = document.getElementById("reviewPopup")
    if (popup) {
        if (popup.parentElement) {
            popup.parentElement.removeChild(popup)
        }

    }
}