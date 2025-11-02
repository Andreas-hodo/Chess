function getRandom(min,max,times){
var arr = []
var number = ""
for(let i = 0; i < times; i++){
  arr.push(parseInt(Math.random() * (max - min)+ min))
}
for(let i = 0; i < arr.length; i++){
  number = number + String(arr[i])
}
return number
}

function createRoom(name){
  let newRoom = firebase.database().ref(`Rooms/${name}/Game`)
  let id = getRandom(0,9,4)
  let player1 = {
    team:"white"
  }
  player1.name = name
  newRoom.set({
    playerName:name,
    roomId:id,
    full:false
  })
  let game = firebase.database().ref(`Games/${name}`)
  game.set({
    roomId:id,
    full:false,
    player1
  })
   window.location  = "https://andreas-hodo.github.io/Chess/Game/"
}
function search_room(){
  var searchInput = document.getElementById("search")
  searchInput.addEventListener("input", e => {
   var users =  []
   var all_room_cards  = document.querySelectorAll(".card").forEach(card =>{
     var name = card.children[0].innerText
     var room = card.children[1].innerText
     users.push({name,room_id:room})
   })
    users.forEach(user => {
     var searching = e.target.value
     var current_name = Array.from(user.name).splice(8).join("")
     const isVisible = user.room_id.toLowerCase().includes(searching) || user.name.includes(searching) 
     var current_card = document.getElementById(user.name)
       current_card.classList.toggle("hide", !isVisible || !searching)
    })
 })
 }
function connectEnemy(host,enemy){
 let addEnemy =  firebase.database().ref(`Games/${host}`)
 let changeRoom = firebase.database().ref(`Rooms/${host}/Game`)
 addEnemy.once("value",snapshot =>{
  var data = snapshot.val()
  if(!data.player2){
      window.location  = "https://andreas-hodo.github.io/Chess/Game/"
  }
}).then(()=>{
  addEnemy.update({
    player2:{
      name:enemy,
      team:"black"
    }
   }) 
}).then(()=>{
  addEnemy.update({
     full:true
  })
  changeRoom.update({
    full:true
 })
}).then(()=>{
  my_node = firebase.database().ref(`Rooms/${host}`)
  my_node.remove()
})
}
function check_available_name(allNames,name){
  if(allNames.indexOf(name) == -1){
    console.log("Name is Available",name)
    return name
  }
    do{
      name = `Guest_${getRandom(0,9,4)}`
     }while(allNames.indexOf(name) != -1)
      console.log("New name:",name)
      return name
}
function connect_user(){
  var playerid;
  var name;
  let status = decodeURIComponent(window.location.search);
  let allplayersRef = firebase.database().ref(`players`)
  let allRoomsRef = firebase.database().ref(`Rooms`)
  let allGamesRef = firebase.database().ref(`Games`)
  let newUser = status.substring(5); 
 firebase.auth().onAuthStateChanged((user) =>{
    if(user){
      //console.log(user) 
      let msg = newUser ? `Welcome to our page ${user.displayName}. To Play, press the Plus Button or Search for an existing game.` : `Welcome back ${user.displayName}.`
      alert(msg)
       playerid = user.uid
       name = user.displayName
       let newPlayer = {}
       newPlayer[name] = playerid
       allplayersRef.update(newPlayer)

       allRoomsRef.on("child_added",snapshot =>{
        var data = snapshot.val()
        let avail = data.Game.full ? "Not Available" : "Available"
                var newRoom = document.createElement("tr")
                   newRoom.className = "card hide"
                   let name = data.Game.playerName
                   let roomId = data.Game.roomId
                   newRoom.id = name
                    var newRoomDetails = `
                                  <td>${name}</td>
                                 <td>${roomId}</td>
                                 <td id="${roomId}">${avail}<td>`
                                 newRoom.innerHTML = newRoomDetails         
                    var tablebody = document.querySelector("tbody")
                    tablebody.appendChild(newRoom) 
                    newRoom.onclick = () =>{
                      connectEnemy(name,name)
                     }               
     })
     allRoomsRef.on("value",snapshot =>{
      var data = snapshot.val()
      if(data){
        var tablebody = document.querySelector("tbody")
        let first = Object.values(data)[0]
        let roomDetails = Object.values(first)[0]
        let roomElem = document.getElementById(`${roomDetails.playerName}`)
        if(!roomElem){
          let avail = roomDetails.full ? "Not Available" : "Available"
            var newRoom = document.createElement("tr")
        newRoom.className = "card hide"
        let name = roomDetails.playerName
        let roomId = roomDetails.roomId
        newRoom.id = name
         var newRoomDetails = `
                       <td>${name}</td>
                      <td>${roomId}</td>
                      <td id="${roomId}">${avail}<td>`
                      newRoom.innerHTML = newRoomDetails         
         tablebody.appendChild(newRoom)
         newRoom.onclick = () =>{
          connectEnemy(name,name)
         }       
        }     
      }
    })
    
    allGamesRef.on("value",snapshot =>{
      var data = snapshot.val()
      if(data){
      let details = Object.values(data)[0]
      let avail = details.full ? "Not Available" : "Available"
      let id = details.roomId
      let roomElem = document.getElementById(id)
      roomElem.innerText = avail
      roomElem.onclick = () =>{}
      }      
    })

        var room_btn = document.getElementById("btn_create_rooms")
       room_btn.addEventListener('click',()=>{
        createRoom(name)
      })
      search_room()
      // //Remove all my nodes from firebase tree when i disconnect
      // //room_ids.onDisconnect().remove()
      // //playerRef.onDisconnect().remove()
      // //Game.onDisconnect().remove()
    }else{
      //.onDisconnect().remove()
      //You are logged out
    }
  })
}
window.onload =  connect_user()