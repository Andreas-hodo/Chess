let changebtn;
let profilepopup;


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

async function createRoom(name,userId){  
  let id; //= getRandom(0,9,4)
  await readMyUserDetails("usersDetails",userId,null).then(data =>{
      id = data.roomId
    let newRoom = firebase.database().ref(`Rooms/${name}-${id}/Game`)
  let player1 = {
    team:"white"
  }
  player1.name = name
  newRoom.set({
    playerName:name,
    roomId:id,
    full:false
  })
  let game = firebase.database().ref(`Games/${name}-${id}`)
  game.set({
    roomId:id,
    full:false,
    player1
  })
   window.location  = "https://andreas-hodo.github.io/Chess/Game/"
  })
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
     var current_card = document.getElementById(`${user.name}-${user.room_id}`)
       current_card.classList.toggle("hide", !isVisible || !searching)
    })
 })
 }
async function connectEnemy(host,enemy,roomId){
 let roomid = roomId
 let addEnemy =  firebase.database().ref(`Games/${host}-${roomid}`)
 let changeRoom = firebase.database().ref(`Rooms/${host}-${roomid}/Game`)
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
  my_node = firebase.database().ref(`Rooms/${host}-${roomid}`)
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
              console.error(error)
            } 
        }


async function updateMyUserDetails(mode, typeSet, sectypeSet, doc, typedet, user, fieldkey) {
  const actions = {
    update: async (type, doc, details) => {
      try {
        const userDocRef = db.collection(type).doc(doc);
        await userDocRef.update(details);
      } catch (error) {
        console.error("Error updating document:", error.message);
        throw error;
      }
    },
    set: async (type, doc, details) => {
      try {
        const userDocRef = db.collection(type).doc(doc);
        await userDocRef.set(details);
      } catch (error) {
        console.error("Error setting document:", error.message);
        throw error;
      }
    },
    details: async (typedet, user, sectypeSet, doc) => {
      const allusers = await readMyUserDetails(sectypeSet, doc, doc);     
      let details;
      if (typedet === "counter") {
        const newUsersNum = getUsersNum(allusers);
        details = { users: newUsersNum };
      } else {
        details = { roomId: allusers, displayName: user.displayName, isnewUser: true, email: user.email,dataRegistered:true};
      }
      return details;
    }
  };

  if (!currentUser) {
    console.warn("No user signed in to update details.");
    alert("Please sign in first!");
    return;
  }
  try {
    const Alldetails = await actions.details(typedet, user, sectypeSet, fieldkey);
    await actions[mode](typeSet, doc, Alldetails);
    return Alldetails;
  } catch (error) {
    console.error("An error occurred in updateMyUserDetails:", error.message);
    alert("An error has occurred!");
    throw error;
  }
}

function deleteData(type,user){
  console.log(type,user.uid)
return db.collection(type).doc(user.uid).delete().then(() => {        
  console.log("Document deleted. Check your Firestore data!");
 }).catch((error)=>{
  console.error(error.message)
  throw error
 })
}


function signout(){
  let auth = firebase.auth()
    const handleSignOut =  async () => {
            let playerRef = firebase.database().ref(`players/${currentUser.displayName}`)
            await playerRef.remove()
            auth.signOut().then(() => {
                    console.log("User signed out successfully!");
                    alert("You have been signed out.");
                }).then(()=>{
                  window.location = "https://andreas-hodo.github.io/Chess/login/"
                }).catch((error) => {
                    console.error("Error signing out:", error);
                    alert("Failed to sign out!");
                });
        };
        handleSignOut()
}

