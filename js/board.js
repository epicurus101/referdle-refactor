import { logic, uColours, dictionary, animateCSS } from "./contents.js";

export class Board {
    
    index;
    boardDiv;
    contDiv;
    title;
    targetWord;
    guessedWords = [[]];
    availableSpace = 1;
    guessedWordCount = 0;
    success = false;
    excluded = new Set();
    squares = [];

    constructor(index){
        this.index = index;
        this.boardDiv = document.createElement("div");
        this.boardDiv.classList.add("board");

        this.title = document.createElement("div");
        this.title.classList.add("board-title");
        this.title.textContent = `WORD ${index}`;
        this.boardDiv.appendChild(this.title);


        this.contDiv = document.createElement("div");
        this.contDiv.setAttribute("id", `b${index}`);
        this.contDiv.classList.add("square-container");
        this.boardDiv.appendChild(this.contDiv);

        if (index == 0) {
            this.boardDiv.style.borderColor = uColours.highlight;
            this.title.textContent = "CLUE GRID"
            this.title.style.color = uColours.highlight;
            this.contDiv.style.borderTop = `1px solid ${uColours.highlight}`
        }

        for (let i = 0; i < 25; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", `b${index}-${i + 1}`);
            this.squares.push(square)
            this.contDiv.appendChild(square);
        }

        this.boardDiv.onclick = () => {
            if (this.index == 0 || this.success) {return}
            const event = new CustomEvent('boardSelect', {detail: {
                index: this.index,
                board: this
              }});
            document.dispatchEvent(event);
        }
    }

    getAllBoardComparisons(){
        let comparisons = []
        let target = Array.from(this.targetWord)
        for (let i = 0; i < this.guessedWords.length; i++) {
            let guess = this.guessedWords[i];
            let comparison = logic.getComparison(guess, target);
            comparisons.push(comparison);
        }
        return comparisons
    }

    getSquare(i){
        if (i < 1 || i > 25) {
            return this.squares[0];
        }
        return this.squares[i-1];
    }


    loadFromSave(object){
        this.targetWord = object.targetWord;
        this.guessedWords = object.guessedWords;
        this.excluded = new Set(object.excluded);
        this.guessedWordCount = object.guessedWordCount;
        if ((this.guessedWordCount > 0) && (this.guessedWords[this.guessedWordCount-1].join("") == this.targetWord)) {
            this.success = true
        } else {
            this.success = false
        }
        for (let i = 0; i < this.guessedWordCount; i++) {
            let guess = this.guessedWords[i];
            for (let ind = 0; ind < guess.length; ind++) {
                const element = guess[ind];
                const availableSpaceEl = document.getElementById(`b${this.index}-${this.availableSpace}`);
             //   const availableSpaceEl = getSquare(this.availableSpace) //WHY DOESN'T THIS WORK
                availableSpaceEl.textContent = element;
                this.availableSpace += 1;
            }
            let comparison = logic.getComparison(guess, Array.from(this.targetWord));
            this.flipTiles(0,comparison, i);
        }
    }


    adjustText(){
        squares.forEach(element => {
            element.style.fontSize = `${element.offsetHeight * 0.60}px`
        });
    }

    highlightRow(index){
        for (let row = 0; row < 5; row++) {
            for (let space = 0; space < 5; space++) {
                let num = (row * 5) + space
                const element = this.squares[num];
                if (row == index) {
                    element.style.border = `1px solid ${uColours.offWhite}`
                    element.style.opacity = 1.0;
                } else {
                    element.style.border = `0px solid`
                    element.style.opacity = 0.8;
                }
            }    
        }
    }

    fullOpacity(){
        this.squares.forEach(square => {
            square.style.opacity = 1.0;
        })
    }

    switchOn(row, letter){
        let num = (row * 5) + letter
        const element = this.squares[num];
        element.style.color = uColours.offWhite;
    }

