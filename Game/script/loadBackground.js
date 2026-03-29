const main = document.querySelector(".main")
let handler = (caller) =>{
    let arrows = document.querySelectorAll(".main .arrow")
    let path = caller == 2 ? "./images/" : caller == 1 ? "../images/" : null
    let width = window.innerWidth
    let imgElem = document.getElementById("backgroundImg")
    let wholePath; 
    if(width <= 1070){
      arrows.forEach(arrow =>{
      main.removeChild(arrow)
      }) 
    }   
    if(width <= 1000){
     wholePath = `${path}phonesBackground.jpg`  
    }else{
      wholePath = `${path}chess-game.jpg`
    }
    if(!imgElem){
    let img = document.createElement("img")
    img.classList.add("background")
    img.id = "backgroundImg"
    img.src = wholePath
    document.body.appendChild(img)
    }else{
      imgElem.src = wholePath
    }  
}



