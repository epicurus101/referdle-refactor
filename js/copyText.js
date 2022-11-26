let copyText = {

    get: function(detail){
        let initial = detail.daily ? `Daily Referdle ${detail.dailyNo}` : `Practice Referdle`
        let text = initial + `: ${detail.win ? detail.guesses : "X"}/25\r\n\r\n`
        if (detail.win) {
            text += copyText.emojis[6]
            for (let index = 1; index < detail.boards.length; index++) {
                const board = detail.boards[index];
                text += copyText.emojis[board.guessedWordCount-1]
                if (index == 1 || index == 3) {
                    text += `\r\n`
                }
            }
        } else {
            text += copyText.emojis[5]
        }
        text += `\r\n\r\nwww.referdle.com`
        return text

    },

    emojis: ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","💀","🟩"],


}

export {copyText}