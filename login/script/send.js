const login = document.getElementById("login_form")
const signup = document.getElementById("signup_form")
const login_btn = document.getElementById("loginbtn") 
const signup_btn = document.getElementById("signupbtn")
const passforgot = document.getElementById("forgotpass")
let resendBtn;
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
let resetfunc = (e) =>{
  let email = document.getElementById("username_login").value
  email ? message(null,"login","reset",email,false,"","","red") : message(null,"login","reset",email,true,"Please enter your email first!","","red")
}
passforgot.onclick = (e) =>{
  sessionStorage.setItem("reset",true)
  resetfunc(e)
}

login.addEventListener("submit",(e)=>{
    e.preventDefault()
    const auth = firebase.auth();
    const email = document.getElementById("username_login")
    const password = document.getElementById("password_login")
    login_btn.disabled = true
    login_btn.style.opacity = "0.5"    
    passforgot.disabled = false
    passforgot.style.opacity = "1"
    passforgot.onclick = (e) =>{
         resetfunc(e)
    }
    auth.signInWithEmailAndPassword(email.value, password.value)
                .then(async (userCredential) => {
                  login_btn.disabled = false
                  login_btn.style.opacity = "1"
                  //cookies(email)                 
                  //console.log("UserCredential",userCredential)
                  if(!userCredential.user.displayName){
                    username()
                  }else if(userCredential.user.displayName && userCredential.user.emailVerified){
                    try{
                    const userDocRef = db.collection("usersDetails").doc(userCredential.user.uid);
                    if(!userCredential.additionalUserInfo.isNewUser){
                    await userDocRef.update({
                      isnewUser: false
                    })
                    }
                    }catch(error){
                       console.error(error.message)
                    }
                  window.location = `https://andreas-hodo.github.io/Chess/games/?new=false`
                  }                                                    
                }).catch((error) => {
                    //console.log(error.message)
                    login_btn.disabled = false
                    login_btn.style.opacity = "1"
                    message(null,"login","",email,true,"Email or Password is incorrect!","","red")                   
                });  
})
signup.addEventListener("submit",(e)=>{
    e.preventDefault()
    signup_btn.disabled = true
    signup_btn.style.opacity = "0.5"
    const email = document.getElementById("username_signup")
    const password = document.getElementById("password_signup")
    emailVerification(email.value,password.value)
    cookies(email)
})


function username(){
    let auth = firebase.auth()
  auth.onAuthStateChanged(async user =>{
    if(user){
      //console.log(user)
      let popup = document.querySelector(".usernamepanel")
      if(popup){return}
      if(user.emailVerified && !user.displayName){
  let panel = document.createElement("form")
  panel.classList.add("usernamepanel")
  panel.innerHTML = `
  <h3 id="usernametitle">Enter your username:</h3>
  <input type="text" minlength="3" maxlength="10" id="disname" pattern ="(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{3,10}" title="Username must be 3 to 10 characters long" required>
  <button type="submit" id="okbtn">OK</button>`
  let disname;
  let formchange = (type) =>{
  let forms = document.querySelectorAll("form")
  forms.forEach(form =>{
  form.style.display = type
  })
  }
  formchange("none")
  document.body.appendChild(panel)
  //let btn = document.getElementById("okbtn")
  panel.addEventListener("submit",(e)=>{
    e.preventDefault()
    disname = document.getElementById("disname")
    let disnameVal = disname.value
    let disnameLen = disnameVal.length >= 3 && disnameVal.length <= 10 ? true : false
    if(disnameLen){
    document.body.removeChild(panel)
    formchange("flex")   
    updatedisplayname(disnameVal)
    }  
  })
  let updatedisplayname = async (name) =>{
  await user.updateProfile({
    displayName: name 
  }).then(() =>{
  localStorage.removeItem("disname")
  localStorage.removeItem("emailVerified")
  window.location = `https://andreas-hodo.github.io/Chess/games/?new=true`
  }).catch((error) => {
    alert("Something went wrong!")
  });
}
}
}
  })
}

function message(loggeduser,form,type,email,error = false,message = "",distype = "",messageColor){
           let currentUser = loggeduser ? loggeduser.user ?  loggeduser.user : loggeduser : null
           let useremail = currentUser ? currentUser.email : email
           let finaltype = type ? type : distype
           let text = {
            login: (container) =>{login.appendChild(container)},
            signup: (container)=>{signup.appendChild(container)},
            verification: async() =>{ 
              //await  loggeduser.user.sendEmailVerification()
              currentUser.sendEmailVerification()
              localStorage.setItem("emailSent",true)
              localStorage.setItem("emailVerified","")
            },
            reset: async()=>{ await ResetPassword(useremail);
        passforgot.disabled = true
        passforgot.style.opacity = "0.5"
        passforgot.onclick = () =>{}
      },createcont: (template) =>{
        let top = error ? "12%" : "7%"
        let container = document.createElement("div")
        container.className = "msgcont"
        container.id = `messageContainer${form}`
        container.style.top = top
        container.innerHTML = template
        text[form](container) 
        resendBtn = document.getElementById(`resendbtn${form}`)
        if(!error){
        let resendfunc = async (e) =>{
        text[finaltype]()
        if(form != "signup"){
        text[form](container) 
        }
        e.target.disabled = true
        e.target.style.opacity = "0.5"
        e.target.onclick = () =>{}
        setTimeout(()=>{
              e.target.disabled = false
              e.target.style.opacity = "1"
              e.target.onclick = () =>{resendfunc(e)}
        },60000)
        }
        resendBtn.onclick = (e) =>{
           resendfunc(e)
        }
        }        
      }
      }
      if(!error && type){
        text[type]()
      }
      let contelem = document.getElementById(`messageContainer${form}`)
      let emailTemplate = `<p class="messages first">An ${finaltype} email was sent in</p>
<p class="messages second" style="top:5%;">${useremail}</p>
<p class="messages resend">Didnt receive the Email?<a href="#" class="resendbtn" id="resendbtn${form}">Resend Email</a></p>`
      let errorTemplate = `<p class="messages first" style="color:${messageColor}!important">${message}</p>`
        if(!contelem && !error){
            text.createcont(emailTemplate)
        }else if(contelem && !error){
           contelem.innerHTML = emailTemplate
           contelem.style.top = "7%"
        }else if(!contelem && error){
          text.createcont(errorTemplate)
        }else if(contelem && error){
          contelem.innerHTML = errorTemplate
          contelem.style.top = "12%"
        }
}


