let profilebtn = document.getElementById("profbtn")

profilebtn.addEventListener("click",()=>{
    let profpopup = document.getElementById("userprofile")
    let btnpopup = document.getElementById("profilebtn_cont")
    btnpopup.style.display = "none"
    profpopup.style.display = "flex"   
})
console.log("ji")