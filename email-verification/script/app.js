let inputs = document.querySelectorAll(".codeCont input")
let Verifybtn = document.getElementById("verifybtn")
inputs.forEach(input => {
    input.addEventListener("input",(e)=>{
        let val = e.target.value
        let len = e.target.id.length
        let id = parseInt(Array.from(e.target.id)[len-1])
       if(isNaN(val)){
           e.target.value = ""
       }else if(val != "" && !isNaN(val) && id < 6){
         let next = document.getElementById(`num${id+1}`)
         next.focus()
    }
    })
    input.addEventListener("input",(e)=>{
        let ready = true
      for(let i = 1; i <= 6; i++){
        let curr = document.getElementById(`num${i}`)
        if(curr.value == ""){
            ready = false
           break  
        }
        }
       if(ready){
        Verifybtn.disabled = false
        Verifybtn.style.opacity = "0.95"
       }else{
        Verifybtn.disabled = true
        Verifybtn.style.opacity = "0.55"
       }
    })
});
