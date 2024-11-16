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
signup_btn.addEventListener("click",()=>{
 var names = [];
users_data.get().then((snapshot) => {
  snapshot.forEach((doc) => {
   names.push(doc.data().name)
  });
}).catch((error) => {
  alert("Something went wrong...")
});
console.log(names);
})

