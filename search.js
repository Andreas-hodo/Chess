class Player{
  constructor(name){
    this.name = name      
  }
  create_room(e,room,playerid,queryString,room_ids){
    e.preventDefault()
        let teams = ["black","white"]
        room = firebase.database().ref(`players/${playerid}/Room`)
        var room_id = getRandom(0,8,4)
        var team = teams[parseInt(getRandom(0,2,1))]
              room.set({
                creator:queryString,
                room_id,
                team,
                full:false,
                Game:{
                  player1:{
                    name:queryString,
                    team
                  },
                  player2:{
                    name:"",
                    team:""
                  }
                }
              })
              room_ids.set({
                creator:queryString,
                room_id
              })
              var my_room = new Room(queryString,room_id,team)
              //window.location = "Chess.html"
              return room
  }
  delete_room(room,my_room,Delete_room_button,room_button,room_ids,queryString){
    my_room = null
    room_ids.set({
      creator: queryString,
      room_id:"The player didn't create any room yet"
    })
    room.remove()
    Delete_room_button.disabled = true
    room_button.disabled = false 
    console.log("Room deleted sucessfully:",my_room)
  }
  search_room(searchInput){
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
}

class Room {
  constructor(creator,room_id,team){
     this.creator = creator
     this.room_id = room_id
     this.team = team
     this.full = false
  }
  show_available_games(queryString){
    var allData = {}
    firebase.database().ref(`Room_ids`).on('value', snapshot => {
      var data  = snapshot.val()
      var dbvalues  = Object.values(data)
      var i = -1
      dbvalues.map(x =>{
        i++
        allData[x.creator] = Object.keys(data)[i]
    firebase.database().ref(`Room_ids`).on('child_added', snapshot => { 
  var data = snapshot.val();
    if(data.creator !== queryString && data.room_id !== "The player didn't create any room yet"){
        var newRoom = document.createElement("tr")
        newRoom.className = "card hide"
        newRoom.id = data.creator
        var newRoomDetails = `
                      <td>${data.creator}</td>
                     <td>${data.room_id}</td>`
                     newRoom.innerHTML = newRoomDetails         
        var tablebody = document.querySelector("tbody")
        tablebody.appendChild(newRoom)
        this.connect_enemy(queryString,allData)
  }
  })
  firebase.database().ref(`Room_ids`).on('child_removed', snapshot => {
    var data = snapshot.val()
    var del = document.getElementById(data.creator)
    if(del){
    del.remove()
  }
  })
})
})
  }
  connect_enemy(queryString,details){
    firebase.database().ref(`Room_ids`).on('child_added', snapshot => { 
      var data = snapshot.val();
      var room = document.getElementById(data.creator)
        if(data.creator !== queryString && data.room_id !== "The player didn't create any room yet" && room){
          if(room.classList[1] != "connected" && room.classList[2] != "connected"){
            room.classList.add("connected")
            room.addEventListener("click",e =>{
              console.log(details[queryString],details[data.creator])
              let addEnemy = firebase.database().ref(`players/${details[data.creator]}/Room/Game/`)
              console.log(addEnemy)
              addEnemy.set({
                player2:{
                  name:queryString,
                  team:"white"
                }
              })
              //window.location = "Chess.html"
          })
          }
            
        }
      })    
  }
}
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
function connect_user(){
  var playerid;
  var playerRef;
  var room_ids;
  var allplayersRef;
  var create_all_rooms = new Room()
  var queryString = decodeURIComponent(window.location.search);
  queryString = queryString.substring(1); 
  queryString = queryString == "" ? `Guest_${getRandom(0,9,4)}` : queryString
  alert(`You are connected as ${queryString}`)
  firebase.auth().onAuthStateChanged((user) =>{
    if(user){
      //Succesfully logged in 
      console.log(user)
      playerid = user.uid
      allplayersRef = firebase.database().ref(`players`)
      playerRef = firebase.database().ref(`players/${playerid}`)
      room_ids = firebase.database().ref(`Room_ids/${playerid}`)
      room_ids.set({room_id:"The player didn't create any room yet",
      creator:queryString})
      var my_self = new Player(queryString)
      console.log(my_self)
      playerRef.set({
        name: queryString,
      })
      var room;
      var my_room;
      var searchInput = document.getElementById("search")
      var room_button = document.getElementById("btn_create_rooms")
      var Delete_room_button = document.getElementById("btn_delete_rooms")
      firebase.database().ref(`Room_ids`).on('value', snapshot => {
                var data  = snapshot.val()
                var dbvalues  = Object.values(data)
                dbvalues.map(x =>{
                  var my_card = document.getElementById(x.creator)
                  if(my_card){
                            my_card.remove()
                  }
                })
              })
      firebase.database().ref(`Room_ids`).on('value', snapshot => {
                var allData = {}
                var data  = snapshot.val()
                var dbvalues  = Object.values(data)
                var i = -1
                dbvalues.map(x =>{
                  i++
                  allData[x.creator] = Object.keys(data)[i]
                  var my_card = document.getElementById(x.creator)
             if(!my_card && x.room_id !== "The player didn't create any room yet"){
                    var newRoom = document.createElement("tr")
                    newRoom.className = "card hide"
                    newRoom.id = x.creator
                    var newRoomDetails = `
                                  <td>${x.creator}</td>
                                 <td>${x.room_id}</td>
                                 <td>Not Available<td>`
                                 newRoom.innerHTML = newRoomDetails         
                    var tablebody = document.querySelector("tbody")
                    tablebody.appendChild(newRoom)
                    create_all_rooms.connect_enemy(queryString,allData)
                  }
                })
              })
      room_button.addEventListener("click",(e) =>{
        room = my_self.create_room(e,room,playerid,queryString,room_ids) 
      })
      Delete_room_button.addEventListener("click",() =>{
          my_self.delete_room(room,my_room,Delete_room_button,room_button,room_ids,queryString)
      })
      //Search for a available room except yours
      my_self.search_room(searchInput)
      create_all_rooms.show_available_games(queryString)
      //Remove all my nodes from firebase tree when i disconnect
      room_ids.onDisconnect().remove()
      playerRef.onDisconnect().remove()
    }else{
      //You are logged out
    }
  })
  firebase.auth().signInAnonymously().catch((error)=>{
    console.log(error.code,error.message)
  })
}
connect_user()