async function deleteacc() { 
    let auth = firebase.auth();
    let user = auth.currentUser;

    if (user) {
        const password = prompt("Please enter your password to confirm:");
        if (!password) { 
            alert("Account deletion cancelled.");
            return;
        }

        try {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
            await user.reauthenticateWithCredential(credential);
            if (confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
                let playerRef = firebase.database().ref(`players/${currentUser.displayName}`)
                await playerRef.remove()
                await deleteData("usersDetails", user);
                let Url = currentUser.photoURL
                if(Url){
                 let filename = Url.slice(Url.lastIndexOf("/") + 1,Url.length)
                deletephotoprofile(`userimage/${filename}`) 
                }                                
                await user.delete();              
                console.log("User account and associated Firestore data deleted successfully!");
                alert("Your account and data have been deleted. You will now be redirected.");
                window.location.href = "https://andreas-hodo.github.io/Chess/login/";
            } else {
                alert("Account deletion cancelled.");
            }
        } catch (error) {
            console.error("Error during account deletion process:", error);
            if (error.code === 'auth/requires-recent-login') {
                alert("Please sign in again (re-enter password) to confirm this action before deleting your account.");
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                alert("Incorrect password. Please try again.");
            } else {
                alert("Failed to delete account: " + error.message);
            }
        }
    } else {
        alert("No user is currently signed in.");
        window.location.href = "https://andreas-hodo.github.io/Chess/login/";
    }
}

async function deletephotoprofile(filePath){
  if(currentUser){
    const {data,error} = await storage.storage.from("profile-photos").remove([filePath]);
     if(error){
       console.error(error.message)
       return
     }
  }   
}

async function createprofilepopup(data,userId){
  try{
  await readMyUserDetails("usersDetails",userId,null).then(fetchedData =>{
    let Getvalues = Array.from(Object.values(data))
    let Fetchvalues = Array.from(Object.values(fetchedData))
    Getvalues.forEach(item =>{
      if(!Fetchvalues.includes(item)){
        return  
      }
  })
  })
  let profile = document.createElement("div")
  profile.classList.add("profilepopup")
  profile.id = "userprofile"
  let container = document.querySelector(".cont")
  let PhotoUrl = currentUser.photoURL ? currentUser.photoURL : "images/default-photoprofile.png"
  profile.innerHTML = `
  <div class="startdata">
    <h5 id="useremail">${data.email}</h5>
    <i class="fa-solid fa-x" id="closebtn" aria-hidden="true"></i>  
  </div>
  <div class="profileimgcont">
      <div class="addImagebtncont"><input type="file" id="selectimagebtn" class="imagebtn" title="Change!"><i class="fa-solid fa-pencil" aria-hidden="true"></i></div>
      <div class="profilepicture" id="profpicture">  
          <img id="profileImg" src="${PhotoUrl}" alt="photoProfile">
      </div>
      </div><h5 id="disname">Hi,${data.displayName}!</h5>
      <h5 id="idacc">your account id is ${data.roomid}</h5>
      <div class="actions">
        <input type="button" class="actionsbtns" id="signout" value="Sign out">
         <input type="button" id="delacc" class="actionsbtns" value="Delete Account">
      </div>
    `
    container.appendChild(profile)
    let signoutelem = document.getElementById("signout")
    signoutelem.addEventListener("click",signout)
    const deleteAccountButton = document.getElementById("delacc");
    deleteAccountButton.addEventListener('click',deleteacc)  
    changebtn = document.getElementById("selectimagebtn")
    profilepopup = profile;
    let profilebtn = document.getElementById("profbtn")
    let btnpopup = document.getElementById("profile_cont")
    profilebtn.addEventListener("click",()=>{
        btnpopup.style.display = "none"
        profilepopup.style.display = "flex"   
    })
    let close = document.getElementById("closebtn")
    close.addEventListener("click",()=>{
      profilepopup.style.animation = "fade-out 0.8s linear"
      setTimeout(()=>{
        profilepopup.style.display = "none" 
        btnpopup.style.display = "flex"
        profilepopup.style.animation = ""
      },500)  
    })
    changebtn.addEventListener("change",async ()=>{
    try{
    const file = document.getElementById("selectimagebtn").files[0]
    if(currentUser){
    const filePath = `userimage/${Date.now()}-${file.name}`;
    if(!file){
       return alert("Select a photo first!")
    }else{
     const {data,error} = await storage.storage.from("profile-photos").upload(filePath,file,{cacheControl:'3600',upset:false});
     if(error){
       console.error(error.message)
       return
     }
     const {data:publicUrlData } = storage.storage.from("profile-photos").getPublicUrl(filePath)
     let img = document.getElementById("profileImg")
     img.src = publicUrlData.publicUrl
     let oldUrl = currentUser.photoURL
     if(oldUrl){
      let oldfilename = oldUrl.slice(oldUrl.lastIndexOf("/") + 1,oldUrl.length)
     deletephotoprofile(`userimage/${oldfilename}`)
     } 
     await currentUser.updateProfile({
        photoURL: publicUrlData.publicUrl
     })
    }      
    }else{
      console.log("NO USER!")
    }
    }catch(error){
      console.error(error.message)
    }
    })
  }catch(error){
     console.error(error.message)
  }
}

