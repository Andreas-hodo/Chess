const login = document.getElementById("login_form")
const signup = document.getElementById("signup_form")
const login_btn = document.getElementById("loginbtn") 
const signup_btn = document.getElementById("signupbtn")

async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, 
    ["encrypt", "decrypt"]
  );
  return key;
}    
async function getKey() {
  const key = await generateKey();
  const exportedKey = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
}    
async function safe(data){
    const secretKey = await getKey();
    const name_encrypted = CryptoJS.AES.encrypt(data.name, secretKey).toString();
    const pass_encrypted = CryptoJS.AES.encrypt(data.password, secretKey).toString(); 
    return {name:name_encrypted,password:pass_encrypted,key:secretKey,secretKey}
}

login.addEventListener("submit",(e)=>{
    e.preventDefault()
    var all_usersnames = []
    var all_userspasswords = []
    login_btn.disabled = true
    login_btn.style.opacity = "0.5"
    const name = document.getElementById("username_login").value
    const password = document.getElementById("password_login").value
     users_data.get().then(snapshot => {
       snapshot.docs.forEach(doc => {
        let name = CryptoJS.AES.decrypt(doc.data().name,doc.data().key).toString(CryptoJS.enc.Utf8);
        let password = CryptoJS.AES.decrypt(doc.data().password,doc.data().key).toString(CryptoJS.enc.Utf8);
        all_usersnames.push(name)
        all_userspasswords.push(password)
       });
     }).then(() =>{
      var username_elem = document.getElementById("username_login")
      var password_elem = document.getElementById("password_login")
      if(localStorage.getItem("cookiesaccected") == "true" && all_usersnames.includes(name) && all_userspasswords.includes(password)){
            localStorage.setItem("name",username_elem.value)
            localStorage.setItem("pass",password_elem.value)
      }
     }).then(() =>{
        var username_elem = document.getElementById("username_login")
        var password_elem = document.getElementById("password_login")
        username_elem.style.borderColor = "black" 
        password_elem.style.borderColor = "black" 
        if(all_usersnames.includes(name) && all_userspasswords.includes(password)){
             login_btn.disabled = false
             login_btn.style.opacity = "1"
             window.location = `https://andreas-hodo.github.io/Chess/games?acc=${name}`
        }else if(!all_usersnames.includes(name)){
            username_elem.style.borderColor = "red"
            login_btn.disabled = false
            login_btn.style.opacity = "1"
        }else if(!all_userspasswords.includes(password)){
            password_elem.style.borderColor = "red"
            login_btn.disabled = false
            login_btn.style.opacity = "1"
        }  
     }).catch(error => {
      login_btn.disabled = false
      login_btn.style.opacity = "1"
      alert("Somethig went wrong!")
     });   
})
signup.addEventListener("submit",(e)=>{
    e.preventDefault()
    signup_btn.disabled = true
    signup_btn.style.opacity = "0.5"
    var all_usersdata = []
    const name = document.getElementById("username_signup")
    const password = document.getElementById("password_signup")
    users_data.get()
    .then(snapshot => {
      snapshot.docs.forEach(doc => {    
  let name = CryptoJS.AES.decrypt(doc.data().name,doc.data().key).toString(CryptoJS.enc.Utf8);
      all_usersdata.push(name)
      });
    }).then(() =>{
        if(!all_usersdata.includes(name.value)){
          safe({name: name.value, password: password.value})
    .then((res) => {  
        users_data.add({name:res.name,password:res.password,key:res.key}).then(() =>{
          var username_elem = document.getElementById("username_signup")
          var password_elem = document.getElementById("password_signup")
          if(localStorage.getItem("cookiesaccected") == "true"){ 
                localStorage.setItem("name",username_elem.value)
                localStorage.setItem("pass",password_elem.value)
          }
          emailVerification(username_elem.value,password_elem.value)
         }).catch((err) => {
          console.log(err)
          signup_btn.disabled = false
          signup_btn.style.opacity = "1"
            alert("Somethig went wrong!")
          });
    })
        }else{
            alert("This name is already taken")
            name.value = "" 
            password.value = ""
            signup_btn.disabled = false
            signup_btn.style.opacity = "1"
        }
    }).catch(err => {
      alert("Somethig went wrong!",err)
      signup_btn.disabled = false
      signup_btn.style.opacity = "1"
    }); 
})


function emailVerification(email,pass){
const auth = firebase.auth();
auth.onAuthStateChanged((user)=>{
//   if(user){
    console.log("User:",user)
//}
})
auth.createUserWithEmailAndPassword(email,pass).then((loggeduser) =>{
   return loggeduser
}).then(async (loggeduser)=>{
    if (!loggeduser.emailVerified) { 
        await loggeduser.user.sendEmailVerification({
          url: 'https://andreas-hodo.github.io/Chess/games/',
          handleCodeInApp: true,
        })
      } else {
        await Promise.resolve()
}
}).catch((err)=>{
  console.error(err)
})
}