async function ResetPassword(email) {
  const auth = firebase.auth();
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return "No user found with that email address."
      //alert("No user found with that email address.");
    } else if (error.code === "auth/invalid-email") {
      return "The email address is not valid."
      //alert("The email address is not valid.");
    } else {
      alert("Somethig went wrong!")
    }
  }
}

function checkEmailVerified(){
     let emailVerified = false
     const auth = firebase.auth();
  auth.onAuthStateChanged(user =>{
    if(user){
      let reloadfunc = async () =>{
      await user.reload()
      //console.log(user)
      emailVerified = user.emailVerified
      let res = user.emailVerified ? true : ""
      localStorage.setItem("emailVerified",res)
      localStorage.setItem("disname","")
      if(emailVerified){
        //console.log("Email verified!")
        try{
        const userDocRef = db.collection("usersDetails").doc(user.uid);
          await userDocRef.update({
            isnewUser: true,
          })      
        }catch(error){
          console.error(error.message)
        } 
        localStorage.removeItem("emailSent")
        message(user,"signup","",user.email,true,"Email verified successfully!","","green")
        setTimeout(()=>{
          username() 
        },4000)  
      }else{
        //console.log("Email still not verified!")
        setTimeout(reloadfunc,10000)
      }  
      }
      if(!user.emailVerified){
        reloadfunc()
      }     
    }
    })
}



function emailVerification(email,pass){
const auth = firebase.auth();
auth.createUserWithEmailAndPassword(email,pass).then((loggeduser) =>{
   return loggeduser
}).then(async (loggeduser)=>{
      if (!loggeduser.emailVerified) { 
        message(loggeduser,"signup","verification",loggeduser.user.email,false,"","","red")
        return loggeduser
      } else {
        await Promise.resolve()
}
}).then((userlogged)=>{
  checkEmailVerified()
}).catch((err)=>{
  signup_btn.disabled = false
  signup_btn.style.opacity = "1"
  let emailsign = document.getElementById("username_signup")
  emailsign.value = ""
  let passsign = document.getElementById("password_signup")
  passsign.value = ""
  alert(err.message)
})
}

async function cookies(emailfield){
  const auth = firebase.auth();
  auth.onAuthStateChanged(async user => {
  if (user) {
    if(user.email && localStorage.getItem("cookiesAccepted") && emailfield.value && !localStorage.getItem("email")){
      try{
        const userDocRef = db.collection("usersDetails").doc(user.uid);
          await userDocRef.set({
             isnewUser: true,
            //email:user.email
          })
          }catch(error){
            console.error(error.message)
          }
        //localStorage.setItem("email",emailfield.value)
    }
  }
});
}

async function validation(){
   const auth =  firebase.auth()
   sessionStorage.setItem("currentForm","signup")
   let index;
   const autochange = {
    login: ()=>{
      index = 1
      login.style.zIndex = index;
    },
    signup:()=>{
      index = 0
      login.style.zIndex = index;
    },
    autofill:(user,currentform)=>{
      console.log(currentform)
      let emailElem = document.getElementById(`username_${currentform}`)
      emailElem.value = user.email
    }
   } 
  let form = sessionStorage.getItem("currentForm")
  if(form){
    autochange[form]()
  }
  auth.onAuthStateChanged(async user => {
    if(user){  
      
      autochange.autofill(user,form)
      if(localStorage.getItem("emailSent") && localStorage.getItem("emailVerified") == ""){
        console.log("Email sent but not verified!")
        signup_btn.disabled = true
        signup_btn.style.opacity = "0.5"
        message(user,"signup","",user.email,false,"","verification","red")
        checkEmailVerified()
      }
    }   
    if(sessionStorage.getItem("reset")){
      let email = document.getElementById("username_login").value
      email ? message(null,"login","reset",email,false,"","","red") : message(null,"login","reset",email,true,"Please enter your email first!","","red")
    }  
  }) 
  if(localStorage.getItem("emailVerified") && localStorage.getItem("disname") == ""){
    console.log("No username found!")
    username()
  }    
}

window.onload = validation()

