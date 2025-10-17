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
                .then((userCredential) => {
                  login_btn.disabled = false
                  login_btn.style.opacity = "1"
                  window.location = `https://andreas-hodo.github.io/Chess/games?acc=${email}`
                }).catch((error) => {
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
    if(localStorage.getItem("cookiesAccepted")){
      localStorage.setItem("email",email.value)
    }
    emailVerification(email.value,password.value)
})

function message(loggeduser,form,type,email,error = false){
           let useremail = loggeduser ? loggeduser.user.email : email
           let text = {
            login: (container) =>{login.appendChild(container)},
            signup: (container)=>{signup.appendChild(container)},
            verifycation: async() =>{ await  loggeduser.user.sendEmailVerification({
          url: 'https://andreas-hodo.github.io/Chess/games/',
          handleCodeInApp: false,
        })
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

function emailVerification(email,pass){
const auth = firebase.auth();
auth.createUserWithEmailAndPassword(email,pass).then((loggeduser) =>{
   return loggeduser
}).then(async (loggeduser)=>{
      if (!loggeduser.emailVerified) { 
        message(loggeduser,"signup","verifycation",loggeduser.user.email)
      } else {
        await Promise.resolve()
}
}).catch((err)=>{
  signup_btn.disabled = false
  signup_btn.style.opacity = "1"
  alert(err.message)
})
}
