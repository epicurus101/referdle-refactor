import { dictionary } from "./contents.js";

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

    newPuzzle: function(){

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
            let endWord
            while (endWord == null) {
                const dummy = pool.randomItem();
                if (dummy.charAt(4) != "s" || Math.random() > 0.95) {
                    endWord = dummy;
                }
            }
            if (startWord == endWord) {continue};
            words.push(startWord);
    
            pool.delete(startWord);
            pool.delete(endWord);
    
            let currentMatch = logic.getComparison(startWord, endWord);
            let prevWord = startWord;
    
            for (let i = 0; i < 3; i++) {
                const comp = x => logic.getComparison(prevWord, x).matches(currentMatch);
                pool = pool.filter( comp ); //narrowing the pool
                if (pool.size <= (4-i)) { break }
    
                if (i <= 1) { //make sure guesses 2 and 3 contain as many letters as possible
                    for (let z = 5; z > 0; z--) {
                        const comp2 = x => x.uniqueChars() == z;
                        const subpool = pool.filter( comp2 );
                        if (subpool.size > 0) {
                            const nextWord = subpool.randomItem();
                            let newComparison = logic.getComparison(nextWord, endWord);
                            if (newComparison.matches(currentMatch)) { // make sure progress
                                break
                            } else {
                                words.push(nextWord);
                                currentMatch = newComparison;
                                prevWord = nextWord;
                                break;
                            }
                        }
                    }
                } else {
                    const nextWord = pool.randomItem();
                    let newComparison = logic.getComparison(nextWord, endWord);
                    if (newComparison.matches(currentMatch)) { // make sure progress
                        break
                    } else {
                        words.push(nextWord);
                        currentMatch = newComparison;
                        prevWord = nextWord;
                        break;
                    }
                }
            }
            words.push(endWord);
        }
        console.log(words);
        return words;
    
    }



}


export { logic }