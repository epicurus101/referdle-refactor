import {gameManager, common} from  '../js/contents.js'


let active = false
let daily = false

let interval

document.addEventListener('reviewMode', (e) => {
    daily = e.detail.daily
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
    }



    const holder = document.getElementById("top-bar")
    holder.appendChild(modal)

    modal.onclick = function(e) {
        // if (!daily) {
        //     e.stopPropagation();
        //     storage.deleteSave(daily)
        //     startAgain()
        //     active = false;
        //     return;
        // }
    }
});

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
  


  
  
  
  



// modal.addEventListener('animationend', () => {
//     modal.classList.remove("animate__tada");
//     setTimeout(shakeAgain, 10000);
//   });

// function shakeAgain(){
//     if (active) {
//         modal.classList.add("animate__tada");
//     }
// }

// function startAgain() {
//     modal.style.display = "none";
//     console.log(`starting again`);

//     document.dispatchEvent(new CustomEvent('keyboardAppear'));
//     document.dispatchEvent(new CustomEvent('startAgain'));
// }
