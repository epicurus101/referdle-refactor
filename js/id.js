let id = {

    number : -1,

    getFromServer : async function(){
        let x = new Date().getTimezoneOffset();
        fetch("https://www.referdle.com/createUser.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
          body: `x=${x}`,
        })
        .then((response) => response.text())
        .then((res) => id.store(res))
        .catch(function (err){
            console.log(err);  // Prints "Error: something went terribly wrong"
        })

    },

    store: function(num) {
        console.log("storing id", num)
        localStorage.setItem("playerID", num)
        id.number = num
    },

    load: async function() {
        if (localStorage.getItem("playerID")) {
            id.number = localStorage.getItem("playerID")
        } else {
            await id.getFromServer()
        }
    }

}

export {id}