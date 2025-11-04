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
if(data){
  if(!data.player2){
      window.location  = "https://andreas-hodo.github.io/Chess/Game/"
  }
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
// function check_available_name(allNames,name){
//   if(allNames.indexOf(name) == -1){
//     console.log("Name is Available",name)
//     return name
//   }
//     do{
//       name = `Guest_${getRandom(0,9,4)}`
//      }while(allNames.indexOf(name) != -1)
//       console.log("New name:",name)
//       return name
// }
let currentUser = null;
     async function readMyUserDetails() {
      let users;
            if (!currentUser) {
                console.warn("No user signed in to read details.");
                alert("Please sign in first!");
                return;
            }
            try {
                const userDocRef = db.collection("UsersCounter").doc("users");
                const docSnap = await userDocRef.get();
                if (docSnap.exists) {
                    users = docSnap.data().users
                }
            } catch (error) {
              console.log(error)
            }
          return users
        }
        async function updateMyUserDetails(numOfUsers) {
            if (!currentUser) {
                console.warn("No user signed in to update details.");
                alert("Please sign in first!");
                return;
            }
            let numsArr = Array.from(numOfUsers)
            let users;
            let rest;
            let newNum;
              for(let i = 0; i < numsArr.length; i++){
                if(parseInt(numsArr[i]) > 0){
                  users = parseInt(numsArr.slice(i,numsArr.length).join("")) + 1
                  rest = numsArr.slice(0,i)
                  newNum = rest.concat(users).join("")
                  break
                }
              }
            try {
                const userDocRef = db.collection("UsersCounter").doc("users");
                await userDocRef.update({
                    users:newNum
                });
                console.log("My User Details updated successfully.");
                alert("Your user details updated successfully!");
            } catch (error) {
                console.error("Error updating user details:", error);
                alert("Error updating user details: " + error.message);
            }
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
      console.log(user)
      let msg = newUser == "true" ? `Welcome to our page ${user.displayName}. To Play, press the Plus Button or Search for an existing game.` : `Welcome back ${user.displayName}.` 
      alert(msg)       
      playerid = user.uid
       name = user.displayName
       currentUser = user
      if(newUser == "true"){
       readMyUserDetails().then(allusers =>{
          updateMyUserDetails(allusers)
      })
    }
       let playerRef = firebase.database().ref(`players/${name}`)
       let newPlayer = {}
       newPlayer[name] = playerid
       allplayersRef.update(newPlayer)

       allRoomsRef.on("child_added",snapshot =>{
        var data = snapshot.val()
        let avail = data.Game.full ? "Not Available" : "Available"
        let Enemyname = data.Game.playerName
        if(Enemyname){
                var newRoom = document.createElement("tr")
                   newRoom.className = "card hide"                  
                   //console.log("Enemy name from child added",Enemyname)
                   let roomId = data.Game.roomId
                   newRoom.id = Enemyname
                    var newRoomDetails = `
                                  <td>${Enemyname}</td>
                                 <td>${roomId}</td>
                                 <td id="${roomId}">${avail}<td>`
                                 newRoom.innerHTML = newRoomDetails         
                    var tablebody = document.querySelector("tbody")
                    tablebody.appendChild(newRoom) 
                    newRoom.onclick = () =>{
                      connectEnemy(Enemyname,name)
                     }   
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
        let Enemyname = roomDetails.playerName
        //console.log("Enemy name from value",Enemyname)
        let roomId = roomDetails.roomId
        newRoom.id = Enemyname
         var newRoomDetails = `
                       <td>${Enemyname}</td>
                      <td>${roomId}</td>
                      <td id="${roomId}">${avail}<td>`
                      newRoom.innerHTML = newRoomDetails         
         tablebody.appendChild(newRoom)
         newRoom.onclick = () =>{
          connectEnemy(Enemyname,name)
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
      //playerRef.onDisconnect().remove()
    }else{
      currentUser = null
    }
  })
}
window.onload =  connect_user()