function connect_user(){
  var playerid;
  var name;
  let allplayersRef = firebase.database().ref(`players`)
  let allRoomsRef = firebase.database().ref(`Rooms`)
  let allGamesRef = firebase.database().ref(`Games`) 
  let newUser;
  let datareg;
 firebase.auth().onAuthStateChanged(async (user) =>{
    if(user){
      if(!user.emailVerified || !user.displayName){
        alert("To proceed further you must verify your email first and provide a username, now you will redirected to login page!")
        window.location = "https://andreas-hodo.github.io/Chess/login/"
      }
      currentUser = user
      await readMyUserDetails("usersDetails",user.uid,null).then(status =>{
        newUser = status.isnewUser
        datareg = status.dataRegistered
      })
      let msg = newUser ? `Welcome to our page ${user.displayName}. To Play, press the Plus Button or Search for an existing game.` : `Welcome back ${user.displayName}.` 
      alert(msg)       
      playerid = user.uid
      name = user.displayName 
       if(newUser && !datareg){
        await updateMyUserDetails("update","UsersCounter","UsersCounter","users","counter",user,"users")
        await updateMyUserDetails("set","usersDetails","UsersCounter",user.uid,"roomId",user,"users").then((data)=>{
            //console.log("Data: ",data)
              let roomid = data.roomId
              createprofilepopup({email:user.email,displayName:user.displayName,roomid},user.uid)
        })
       }else{
        await readMyUserDetails("usersDetails",user.uid,null).then(status =>{
        let roomid = status.roomId
        createprofilepopup({email:user.email,displayName:user.displayName,roomid},user.uid)
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
        let roomId = data.Game.roomId
        if(Enemyname && roomId){
               let roomElem = document.getElementById(`${Enemyname}-${roomId}`)
               if(!roomElem){
                var newRoom = document.createElement("tr")
                   newRoom.className = "card hide"                  
                   //console.log("Enemy name from child added",Enemyname)
                   newRoom.id = `${Enemyname}-${roomId}`
                    var newRoomDetails = `
                                  <td>${Enemyname}</td>
                                 <td>${roomId}</td>
                                 <td id="${roomId}">${avail}<td>`
                                 newRoom.innerHTML = newRoomDetails         
                    var tablebody = document.querySelector("tbody")
                    tablebody.appendChild(newRoom) 
                    newRoom.onclick = () =>{
                      connectEnemy(Enemyname,name,roomId)
                     }  
                } 
        }          
     })
     allRoomsRef.on("value",snapshot =>{
      var data = snapshot.val()
      if(data){
        var tablebody = document.querySelector("tbody")
        let first = Object.values(data)[0]
        let roomDetails = Object.values(first)[0]
        let roomElem = document.getElementById(`${roomDetails.playerName}-${roomDetails.roomId}`)
        if(!roomElem){
          let avail = roomDetails.full ? "Not Available" : "Available"
            var newRoom = document.createElement("tr")
        newRoom.className = "card hide"
        let Enemyname = roomDetails.playerName
        //console.log("Enemy name from value",Enemyname)
        let roomId = roomDetails.roomId
        newRoom.id = `${Enemyname}-${roomId}`
         var newRoomDetails = `
                       <td>${Enemyname}</td>
                      <td>${roomId}</td>
                      <td id="${roomId}">${avail}<td>`
                      newRoom.innerHTML = newRoomDetails         
         tablebody.appendChild(newRoom)
         newRoom.onclick = () =>{
          connectEnemy(Enemyname,name,roomId)
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
        createRoom(name,user.uid)
      })
      search_room()
      playerRef.onDisconnect().remove()
    }else{
      currentUser = null
      alert("You are not login! you will be redirected to login page")
      window.location = "https://andreas-hodo.github.io/Chess/login/"
    }
  })
}
window.onload =  connect_user()