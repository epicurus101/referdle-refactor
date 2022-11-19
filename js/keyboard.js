import { uColours, animateCSS } from './contents.js';

const keyboard = {

    allowInput: false,
    keys: document.querySelectorAll(".keyboard-row button"),
    standardKeys: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],

    initialise: function () {

        keyboard.keys.forEach(key => {
            const letter = key.getAttribute("data-key");
            key.setAttribute("id", `k-${letter}`);
            key.classList.add("prevent-select")
            key.customInfo = -2;

            key.addEventListener('long-press', function (e) {
                e.preventDefault(); //maybe work out what this does some day
                longpressHandler(letter);
            });

            key.addEventListener('click', function (e) {
                if (!keyboard.allowInput) { return }
                // console.log(e.button)
                keyHandler(letter);
            })

            key.addEventListener('contextmenu', function (e) {
                e.preventDefault()
                longpressHandler(letter)
            })
        })
    },
    keyHandler: function (letter) {
        if (letter === 'enter') {
            const event = new CustomEvent('submit');
            document.dispatchEvent(event);
            return;
        } else if (letter === 'del') {
            const event = new CustomEvent('delete');
            document.dispatchEvent(event);
            return;
        } else if (!standardKeys.includes(letter)) {
            return;
        } else {
            const event = new CustomEvent('letterKey', {detail: {
                letter: letter
            }});
            document.dispatchEvent(event);
        }
    },
    // bounce message to board manager which in turn bounces message back to 'updateKeyboard' (with details) - reset / update / save!!
    longpressHandler: function (letter) {
        if (!standardKeys.includes(letter)) {
            return;
        } else {
            const event = new CustomEvent('excludeLetter', {detail: {
                letter: letter
            }});
            document.dispatchEvent(event);
            animateCSS(`#k-${letter}`, "headShake")
        }
    },
    reset: function () {
        keyboard.keys.forEach(key => {
            key.customInfo = -2;
            key.style.backgroundColor = uColours.midGrey;
            key.style.borderColor = uColours.midGrey;
        })
    },
    //need to come up with comparisonData from boardmanager
    update: function (excluded, comparisonData) {
        excluded.forEach(letter => {
            const button = document.getElementById(`k-${letter}`);
            keyboard.updateKey(button, -1);
        });
        Object.keys(comparisonData).forEach(letter => {
            const button = document.getElementById(`k-${letter}`);
            keyboard.updateKey(button, comparisonData[letter]);
        })
    },
    updateKey: function(key, newValue) { //keyboard
        if (key.customInfo >= newValue) {
            return;
        } else {
            key.customInfo = newValue;
            if (newValue == -1) {
                key.style.backgroundColor = uColours.darkBlue;
                key.style.borderColor = uColours.darkBlue;
            } else if (newValue == 0) {
                key.style.backgroundColor = uColours.darkGrey;
                key.style.borderColor = uColours.darkGrey
            } else if (newValue == 1) {
                key.style.backgroundColor = uColours.yellow;
                key.style.borderColor = uColours.yellow;
            } else if (newValue == 2) {
                key.style.backgroundColor = uColours.green;
                key.style.borderColor = uColours.green;
            }
        }
    }


}

export { keyboard }