import { storage, uColours, process } from './contents.js';

let statElement = {

    sideH: 0,
    sideW: 0,

    getGraph: function (daily) {
        let stats = storage.loadStats(daily)
        console.log('here are stats for graph', stats)

        let processed = statElement.processForGraph(stats)
        console.log('stats:',processed)
        let graph = statElement.getFormattedGraph(processed, stats.at(-1) ? stats.at(-1) : null)

        return graph

    },

    processForGraph: function (stats) {

        console.log(stats)
        let obj = {}

        Array.from(stats).forEach(function (element) {
            console.log(element);

            if (element == "X" && '27' in obj) {
                obj[27] = obj[27] + 1
            } else if (element == "X") {
                obj[27] = 1
            } else if (element in obj && element != "B") {
                obj[element] = obj[element] + 1
            } else if (element != "B") {
                obj[element] = 1
            }
        });

        return obj;

    },

    getFormattedGraph: function (stats, final) {
        let largest = Math.max(...Object.values(stats))
        let scale = statElement.getScale(largest)

        console.log(stats)

        const graph = document.createElement("div");
        graph.setAttribute("id", "statsGraph")

        graph.style.display = "grid"
        graph.style.gridTemplateColumns = "repeat(24,1fr)"
        graph.style.gridTemplateRows = `${statElement.sideH}px ${statElement.sideW / 15}px`
        graph.style.width = statElement.sideW + 'px';
        graph.style.alignItems = 'end'
        graph.style.margin = '0px auto'
        console.log(graph)

        for (let index = 0; index < 24; index++) {
            if (index == 0) {
                let axis = document.createElement("div")
                axis.style.zIndex = 5;
                axis.style.borderRight = "1px solid rgb(58,58,60)"
                axis.style.height = statElement.sideH + 'px'
                axis.style.width = (statElement.sideW / 24) + 'px'
                graph.append(axis)

                let axisScale = statElement.getAxisVis(scale, largest)
                axis.appendChild(axisScale)
            } else {
                let bar = document.createElement("div");
                if (stats[index + 4]) {
                    bar.style.height = statElement.sideH * stats[index + 4] / largest + 'px'
                } else {
                    bar.style.height = 0 + 'px'
                }



                bar.style.width = ((statElement.sideW / 24) - 1) + 'px'
                if (index == 23) {
                    bar.style.backgroundColor = uColours.orange
                } else {
                    bar.style.backgroundColor = uColours.yellow
                }
                if (final && (index+4) == final) {
                    bar.style.filter = "brightness(125%)"
                }
                graph.append(bar)
            }
        }

        for (let index = 0; index < 24; index++) {
            let txt = document.createElement("div");
            txt.classList.add("grid-axis")
            txt.style.fontSize = statElement.sideW / 30 + 'px'
            txt.style.height = statElement.sideW / 15 + 'px'
            txt.style.zIndex = 5
            let num = index + 4

            if (num >= 5) {
                txt.style.borderTop = "1px solid rgb(58,58,60)"
            }
            if (num >= 5 && num % 5 == 0 && num <= 25) {
                txt.textContent = num
            } else if (num == 27) {
                txt.textContent = "X"
            }

            graph.append(txt)

        }
        return graph
    },

    getScale: function (maxValue) {

        const array = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]

        for (let index = 0; index < array.length; index++) {
            const scale = array[index];
            if (maxValue / scale <= 6) {
                return scale
            }

        }
        return 1000000000
    },

    getAxisVis: function(scale, maxValue) {

        let rowHeight = (scale / maxValue) * statElement.sideH

        let labelNo = Math.floor(maxValue / scale)

        let holder = document.createElement("div")
        holder.style.height = statElement.sideH + 'px';
        holder.style.width = statElement.sideW / 24 + 'px';
        holder.style.display = "flex"
        holder.style.flexDirection = "column-reverse"
        holder.style.alignContent = "flex-end"
        holder.style.justifyContent = "flex-start"

        for (let index = 0; index < labelNo; index++) {
            let bar = document.createElement("div");
            bar.style.display = "inline-block"
            bar.classList.add("axisBox")
            bar.style.height = rowHeight + 'px';
            bar.style.borderTop = '1px solid rgb(0,0,0)'
            if (index == 0) {
                bar.style.borderBottom = '1px solid rgb(0,0,0)'
            }
            bar.textContent = (index + 1) * scale
            bar.style.direction = 'rtl'
            bar.style.overflow = "visible"
            bar.style.fontSize = statElement.sideW / 30 + 'px'
            holder.append(bar)

        }
        return holder;
    },


    getTextBoxes: function(daily) {

        let stats = storage.loadStats(daily)
        let processed = statElement.processStatsForText(stats)
        let labels = ['Win %','Current Streak', 'Max Streak', 'Played', 'Average Guesses']
    
        const text = document.createElement("div");
        text.setAttribute("id", "textStatsHolder")
        text.style.width = statElement.sideW + 'px'
        text.style.height = statElement.sideH * 0.6 + 'px'
        labels.forEach(statLabel => {
            let box = document.createElement("div");
            box.classList.add("textStatsBox");
            text.appendChild(box)
            let stat = document.createElement("div")
            stat.classList.add("textStat")
            stat.textContent = processed[statLabel]
            stat.style.fontSize = statElement.sideH / 6 + 'px'
            box.appendChild(stat)
            let label = document.createElement("div")
            label.classList.add('textStatLabel')
            label.textContent = statLabel
            label.style.fontSize = statElement.sideH / 15 + 'px'
            box.appendChild(label)
        });
        return text
    },

    processStatsForText: function(stats) {


        let streakObj = process.calculateStreak(stats)
        let played = 0
        let wins = 0
        let totalGuesses = 0
        stats.forEach(element => {
            if (element != "X" && element != "B") {
                totalGuesses += element;
                played += 1;
                wins += 1;
            } else if (element == "X") {
                played += 1;
            }
        });
    
        let processed = {};
        processed['Win %'] = (played == 0) ? 0 : (Math.round(wins * 1000 / played) / 10)
        processed['Current Streak'] = streakObj.current
        processed['Max Streak'] = streakObj.max
        processed['Played'] = played
        processed['Average Guesses'] = (wins == 0) ? "-" : Math.round(totalGuesses * 10/wins) / 10
    
        return processed
    
    }


}

export { statElement }