    setClueGrid(words) {
        this.guessedWords = []
        let comparisons = []
        words.forEach(element => {
            this.guessedWords.push(Array.from(element));
        });
        this.guessedWords.forEach(wordArr => {
            const compare = logic.getComparison(wordArr, this.guessedWords[4]);
            comparisons.push(compare);
        })
        let joinedArray = this.guessedWords.flat(1);
        let joinedComparisons = comparisons.flat(1);

        for (let i = 0; i < joinedArray.length; i++) {
            const letter = joinedArray[i];
            const result = joinedComparisons[i];
            const square = this.squares[i];
            square.textContent = letter;
            square.style.color = uColours.transparent;
            let tileColor = uColours.darkGrey;
            if (result == 1) {
                tileColor = uColours.yellow;
            } else if (result == 2) {
                tileColor = uColours.green;
            }
            square.style.backgroundColor = tileColor;
            square.style.borderColor = tileColor;
        }

    }

    setTarget(word) {
        this.targetWord = word;
    }


    resetBoard(){
        this.guessedWords = [[]];
        this.availableSpace = 1;
        this.guessedWordCount = 0;
        this.success = false;
        this.excluded.clear();
        this.squares.forEach( square => {
            square.textContent = ""
            square.style.backgroundColor = uColours.black;
            square.style.borderColor = uColours.darkGrey;
            square.classList.remove("animate__flipInX");
        })
    }

    getCurrentWordArr(){
        const numberOfGuessedWords = this.guessedWords.length;
        return this.guessedWords[numberOfGuessedWords - 1];
    }

    getTargetWordArr(){
        return Array.from(this.targetWord);
    }

    updateGuessedWords(letter) {
        const currentWordArr = this.getCurrentWordArr();
        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);
            const availableSpaceEl = this.squares[this.availableSpace-1];
            availableSpaceEl.textContent = letter;
            let word = currentWordArr.join("")
            if (currentWordArr.length == 5 && !dictionary.words.includes(word)){
                this.turnWordOrange(this.availableSpace-4, this.availableSpace)
            }

            this.availableSpace += 1;
        }
    }

    turnWordOrange(start, finish) {
        for (let index = start; index <= finish; index++) {
            const element = document.getElementById(`b${this.index}-${index}`)
            element.style.color = uColours.orange;
        }
    }

    turnWordWhite(start, finish) {
        for (let index = start; index <= finish; index++) {
            const element = document.getElementById(`b${this.index}-${index}`)
            element.style.color = uColours.offWhite;
        }
    }

    handleDelete() {
        const currentWordArr = this.getCurrentWordArr();
        if (currentWordArr && currentWordArr.length > 0) {
            currentWordArr.pop();
            if (currentWordArr.length == 4) {
                this.turnWordWhite(this.availableSpace-5, this.availableSpace-1)
            }
            this.availableSpace -= 1;
            const availableSpaceEl = document.getElementById(`b${this.index}-${this.availableSpace}`);
            availableSpaceEl.textContent = "";
        }
    }


    flipTiles(interval, comparisonResult, guessedWord) {
        guessedWord = guessedWord ?? this.guessedWordCount
        const firstLetterID = guessedWord * 5 + 1;
        this.guessedWords[guessedWord].forEach((letter, letterIndex) => {
            setTimeout(() => {
                let tileColor = uColours.darkGrey;
                if (comparisonResult[letterIndex] == 1) {
                    tileColor = uColours.yellow;
                } else if (comparisonResult[letterIndex] == 2) {
                    tileColor = uColours.green;
                }
                
                const letterID = firstLetterID + letterIndex;
                const letterEl = document.getElementById(`b${this.index}-${letterID}`);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
                letterEl.style.fontSize = `${letterEl.offsetHeight * 0.60}px`
            }, interval * letterIndex)
        })
    }

    revealTruth(comparison, wordIndex) {
        for (let index = 0; index < comparison.length; index++) {
            const element = comparison[index];
            if (element == 2) {
                this.switchOn(wordIndex, index);
            }
        }
    }

    next() {
        this.guessedWordCount += 1;
        this.guessedWords.push([]);
    }
}
