import { dictionary, derivatives } from "./contents.js";

const logic = {

     getComparison: function (currentWordArr, targetWordArr) {
        let result = ["0","0","0","0","0"];
        let input = [...currentWordArr];
        let target = [...targetWordArr];
    
        for (let i = 0; i < result.length; i++) {
            if (input[i] == target[i]) {
                result[i] = "2";
                target[i] = "?";
                input[i] = "?";
            }
        }
    
        for (let i = 0; i < result.length; i++) {
            if (input[i] != "?") {
                let index = target.indexOf(input[i]);
                if (index != -1) {
                    result[i] = "1";
                    input[i] = "?";
                    target[index] = "?";
                }
            }
        }
        return result;
    },

    puzzleTest: function(){
        let deriv = new Set(derivatives.words)
        let results = []
        let time = []
        for (let index = 0; index < 100; index++) {
            const startTimeInMs = new Date().getTime();        
            let puzzle = new Set(logic.newPuzzle())
            let boredom = puzzle.intersection(deriv)
            results.push(boredom.size)
            const endTimeInMs = new Date().getTime();
            const durationInMs = endTimeInMs - startTimeInMs;
            time.push(durationInMs)
        }
        console.log(results.toTally())
        console.log(time)
    },

    newPuzzle: function(){
        let puzzle
        do {
            puzzle = logic.failablePuzzle()
        } while (puzzle.length < 5)
        return puzzle

    },

    failablePuzzle: function(){

        let dict = dictionary.words;

        if (dict.length == 0) {console.log("dictionary failed"); return}
    
        let words = [];
        outerLoop:
        while (words.length < 5) {
            let pool = new Set(dict); // this is the pool!
            words = [];
            const diff5 = x => x.uniqueChars() == 5;
            const different5Pool = pool.filter( diff5 );
            const startWord = different5Pool.randomItem(); // start word should have five different letters
            words.push(startWord);
            pool.delete(startWord);
            
            let endWord = logic.applyFilter(pool)
            pool.delete(endWord);
    
            let currentMatch = logic.getComparison(startWord, endWord);
            let prevWord = startWord;
    

            for (let i = 0; i < 3; i++) {
                const comp = x => logic.getComparison(prevWord, x).matches(currentMatch);
                pool = pool.filter( comp ); //narrowing the pool
                if (pool.size <= (4-i)) { break }
    
                if (i <= 1) { //make sure guesses 2 and 3 contain as many letters as possible
                    innerLoop:
                    for (let z = 5; z > 0; z--) {
                        const comp2 = x => x.uniqueChars() == z;
                        const subpool = pool.filter( comp2 );
                        if (subpool.size > 0) {
                            let attempts = 0
                            let nextWord
                            let nextComparison
                            do {
                                nextWord = logic.applyFilter(subpool)
                                nextComparison = logic.getComparison(nextWord, endWord)
                                attempts += 1
                                if (attempts > 10) {
                                    break innerLoop// deals with the problem of a pool that only has same comparisons?
                                }
                            } while (nextComparison.matches(currentMatch))
                            words.push(nextWord);
                            currentMatch = nextComparison;
                            prevWord = nextWord;
                            break
                        }
                    }
                } else {
                    let nextWord
                    let nextComparison
                    let attempts = 0
                    do {
                        nextWord = logic.applyFilter(pool)
                        nextComparison = logic.getComparison(nextWord, endWord)
                        attempts += 1
                        if (attempts > 10) {
                            break outerLoop// deals with the problem of a pool that only has same comparisons?
                        }
                    } while (nextComparison.matches(currentMatch))
                    words.push(nextWord);
                    currentMatch = nextComparison;
                    prevWord = nextWord;
                    break
                }
            }
            words.push(endWord);
        }
        if (words.length < 5) {
            return logic.newPuzzle()
        } else {
        //    console.log(words);
            return words;
        }

    
    },

    applyFilter: function(pool){
        let word
        while (word == null) {
            const dummy = pool.randomItem();
            if (!derivatives.words.includes(dummy) || Math.random() > 0.85) {
                word = dummy;
            }
        }
        return word
    }



}


export { logic }