let cancelBtn = document.getElementById("cancelbtn")
cancelBtn.addEventListener("click",() =>{
  window.location = "https://andreas-hodo.github.io/Chess/games/"
})


firebase.auth().onAuthStateChanged((user) =>{
    if(user){
      let id = decodeURIComponent(window.location.search)
      id = id.substring(4);
      let game = firebase.database().ref(`Games/${id}`)
      game.on('value',snapshot =>{
        var data = snapshot.val();
        let details = Object.values(data)[0]
        let currImg = document.querySelector(".you .avatar img")
        currImg.src = user.photoURL
        if(details.player2){
        let enemImg = document.querySelector(".opponent .avatar img")
        //enemImg.src = //user.photoURL
          console.log(details)
          let [player1,player2] = [details.player1,details.player2].map(player =>{
            let role = user.displayName == player.name ? "user" : "enemyuser";
            return Object.assign(player,{role})
          })         
          let Bplayer = player1.team == "black" ? player1 : player2
          let Wplayer = player2.team == "white" ? player2 : player1
          const game = closure(Bplayer,Wplayer,600)
          let main = document.querySelector(".main")
          let waitPopup = document.querySelector(".waitwrapper")
          main.removeChild(waitPopup)
          game.start()
        }
      })
    }else{
      alert("You are not login! you will be redirected to login page")
      window.location = "https://andreas-hodo.github.io/Chess/login/"
    }
})