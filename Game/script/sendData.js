let cancelBtn = document.getElementById("cancelbtn")
let handleCancel = () =>{window.location = "https://andreas-hodo.github.io/Chess/games/"}
cancelBtn.addEventListener("click",handleCancel)


firebase.auth().onAuthStateChanged((user) =>{
    if(user){
      let id = decodeURIComponent(window.location.search)
      id = id.substring(4);
      let game = firebase.database().ref(`Games/${id}`)
      game.on('value',snapshot =>{
        var data = snapshot.val();
        let details = Object.values(data)[0]
        let currImg = document.querySelector(".you .avatar img")
        currImg.src = user.photoURL ? user.photoURL : "../games/images/default-photoprofile.png"
        let time = 600
        let mins = `◷ ${Math.floor(time/60).toString()} min`
        let minsElem = document.getElementById("minutes")
        minsElem.innerText = mins
        if(details.player2){
          cancelBtn.removeEventListener("click",handleCancel)
          cancelBtn.style.opacity = "0.5"
          let enemImg = document.querySelector(".opponent .avatar img")
          //enemImg.src = //user.photoURL
          let title = document.querySelector(".waitpopup .title")
          title.innerText = `${user.displayName} joined!`
          let [player1,player2] = [details.player1,details.player2].map(player =>{
            let role = user.displayName == player.name ? "user" : "enemyuser";
            return Object.assign(player,{role})
          })         
          let Bplayer = player1.team == "black" ? player1 : player2
          let Wplayer = player2.team == "white" ? player2 : player1          
          const game = closure(Bplayer,Wplayer,time)
          if(user.displayName == Bplayer.name) game.BoardFlip()
          setTimeout(()=>{
            let main = document.querySelector(".main")
            let waitPopup = document.querySelector(".waitwrapper")
            if(waitPopup) main.removeChild(waitPopup)
            game.start()
          },3000)
        }
      })
    }else{
      //alert("You are not login! you will be redirected to login page")
      //window.location = "https://andreas-hodo.github.io/Chess/login/"
    }
})