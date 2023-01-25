import { Modal, statElement, common, storage, uColours} from '../js/contents.js'

export class EndGameModal extends Modal {

    daily;
    tipHeader;

    constructor(e) {
        super("endGameModal")
        if (e == null) {
            return
        }

        this.replaceHeading("Game Over")

        this.daily = e.detail.daily
        this.addText(e.detail.win, e.detail.guesses, e.detail.daily, e.detail.boards);
        statElement.sideW = common.width * 0.6;
        statElement.sideH = statElement.sideW * 0.5;

        let textBoxes = statElement.getTextBoxes(e.detail.daily)
        this.content.appendChild(textBoxes)
        let graph2 = statElement.getGraph(e.detail.daily)
        this.content.appendChild(graph2);

        let button = document.createElement("div")
        button.setAttribute("id", "share-button")
        button.onclick = (e2) => {
            e2.stopPropagation();
            document.dispatchEvent(new CustomEvent(`showCopiedPopup`, {detail: {
                modal: self.modal,
            }}));
            let result = storage.loadResult(e.detail.daily)
            let shareText = result.getText()
            navigator.clipboard.writeText(shareText);
            if (common.developerMode) { console.log(shareText) }
        }
        this.content.appendChild(button)
        button.style.height = common.width * 0.075 + 'px'

        let label = document.createElement("label")
        label.htmlFor = "share-button"
        label.innerHTML = "Share result"
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

        this.addTip()

    }

    onOpen() {
        let board = document.getElementById("board-container")
        board.style.filter = "blur(10px)"
    }


    onClose() {
        super.onClose()
        let board = document.getElementById("board-container")
        board.style.filter = "blur(0)"
        document.dispatchEvent(new CustomEvent("reviewMode", {
            detail:
                { daily: self.daily }
        }))
    }

    addText(win, guesses, daily, boards) {

        const text1 = document.createElement("div")
        text1.classList.add("modal-body")
        this.content.appendChild(text1)

        if (win == true) {
            let mode = daily ? "the Daily Referdle" : "a Practice Referdle"
            text1.textContent = `\r\nYou completed ${mode} in ${guesses}/25 guesses`
        } else {
            text1.textContent = `\r\nThe answers were ${boards[1].targetWord.toUpperCase()}, ${boards[2].targetWord.toUpperCase()}, ${boards[3].targetWord.toUpperCase()}, ${boards[4].targetWord.toUpperCase()} and ${boards[5].targetWord.toUpperCase()}\r\nYou can keep on playing in Practice Mode`
        }

    }

    addTip(){

        let tipHolder = document.createElement("div");
        tipHolder.classList.add("tip-holder");
        
        let imageTextContainer = document.createElement("div");
        imageTextContainer.classList.add("image-text-container");
        
        let image = document.createElement("img");
        image.src =  "./images/cluebot_circle.png";
        image.alt = "image";
        imageTextContainer.appendChild(image);
        
        let text = document.createElement("p");
        text.setAttribute("id", "tip-title")
        text.textContent = "";
        imageTextContainer.appendChild(text);
        tipHolder.appendChild(imageTextContainer);
        
        let multilineText = document.createElement("p");
        multilineText.classList.add("text-center");
        multilineText.innerHTML = "You don’t have to play the words in order, you can make your guesses wherever you want. Just click the Word Grid you want to make your next guess in!";
        tipHolder.appendChild(multilineText);

        let image2 = document.createElement("img");
        image2.classList.add("img2")
        image2.src =  "./images/top-tip1.jpg";
        image2.alt = "image";
        tipHolder.appendChild(image2);

        let b1 = document.createElement("div")
        b1.classList.add("next-tip-button")
        b1.textContent = "Next tip"
        imageTextContainer.appendChild(b1)

        b1.onclick = (e) => {
            if (e) {e.stopPropagation()}
            this.cycleTip()
        }
        
        this.content.appendChild(tipHolder);
        
    }

    cycleTip(){
        let num = this.getNumber()
        let tipHolder = document.getElementsByClassName("tip-holder")[0]
        if (tipHolder == null) {console.log("couldn't find tip box"); return}
        let title = tipHolder.querySelector('#tip-title')
        let body = tipHolder.querySelector('.text-center')
        let illustration = tipHolder.querySelector('.img2')

        title.textContent = `Cluebot's Top Tips\r\n#` + String(num);
        body.innerHTML = this.tips[num][0]
        if (this.tips[num][1]) {
            illustration.src = "./images/" + this.tips[num][1]
            illustration.style.display = "inline-block"
        } else {
            illustration.style.display = "none"
        }

    }



    getNumber() {
        let savedNumber = localStorage.getItem("savedTipNumber");
        let currentNumber;
        if (savedNumber) {
          currentNumber = parseInt(savedNumber);
          currentNumber = (currentNumber + 1) % this.tips.length;
        } else {
          currentNumber = 0;
        }
        localStorage.setItem("savedTipNumber", currentNumber);
        return currentNumber;
    }

    tips = [
        ["You don’t have to play the words in order, you can make your guesses wherever you want. Just click the Word Grid you want to make your next guess in!",
        "top-tip1.jpg"],
        ["If you’ve used the Clue Grid to help rule out a letter, you can long-press that letter on the keyboard to turn it dark. Even better, if you haven’t made any guesses on a later Word Grid, it turns the same letter dark for ALL the later grids. If you make a mistake, just long-press again to reverse it.",
        "top-tip2.jpg"],
        ["Cluebot avoids guessing words containing repeat letters until Word 4 and Word 5. So it’s very unlikely that Words 1 to 3 will contains repeated letter.", null],
        ["If you find a letter that’s grey in the Clue Grid then (as long as it’s not a repeat letter) you can be sure that Cluebot will never use it in any later words and that they haven’t used it in any previous words.",
        "top-tip4.jpg"],
        ["The answers in the Clue Grid will always come from a Clue Dictionary of around 4,100 words. However the Extended Dictionary of words you’re allowed to guess contains a further approximately 8,700 words (which are mostly unusual or obscure). When you enter a word which is in the Clue Dictionary it stays white. If you enter a word from the Extended Dictionary (which will never be an answer) it turns yellow. If the word isn’t in either, it turns orange and you will not be allowed to submit it",
        "top-tip5.jpg"],
        ["Don’t let yourself run out of guesses on a word if you have other uncompleted Word Grids. The other Word Grid(s) might just give you the information you need to avoid running out of guesses!", null],
        ["Where a word has one or two spaces where lots of consonants can fit, try a ‘minesweeper’ word to eliminate possibilities. For example if the word is * A * E D then the word NYMPH might be a good minesweeper, because N, Y, M, P and H are all possible consonant fits.", null],
        ["Some people try to solve each word in order (unless they get stuck!), some people prefer to work in reverse, and some people like to try a single guess in each Grid before circling back to complete them. Experiment with different strategies, find what works for you.", null],
        ["If you’re struggling with the logic of Referdle, try the “Tips and Tricks” section of the menu for a deep-dive into Referdle logic.", null],
        ["To promote transatlantic harmony, Cluebot avoids guessing words which are spelled differently in different countries (like 'ODORS', 'AXELS', 'COLOUR') and words like these won't generally appear as answers in the Clue Grid. If you spot one we've missed, or have any other comments on the dictionary, you can get in touch on contact@referdle.com, @referdle on Twitter or @referdle@mastodon.gamedev.place on Mastodon ", null],
        ["While Cluebot is very logical, they are not very strategic. So their first guess is just as likely to be 'VYING' with its uncommon letters as it is 'STEAD' with its much more common letters", null]
    ]

}




