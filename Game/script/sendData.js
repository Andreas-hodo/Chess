let cancelBtn = document.getElementById("cancelbtn")
cancelBtn.addEventListener("click",() =>{
  window.location = "https://andreas-hodo.github.io/Chess/games/"
})


firebase.auth().onAuthStateChanged((user) =>{
    if(user){
      console.log(user)
      let id = decodeURIComponent(window.location.search)
      id = id.substring(4);
      let game = firebase.database().ref(`Games/${id}`)
      game.on('value',snapshot =>{
        var data = snapshot.val();
        let details = Object.values(data)[0]
        if(details.player2){
          console.log(details)
          //const game = closure()
          //white_player.innerText = details.player1.name
          //black_player.innerText = details.player2.name
        }
      })
    }else{
        alert("You are not login! you will be redirected to login page")
        window.location = "https://andreas-hodo.github.io/Chess/login/"
    }
})