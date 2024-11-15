const all_buttons = document.querySelectorAll(".forms_btns")  
const login_link = document.getElementById("member_log")
const signup_link = document.getElementById("member_sign")
login_link.addEventListener("click",()=>{
 document.getElementById("login_form").style.zIndex = 1;
})
signup_link.addEventListener("click",()=>{
 document.getElementById("login_form").style.zIndex = 0;
})
all_buttons.forEach(button =>{
    button.addEventListener("click",(e)=>{
     var change = e.target.classList[1] 
     var elem = document.getElementById("login_form")
     if(change == "login"){
      elem.style.zIndex = 1;   
     }else if(change == "signup"){
        elem.style.zIndex = 0;
     }
     })
  })