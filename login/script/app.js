let eyes = document.querySelectorAll(".fa-eye-slash")
eyes.forEach(eye =>{
    eye.addEventListener("click",(e)=>{
      let elem = document.getElementById(`password_${e.target.id}`)
       if(e.target.classList.contains("fa-eye")){
         elem.type = "password"
         e.target.classList.replace("fa-eye","fa-eye-slash")
       }else if(e.target.classList.contains("fa-eye-slash")){
          e.target.classList.replace("fa-eye-slash","fa-eye")
          elem.type = "text"
       }
    })
})