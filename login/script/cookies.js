window.onload = () =>{
  let cookiepopup = document.createElement("div")
cookiepopup.id = "cookiepopup"
cookiepopup.innerHTML = `<div id="imagecontainer">
        <img src="images/386c33aa-091e-4021-8236-34db75d93c9b.webp">
    </div>   
    <div id="detailscontainer">
        <i class="fa-solid fa-x" id="closebtn"></i>
        <h3>Our website uses Cookies</h3>
        <p class="detailscookie">This website uses cookies to ensure</p>
        <p class="detailscookie">you get the best experience on our website.</p>
        <button id="cookiesbtn">Accept</button>
    </div>`
  if(localStorage.getItem("cookiesaccected") == "true"){
    cookiepopup.style.display = "none"
      if(localStorage.getItem("cookiesaccected") == "true" && localStorage.getItem("email")){
        var username_elem = document.getElementById("username_login")
        username_elem.value = localStorage.getItem("email")
  }
  }else{
    document.body.appendChild(cookiepopup)
    cookiepopup.style.display = "flex"
    var elemcookie = document.getElementById("cookiesbtn")
var panel = document.getElementById("cookiepopup")
elemcookie.addEventListener("click",()=>{
  panel.style.animation = "fade-out 0.5s linear"
  setTimeout(()=>{
    panel.style.display = "none"
  },500)
  localStorage.setItem("cookiesaccected","true")
  document.body.removeChild(cookiepopup)
})
var close = document.getElementById("closebtn")
close.addEventListener("click",()=>{
    panel.style.animation = "fade-out 0.5s linear"
  setTimeout(()=>{
    panel.style.display = "none"
  },500)
  localStorage.setItem("cookiesaccected","false")
})
}

}