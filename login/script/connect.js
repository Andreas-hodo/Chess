const all_buttons = document.querySelectorAll(".forms_btns")  
const login_link = document.getElementById("member_log")
const signup_link = document.getElementById("member_sign")
const elem = document.getElementById("login_form")
login_link.addEventListener("click",()=>{
 elem.style.zIndex = 1;
})
signup_link.addEventListener("click",()=>{
 elem.style.zIndex = 0;
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

