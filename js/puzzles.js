let puzzles = {
    version: "1.00",
    array: [],

    load: async function () {

        let savedVersion = localStorage.getItem("puzzleVersion")

        let save = puzzles.getFromLS()
        if (save != null && puzzles.version == savedVersion) {
            console.log("we had a save and it's the same as the version we think")
            puzzles.array = save;
        } else {
            puzzles.array = await puzzles.download()
            puzzles.save(puzzles.array)
        }
    },

    get: function(num) {
        if (puzzles.array[num]) {
            return puzzles.array[num]
        } else {
            return puzzles.array[0]
        }
    },

    download: async function () {
        const response = await fetch('1000.json');
        let array = await response.json();
        return array
    },

    save: function (array) {
        let str = JSON.stringify(array);
        localStorage.setItem("dailyPuzzles", str);
        localStorage.setItem("puzzleVersion", puzzles.version)
    },

    getFromLS: function () {
        const save = localStorage.getItem("dailyPuzzles");
        if (save == null) { return null };
        return JSON.parse(save);
    }

}

export { puzzles }