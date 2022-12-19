import {id} from "./id.js";

let diagnostic = {

    report: async function(day, result){
      // day is coded as -1 if it's a practice game

        if (id.number < 0) {return}

        let x = day;
        let y = result; //result
        let z = id.number; //
        console.log("day/result/id number is", x, y, z)

        fetch("https://www.referdle.com/reportResult.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: `x=${x}&y=${y}&z=${z}`,
        })
        .then((response) => response.text())
        .then((res) => (console.log(res)));


    }


}

export {diagnostic}