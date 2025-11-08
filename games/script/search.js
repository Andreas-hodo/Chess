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
function getUsersNum(numOfUsers){
            let intNum = parseInt(numOfUsers)
            if(intNum == 0){
              //console.log("New num: 0001")
              return "0001"
            }
            let numsArr = Array.from(numOfUsers)
            let newNum;
            let rest;
            let num;
              for(let i = 0; i < numsArr.length; i++){
                if(parseInt(numsArr[i]) > 0){
                  num = parseInt(numsArr.slice(i,numsArr.length).join(""))
                  let numLen = (parseInt(numsArr.slice(i,numsArr.length).join("")) + 1).toString().length
                  rest = numsArr.slice(0,i)
                  newNum = num + 1
                  if(rest.length + numLen > 4){
                    rest.length = 4 - numLen
                  }
                  newNum = rest.concat(newNum).join("")
                  break
                }
              }
              return newNum;
}
     async function readMyUserDetails(collection,doc,fieldkey) {
      let details;
            if (!currentUser) {
                console.warn("No user signed in to read details.");
                alert("Please sign in first!");
                window.location = "https://andreas-hodo.github.io/Chess/login/"
                return;
            }
            try {
                const userDocRef = db.collection(collection).doc(doc);
                const docSnap = await userDocRef.get();
                if (fieldkey) {
                details = docSnap.data()[doc]
                //console.log("Details:",details,130)
                }else{
                  details = docSnap.data()
                  //console.log("Details in read:",details,133)
                }
                return details
            } catch (error) {
              console.log(error)
            } 
        }
        async function updateMyUserDetails(mode,typeSet,sectypeSet,doc,typedet,user,fieldkey) {
          let actions = {
            update: async (type,doc,details) =>{
                try{
                 const userDocRef = db.collection(type).doc(doc);
                //if(userDocRef.exists){
                  await userDocRef.update(details);
                //} 
                }catch(error){
                  console.error(error.message)
                }    
            },
            set: async (type,doc,details) =>{
                try{
                const userDocRef = db.collection(type).doc(doc);
                //if(userDocRef.exists){
                await userDocRef.set(details);
                //}
                }catch(error){
                  console.error(error.message)
                }
            },
            details: async (typedet,user,sectypeSet,doc)=>{
              //console.log(typedet,user,typeset,doc,fieldkey)
              let details;
              return await readMyUserDetails(sectypeSet,doc,doc).then(allusers =>{
                return  getUsersNum(allusers)
              }).then(newUsersNum =>{
                if(typedet == "counter"){        
                details = {users:newUsersNum}
              }else{
                details = {roomId:newUsersNum,displayName:user.displayName,isnewUser: true}
              }
               return details
              })                                
            }
          }
            if (!currentUser) {
                console.warn("No user signed in to update details.");
                alert("Please sign in first!");
                return;
            }
            try {
              actions.details(typedet,user,sectypeSet,fieldkey).then(Alldetails =>{
                //console.log("Details in actions: ",Alldetails)
                actions[mode](typeSet,doc,Alldetails)
              })
            } catch (error) {
              console.error(error.message)
              alert("An Error has occured!");
            }
        }


function connect_user(){
  var playerid;
  var name;
  let allplayersRef = firebase.database().ref(`players`)
  let allRoomsRef = firebase.database().ref(`Rooms`)
  let allGamesRef = firebase.database().ref(`Games`) 
  let newUser;
 firebase.auth().onAuthStateChanged(async (user) =>{
    if(user){
      currentUser = user
      await readMyUserDetails("usersDetails",user.uid,null).then(status =>{
        newUser = status.isnewUser
      })
      let msg = newUser ? `Welcome to our page ${user.displayName}. To Play, press the Plus Button or Search for an existing game.` : `Welcome back ${user.displayName}.` 
      alert(msg)       
      playerid = user.uid
      name = user.displayName
       
       if(newUser){
        updateMyUserDetails("update","UsersCounter","UsersCounter","users","counter",user,"users")
        updateMyUserDetails("set","usersDetails","UsersCounter",user.uid,"roomId",user,"users")
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