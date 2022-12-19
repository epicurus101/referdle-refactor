export class GameResult {

    daily;
    win;
    dailyNo;
    guesses = []
    totalGuesses;

    static emojis = ["🏳️", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "💀", "🟩", "🟥"];

    constructor(detail) {
        this.daily = detail.daily;
        this.totalGuesses = detail.totalGuesses;
        this.win = detail.win;
        this.dailyNo = detail.dailyNo;
        this.guesses = detail.guesses;
    }

    getText() {
        let initial = this.daily ? `Daily Referdle ${this.dailyNo}` : `Practice Referdle`
        let text = initial + `: ${this.win ? this.totalGuesses : "X"}/25\r\n\r\n`


        if (!this.win && !this.guesses.includes(6)) { //legacy - remove when updates propagated
            text += GameResult.emojis[6]
            text += `\r\n`
        } else {
            text += this.win ? GameResult.emojis[7] : GameResult.emojis[8]
            for (let index = 0; index < this.guesses.length; index++) {
                let num = this.guesses[index]
                text += GameResult.emojis[num]
                if (index == 0 || index == 2) {
                    text += `\r\n`
                }
            }
        }

        text += `\r\n\r\nwww.referdle.com`
        text += `\r\ntwitter: @referdle`
        console.log(text)

        return text
    }

    static loadFromEndGameEvent(detail) {
        let obj = {}

        obj.guesses = []
        obj.daily = detail.daily;
        obj.totalGuesses = detail.guesses;
        obj.win = detail.win;
        obj.dailyNo = detail.dailyNo;
        for (let index = 1; index < detail.boards.length; index++) {
            const board = detail.boards[index];
            console.log(board.getStatus())
            obj.guesses.push(board.getStatus()) //code an incomplete board as 0 and a dead board as 6
        }
        return new GameResult(obj)
    }

    static loadFromString(string) {
        let obj = JSON.parse(string)
        return new GameResult(obj)

    }

    static getBlank() {
        let obj = {
            daily: false,
            totalGuesses: 25,
            win: false,
            dailyNo: 0,
            guesses: [5, 5, 5, 5, 5]
        }
        return new GameResult(obj)
    }



}