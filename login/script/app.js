let eyes = document.querySelectorAll(".fa-eye")
eyes.forEach(eye =>{
    eye.addEventListener("click",(e)=>{
       if(e.target.classList.contains("fa-eye")){
          e.target.classList.replace("fa-eye","fa-eye-slash")
       }else if(e.target.classList.contains("fa-eye-slash")){
          e.target.classList.replace("fa-eye-slash","fa-eye")
       }
    })
})