const all_buttons = document.querySelectorAll(".forms_btns")  
const login_link = document.getElementById("member_log")
const signup_link = document.getElementById("member_sign")
const login_btn =  document.getElementById("loginbtn")
const signup_btn =  document.getElementById("signupbtn")
const elem = document.getElementById("login_form")
login_link.addEventListener("click",()=>{
 elem.style.zIndex = 1;
})
signup_link.addEventListener("click",()=>{
 elem.getElementById("login_form").style.zIndex = 0;
})
all_buttons.forEach(button =>{
    button.addEventListener("click",(e)=>{
     var change = e.target.classList[1] 
     if(change == "login"){
      elem.style.zIndex = 1;   
     }else if(change == "signup"){
        elem.style.zIndex = 0;
     }
     })
  })
  var names = [];
  function getNames(){
    users_data.get().then((snapshot) => {
      snapshot.forEach((doc) => {
      if(names.indexOf(doc.data().name) == -1){
        names.push(doc.data().name)
      }
      });
   }).catch(() => {
     alert("Something went wrong...")
   });
  }
signup_btn.addEventListener("click",(e)=>{
getNames()
var signup_username = document.getElementById("username_signup")
var signup_password = document.getElementById("password_signup")
let num = names.length + 1
 e.preventDefault();
  if(names.indexOf(signup_username.value) != -1){
  alert("This username is Already taken")
  signup_username.value = ""
 }else{
  const usersdata_ref = users_data.doc(`user${num}`)
  usersdata_ref.set({
      name:signup_username.value,
      password:signup_password.value
  })
  window.location = "rooms.html"
 }
})

