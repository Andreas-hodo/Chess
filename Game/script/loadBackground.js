const main = document.querySelector(".main")
let handler = () =>{
  let arrows = document.querySelectorAll(".main .arrow")
  let width = window.innerWidth
  if(width <= 1070){
    arrows.forEach(arrow =>{
    main.removeChild(arrow)
    }) 
  }   
}