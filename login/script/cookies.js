window.onload = () =>{
  let cookiepopup = document.createElement("div")
cookiepopup.id = "cookiepopup"
cookiepopup.innerHTML = `<div id="imagecontainer">
        <img src="images/386c33aa-091e-4021-8236-34db75d93c9b.webp">
    </div>   
    <div id="detailscontainer">
        <i class="fa-solid fa-x" id="closebtn" aria-hidden="true"></i>
        <h3>Our website uses Cookies</h3>
        <p class="detailscookie">This website uses cookies</p>
        <p class="detailscookie">to ensure you get the best</p><p class="detailscookie">experience on our website.</p>
        <button id="cookiesbtn">Accept</button>
    </div>`
  if(localStorage.getItem("cookiesAccepted") == "true"){
    cookiepopup.style.display = "none"
      if(localStorage.getItem("cookiesAccepted") == "true" && localStorage.getItem("email")){
        var username_elem = document.getElementById("username_login")
        username_elem.value = localStorage.getItem("email")
  }
  }else{
  setTimeout(()=>{
  document.body.appendChild(cookiepopup)
  let openedusername = localStorage.getItem("emailVerified") && localStorage.getItem("disname") == ""
  var namepopup;
  if(openedusername){  
  namepopup = document.querySelector(".usernamepanel")
  namepopup.style.display = "none"
  }
    cookiepopup.style.display = "flex"
    var elemcookie = document.getElementById("cookiesbtn")
var panel = document.getElementById("cookiepopup")
elemcookie.addEventListener("click",()=>{
  panel.style.animation = "fade-out 0.5s linear"
  setTimeout(()=>{
    panel.style.display = "none"
    if(openedusername){ 
    namepopup.style.display = "flex"
    }
  },500)
  localStorage.setItem("cookiesAccepted","true")
  document.body.removeChild(cookiepopup)
})
var close = document.getElementById("closebtn")
close.addEventListener("click",()=>{
    panel.style.animation = "fade-out 0.5s linear"
  setTimeout(()=>{
    panel.style.display = "none"
    if(openedusername){ 
    namepopup.style.display = "flex"
    }
  },500)
  localStorage.setItem("cookiesAccepted","false")
})
},500)
}
}