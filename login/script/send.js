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
   message(null,"login","reset",email)
}
passforgot.onclick = (e) =>{
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
                    message(null,"login","",email,true)                   
                });  
})
signup.addEventListener("submit",(e)=>{
    e.preventDefault()
    signup_btn.disabled = true
    signup_btn.style.opacity = "0.5"
    const email = document.getElementById("username_signup")
    const password = document.getElementById("password_signup")
    emailVerification(email.value,password.value)
    cresupaacc(email.value,password.value)
    cookies(email)
})

async function cresupaacc(email,pass) {
  if(email && pass){
  try {
    let { data: supabaseAuthData, error: supabaseError } = await storage.auth.signUp({
        email,
        password: pass,
    });
    }catch(error){
    alert("An error has occured!")
    console.log(error.message)
    }  
  }  
}


function username(){
    let auth = firebase.auth()
  auth.onAuthStateChanged(async user =>{
    if(user){
      //console.log(user)
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
  window.location = `https://andreas-hodo.github.io/Chess/games/?new=true`
  }).catch((error) => {
    alert("Something went wrong!")
  });
}
}
}
  })
}

function message(loggeduser,form,type,email,error = false){
           let useremail = loggeduser ? loggeduser.user.email : email
           let text = {
            login: (container) =>{login.appendChild(container)},
            signup: (container)=>{signup.appendChild(container)},
            verifycation: async() =>{ 
              await  loggeduser.user.sendEmailVerification()
              localStorage.setItem("emailSent",true)
              localStorage.setItem("emailVerified",false)
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
        text[type]()
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
      if(!error){
        text[type]()
      }
      let contelem = document.getElementById(`messageContainer${form}`)
      let emailTemplate = `<p class="messages first">An ${type} email was sent in</p>
<p class="messages second" style="top:5%;">${useremail}</p>
<p class="messages resend">Didnt receive the Email?<a href="#" class="resendbtn" id="resendbtn${form}">Resend Email</a></p>`
      let errorTemplate = `<p class="messages first">Email or Password is incorrect!</p>`
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

function checkEmailVerified(userlogged){
     let emailVerified = false
     const auth = firebase.auth();
  auth.onAuthStateChanged(user =>{
    if(user){
      let reloadfunc = async () =>{
      await user.reload()
      //console.log(user)
      emailVerified = user.emailVerified
      localStorage.setItem("emailVerified",user.emailVerified)
      if(emailVerified){
        //console.log("Email verified!")
        try{
        const userDocRef = db.collection("usersDetails").doc(user.uid);
        if(!userDocRef.exists && userlogged.additionalUserInfo.isNewUser){
          await userDocRef.set({
            isnewUser: true,
          })      
          }
        }catch(error){
          console.error(error.message)
        } 
        localStorage.removeItem("emailSent")
        localStorage.removeItem("emailVerified")
        username()  
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
        message(loggeduser,"signup","verifycation",loggeduser.user.email)
        return loggeduser
      } else {
        await Promise.resolve()
}
}).then((userlogged)=>{
  checkEmailVerified(userlogged)
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
            // isnewUser: true,
            email:user.email
          })
          }catch(error){
            console.error(error.message)
          }
        //localStorage.setItem("email",emailfield.value)
    }
  }
});
}
let func = () =>{
  if(localStorage.getItem("emailSent") && localStorage.getItem("emailVerified") == false){
    console.log("Email sent but not verified!")
    checkEmailVerified()
  }else if(localStorage.getItem("emailSent") && localStorage.getItem("emailVerified")){
    username() 
  }
}
func()

