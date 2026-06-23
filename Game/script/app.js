class Game{
  #all_moves = []
  #captures = 0
  #counter = 3
  #full_moves = 1
  #half_moves = 0
  #gameStarted = false
  #has_legal = true
  #is_Checkmate = false
  #is_Draw = false
  #last_move = []
  #turn = "White's Turn"
  #isSoundAllowed = false
  #promotionData
  #timers = {white:null,black:null}
  setTimers(white,black){
    this.#timers.white = white
    this.#timers.black = black
  }
  getTimer(color){
    return this.#timers[color]
  }
  changesoundElement(){
    let volume = document.getElementById("volume")
    let tag = this.getSoundAllowed() ? "up" : "off"
    let othertag = tag == "up" ? "off" : "up"
    volume.classList.replace(`fa-volume-${othertag}`,`fa-volume-${tag}`)
  }
  changeSoundAllowed(){
    this.#isSoundAllowed = this.#isSoundAllowed ? false : true
    this.changesoundElement()     
  }
  getSoundAllowed(){
    return this.#isSoundAllowed
  }
  updateall_moves(move){
    this.#all_moves.push(move)
  }
  getall_moves(){
    return this.#all_moves
  }
  updateMoves(move){
    this.#all_moves.push(move)
  }
  getMoves(){
    return this.#all_moves
  }
  updatecaptures(){
    this.#captures++
  }
  getcaptures(){
    return this.#captures
  }
  updatecounter(){
    this.#counter++
  }
  getcounter(){
    return this.#counter
  } 
  updatefull_moves(){
    this.#full_moves++
  }
  getfull_moves(){
    return this.#full_moves
  }
  setgameStarted(val){
    this.#gameStarted = val
  }
  getgameStarted(){
    return this.#gameStarted
  }
  updatehalf_moves(moves){
    this.#half_moves = moves
  }
  gethalf_moves(){
    return this.#half_moves
  }
  sethas_legal(val){
    this.#has_legal = val
  }
  gethas_legal(){
    return this.#has_legal
  }
  setis_Checkmate(val){
    this.#is_Checkmate = val
  }
  getis_Checkmate(){
    return this.#is_Checkmate
  }
  setis_Draw(val){
    this.#is_Draw = val
  }
  getis_Draw(){
    return this.#is_Draw
  }  
  updatelast_move(move){
    this.#last_move = move
  }
  getlast_move(){
    return this.#last_move
  }
  updateturn(){
    if(this.#turn == "White's Turn"){
      this.#turn = "Black's Turn"
    }else{
      this.#turn = "White's Turn"
    }
  }
  getturn(){
    return this.#turn
  }
  getTurnTeam(){
    return this.#turn == "White's Turn" ? "white" : "black"
  }
  setPromotionData(data){
   this.#promotionData = data
  }
  getPromotionData(){
    return this.#promotionData
  }
  resultActions(winner,reason){
    if(!board.gameEnded()) return
    let endButtons = document.querySelectorAll("#columns1 i")   
    endButtons.forEach(btn => {
      btn.style.opacity = "0.7"
      btn.onclick = () =>{}
    })
    let colors = ["white","black"]
    colors.forEach(color =>{
      let currTimer = game.getTimer(color)
      if(!currTimer.getEnded()) currTimer.End(currTimer.remainingTime())
    })    
    board.disablePieces()
    board.getSquares().forEach(square => square.removeClick())
    game.showResult(winner,reason)
  }
  showResult(winner,reason){
    let msg = document.getElementById("winner")
    let finalres = document.getElementById("finalresult")
    msg.innerText = winner
    finalres.innerText = reason
    let respopup = document.getElementById("resultpopup")
    respopup.style.display = "flex"
    let finishSound = new Audio("https://andreas-hodo.github.io/Chess/Game/sounds/level-win-6416.mp3")
    if(game.getSoundAllowed()) finishSound.play()
  }
}


class Board extends Game{
 #all_pieces = []
 #all_squares = []
 #cordinates_x = [0,'a','b','c','d','e','f','g','h']
 #cordinates_y = [0,1,2,3,4,5,6,7,8]
 #fen = [0, 'rnbqkbnr', 'pppppppp', '8', '8', '8', '8', 'PPPPPPPP', 'RNBQKBNR', 'w', 'KQkq', '-', '0', '1']
 #king_status = []
 #stringFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
 clickedPiece = null
 addPiece(piece){
   this.#all_pieces.push(piece)
 }
 getPieces(){
  return this.#all_pieces
 }
 getSquares(){
  return this.#all_squares
 }
 copyFen(){
  navigator.clipboard.writeText(this.getstrFen())
 }
 getSquare(squarename){
   let square = null  
   this.getSquares().forEach(obj =>{ 
    if(obj.getName() == squarename){
      square = obj
    }
   })
   return square
 }
 getPiece(pieceName){
   let piece = null  
   this.getPieces().forEach(pieceobj =>{ 
    if(pieceobj.getName() == pieceName){
      piece = pieceobj
    }
   })
   return piece
 }
 #addSquare(square){
  this.#all_squares.push(square)
 }
 getSquares(){
  return this.#all_squares
 }
 getCoordX(){
  return this.#cordinates_x
 }
 getCoordY(){
  return this.#cordinates_y
 }
 CheckMate(){
  if(board.hasLegal()) return 
  let color = board.getTurnTeam()
  let currentKing = board.getPiece(`king_${color[0]}`)
  if(currentKing.getisInCheck()){
    game.setis_Checkmate(true)
    let winner = color == "white" ? "Black" : "White"
    game.resultActions(`${winner} WON!`,"by Checkmate!")
  }
 }
 Draw(){
  if(board.hasLegal()) return 
  let color = board.getTurnTeam()
  let currentKing = board.getPiece(`king_${color[0]}`)
  if(!currentKing.getisInCheck()){
    game.setis_Draw(true)
    game.resultActions("Draw!","No legal moves!")
  }
 }
 hasLegal(){
  let turn = board.getTurnTeam()
  let legal = false
  for(let i = 0; i < board.getPieces().length; i++){
    let piece = board.getPieces()[i]
    if(piece.getColor() == turn){
      let pieceElem = document.getElementById(piece.getName());
      let square = document.getElementById(piece.getSquare());
      piece.drag(pieceElem);     
      piece.drop({drag:pieceElem,drop:square}) 
      let movesLength = piece.getLegalMoves().length
      if(movesLength >= 1){legal = true;break}    
    } 
  }
  legal ? game.sethas_legal(true) : game.sethas_legal(false)
  return game.gethas_legal()
 }
 updateFen(startX,startY,destinationX,destinationY,enpassant,color){
  let samerow = startY == destinationY 
  let turn = board.getTurnTeam()[0]
  let [fullMoves,halfMoves] = [game.getfull_moves(),game.gethalf_moves()]
  let coordY = [startY,destinationY]
  let coordX = [startX,destinationX]
  let sameindex = samerow ? 1 : 2
  let castle = ""
  let colors = ["w","b"]
  for(let j = 0; j <= 1; j++){
    let sColor = colors[j]
    let castlepieces = [[`rook_2${sColor}`,"k"],[`rook_1${sColor}`,"q"],`king_${sColor}`]
    let king = board.getPiece(castlepieces[2])
    if(king.getMoved()) continue
    for(let i = 0; i <= 1; i++){
      let curr = board.getPiece(castlepieces[i][0])
      if(curr){
        if(curr.getMoved()) continue
        let piece = sColor == "w" ? castlepieces[i][1].toUpperCase() : castlepieces[i][1]
        castle+= piece        
    } 
  }
  }
  castle = castle || "-"
  for(let i = 0; i < sameindex; i++){
    let startsquare = `a${coordY[i]}`
    let rook = new Rook("white","rook",startsquare,"rook",1,coordY[i])
    let squares = [startsquare,rook.createRightMoves()].flat() 
    let newRow = ""
    let spaces = 0
    let fenIndex = 9 - coordY[i]
    squares.forEach((square,j) =>{        
      let sqobj = board.getSquare(square)
      let piecename = null;
      if(sqobj.hasPiece()){
        piecename = sqobj.getpieceName()
        let color = board.getPiece(piecename).getColor()
        let type = board.getPiece(piecename).getType()
        let index = type == "knight" ? 1 : 0
        piecename = color == "white" ? piecename[index].toUpperCase() : piecename[index]
      }else{spaces++} 
      if((piecename && spaces >= 1) || (!piecename && j+1 == squares.length)){newRow += spaces}
      if(piecename){newRow += piecename;spaces = 0}                 
    })
    board.setFenRow(fenIndex,newRow)      
  }
  let second = [turn,castle,enpassant,halfMoves,fullMoves]
  for(let i = 0,j = 9; i <= 4; i++,j++) board.setFenRow(j,second[i])
  let firstdata = board.getFen().slice(1,9).toString().replaceAll(",","/")
  let seconddata = board.getFen().slice(9,board.getFen().length).toString().replaceAll(","," ")
  board.setstrFen(`${firstdata} `.concat(seconddata))
 }
 setFen(fen){
   this.#fen = fen
 }
 setFenRow(index,rowData){
   this.#fen[index] = rowData
 }
 getFen(){
  return this.#fen
 }
 setKingStatus(availMoves){
   this.#king_status = availMoves
 }
 getKingStatus(){
  return this.#king_status
 }
 setstrFen(fen){
   this.#stringFen = fen
 }
 getstrFen(){
  return this.#stringFen
 }
  createSquares(){
    for(let i = 1; i <= 8; i++){
      for(let z = 1; z <= 8; z++){
      let squareId = this.getCoordX()[i] + this.getCoordY()[z]
      let piece = document.getElementById(squareId).firstChild 
      let pieceId = piece ? piece.id : null
      let defColor = (i % 2 == 1 && z % 2 == 0) || (i % 2 == 0 && z % 2 == 1) ? "white" : "black"
      let currentSquare = new Square(squareId,defColor,defColor,i,z)
      currentSquare.disableLeftClick()
      currentSquare.Click()
      let PieceData = new Piece().getPieceData(piece)
      if(pieceId){
        this.#createPieces(PieceData.color,pieceId,squareId,PieceData.type,i,z)  
      }     
      currentSquare.setpieceName(pieceId)
      this.#addSquare(currentSquare)
      }
    }
  }
  highlightLastMove(){
    this.getlast_move().forEach(square =>{
      let squareobj = this.getSquare(square)
      squareobj.applyColor("rgb(227,224,150)")
    })  
  }
  removehighlight(){
    this.getlast_move().forEach(square =>{
      let squareobj = this.getSquare(square)
      squareobj.removeColor()
    }) 
  }
  getPieceElement(targetId){
    let target = document.getElementById(targetId)
    return target
  }
  makePieceDraggable(piece){
    this.addPiece(piece)
    piece.initEvent()
    piece.initDrag()
    piece.initDrop()
    piece.initEnter()
    piece.initLeave()
    piece.initCancel()
    piece.disableLeftClick()
    piece.Click()
  }
  CreatePiece(color,name,square,type,x,y){
    let piece;
    switch(type){
      case "rook":
        piece = new Rook(color,name,square,type,x,y)
        break
      case "knight":
        piece = new Knight(color,name,square,type,x,y)
        break
      case "bishop":
        piece = new Bishop(color,name,square,type,x,y)
        break
      case "queen":
        piece = new Queen(color,name,square,type,x,y)
        break
      case "king":
        piece = new King(color,name,square,type,x,y)
        break
      case "pawn":
        piece = new Pawn(color,name,square,type,x,y)
        break
    }
    return piece
  }
  #createPieces(color,name,square,type,x,y){
    let piece = this.CreatePiece(color,name,square,type,x,y)
    this.makePieceDraggable(piece)
  }
  gameEnded(){
    let boardEnded = game.getis_Draw() || game.getis_Checkmate()
    let timerEnded = game.getTimer("white").getEnded() || game.getTimer("black").getEnded()
    let resignation = player1.getresigned() || player2.getresigned()
    let DrawAccepted = player1.getDrawAccepted() || player2.getDrawAccepted()
    return boardEnded || timerEnded || resignation || DrawAccepted
  }
  disablePieces(){board.getPieces().forEach(piece => piece.removeDragging())}
  Evaluation(){
    let piecesValues = {rook: 5,knight: 3,bishop: 3,queen: 9,pawn: 1}
    let Blackvalue = 0
    let Whitevalue = 0
    this.getPieces().forEach(piece =>{
      if(piece.getType() != "king"){
        switch(piece.getColor()){
          case "white":           
            Whitevalue += piecesValues[piece.getType()]
            break
          case "black":
            Blackvalue += piecesValues[piece.getType()]
            break
        }
      }
    })
    let materialnum = Whitevalue - Blackvalue
    let winingMaterial = Math.abs(materialnum) 
    let material = `+${winingMaterial}`
    let turnColor = board.getTurnTeam() 
    let materialCase = materialnum > 0 ? 1 : materialnum < 0 ? 2 : materialnum == 0 ? 3 : null     
    let pointswhite = document.getElementById(`whitematerial`)      
    let pointsblack = document.getElementById(`blackmaterial`)
    switch(materialCase){
      case 1:
        pointswhite.innerText = material
        pointsblack.innerText = null
        player2.materialPoints = material
        player1.materialPoints = 0
        break
      case 2:
        pointsblack.innerText = material
        pointswhite.innerText = null
        player1.materialPoints = material
        player2.materialPoints = 0
        break
      case 3:
        pointswhite.innerText = null
        pointsblack.innerText = null
        player1.materialPoints = 0
        player2.materialPoints = 0
        break
    }
  }
}


class Square extends Board{
  #name
  #color
  #defaultcolor
  #x
  #y
  #pieceName
  getSquareElement(targetId){
    let target = document.getElementById(targetId)
    return target
  }
  getName(){
    return this.#name
  }
  getColor(){
    return this.#color
  }
  getDefaultColor(){
    return this.#defaultcolor
  }
  getx(){
    return this.#x
  }
  gety(){
    return this.#y
  }
  setpieceName(piecename){
    this.#pieceName = piecename
  }
  getpieceName(){
    return this.#pieceName
  }
  constructor(name,color,defaultcolor,x,y){
   super()
   this.#name = name
   this.#color = color
   this.#defaultcolor = defaultcolor
   this.#x = x
   this.#y = y
  }
  disableLeftClick(){
    let sqelem = document.getElementById(this.getName())
    sqelem.addEventListener("contextmenu",e =>{e.preventDefault()})
  }
  removeClick(){
    let sqelem = document.getElementById(this.getName())
    sqelem.removeEventListener("click",this.#handleClick)
  }
  #handleClick(e){
    if(board.clickedPiece){
    let pieceelem = board.clickedPiece
    let pieceobj = board.getPiece(pieceelem.id)
    pieceobj.drop({drag:pieceelem,drop:this})
    }
  }
  Click(){
    let sqelem = document.getElementById(this.getName())
    sqelem.addEventListener("click",this.#handleClick)
  }
  decode(){
    let x = this.getx()
    let y = this.gety()
    return {x,y}
  }
  getSquareElement(targetId){
    let target = document.getElementById(targetId)
    return target
  }
  applyColor(color){
    this.#color = color
    this.getSquareElement(this.getName()).style.backgroundColor = color
  }
  removeColor(){
    let color = this.#defaultcolor == "white" ? "rgb(240, 201, 150)" : "rgb(100, 75, 43)"
    this.#color = this.#defaultcolor
    this.getSquareElement(this.getName()).style.backgroundColor = color
  }
  hasPiece(){
    return this.#pieceName ? true : false
  }
  encode(x,y){
    return this.getCoordX()[x] + this.getCoordY()[y]
  }
  hasEnemyPiece(pieceColor){
    if(!this.hasPiece()) return 
    let piece = board.getPiece(this.getpieceName())
    return piece.getColor() != pieceColor ? true : false
  }
  hasSpecificPiece(piecetype,pieceColor){
    let piece = board.getPiece(this.getpieceName())
    if(!this.hasPiece()) return 
    return piece.getType() == piecetype && piece.getColor() == pieceColor ? true : false
  }
}
class Player{
  #team;
  #name;
  #captured = [];
  #resigned = false
  #DrawOffered = false
  #DrawAccepted = false
  setDrawOffered(val){
    this.#DrawOffered = val
  }
  OfferDraw(){
    if(this.getDrawOffered()) return
    let players = {white:player2,black:player1}
    let btn = document.getElementById(`draw_${this.getTeam()}`)
    let enemyColor = this.getTeam() == "white" ? "black" : "white"
    let enemyplayer = players[enemyColor]
    let enemybtn = document.getElementById(`draw_${enemyColor}`)
    btn.style.opacity = 0.7
    enemybtn.title = "Claim Draw"
    enemybtn.onclick = () =>{enemyplayer.#AcceptDraw()}
    btn.onclick = () =>{}
    this.setDrawOffered(true)
  }
  #AcceptDraw(){
    if(this.getDrawOffered() || this.getDrawAccepted()) return
    this.setDrawAccepted(true)
    game.resultActions("DRAW!","Mutual agreement!")
  }
  getDrawOffered(){
    return this.#DrawOffered
  }
  setDrawAccepted(val){
    this.#DrawAccepted = val
  }
  getDrawAccepted(){
    return this.#DrawAccepted
  }
  #setName(name){
    this.#name = name
  }
  getName(){
    return this.#name
  }
  updateCaptured(piece){
    this.#captured.push(piece)
  }
  getCaptured(){
    return this.#captured
  }
  #setTeam(team){
    this.#team = team
  }
  getTeam(){
    return this.#team
  }
  setresigned(val){
    this.#resigned = val
  }
  getresigned(){
    return this.#resigned
  }
  play_again(){
    location.reload()
  }
  resign(){
    let turn = board.getTurnTeam()
    let players = {white:player2,black:player1}
    let currplayer = players[turn]
    if(currplayer.getresigned()) return
    currplayer.setresigned(true)
    let winner = turn == "white" ? "Black" : "White"
    let opp = turn == "white" ? "White" : "Black"
    game.resultActions(`${winner} Won!`,`${opp} resigned!`)
  }
  setCalcColor(){
    board.getSquares().forEach(square =>{ 
      let curr = document.getElementById(square.getName())
      let [oldStamp,newStamp] = [0,0]
      let handleColors = (e) =>{      
        let target = e.target.classList.contains("pieces") ? e.target.parentNode : e.target
        let colors = {black: ["rgb(209,0,0)","black"],white:["rgb(255,0,0)","white"]}
        let isDefault = square.getColor() == colors[square.getDefaultColor()][1]
        let isHighlight = board.getlast_move().includes(square.getName())
        let redColored = square.getColor() == colors[square.getDefaultColor()][0]
        let CalcColor = colors[square.getDefaultColor()][0]
        let newColor = redColored && isHighlight ? "rgb(227,224,150)" : isHighlight || isDefault ? CalcColor : null
        newColor ? square.applyColor(newColor) : square.removeColor()
      }
      curr.addEventListener("contextmenu",e => handleColors(e))
    })
  }
  downloadGame(){
    let currentTime  = new Date()
    let date = `${currentTime.getDate()}.${currentTime.getMonth()+1}.${currentTime.getFullYear()}-${currentTime.getHours()}.${currentTime.getMinutes()}`
    let filename = `Chess-${player1.getName()}vs${player2.getName()}-${date}`
    let counter = 1
    let resignation = player1.getresigned() || player1.getresigned()
    let allMoves = details.getMoves().reduce((str,curr,index) => {return str += index % 2 == 0 ? ` ${counter++}.${curr} ` : curr},"")
    let content = {draw:game.getis_Draw(),checkmate: game.getis_Checkmate() ,check: board.getKingStatus().length >= 1,fen:board.getstrFen(),date,resignation,moves: allMoves,Players: `${player1.getName()}-${player2.getName()}`}
    let json = JSON.stringify(content)
    let blob = new Blob([json],{type:'text/plain'});
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    link.click();
  }
  StartGame(){
    if(game.getgameStarted()) return 
    let mainPath = ".main "
    let main = document.querySelector(mainPath)
    let startbtn = document.querySelector(mainPath + "#startGame")
    main.removeChild(startbtn)
    let whiteTimer = document.getElementById("timer_white")
    whiteTimer.style.opacity = "1"
    let endButtons = document.querySelectorAll("#columns1 i")   
    endButtons.forEach(btn => btn.style.opacity = "1")
    let drawbtns = document.querySelectorAll("#columns1 i.drawbtn")
    let resignbtn = document.querySelector("#resign_btn")
    let players = [player2,player1]
    drawbtns.forEach((btn,i) => btn.onclick = () => players[i].OfferDraw())
    resignbtn.onclick = () => new Player().resign()
    board.createSquares()
    this.setCalcColor()
    let timer = game.getTimer("white");
    timer.handleState()
    timer.start()
    game.setgameStarted(true)
  }
  constructor(name,team){
    this.#setName(name)
    this.#setTeam(team)
  }
}


class Piece extends Board{
  #color
  #name
  #square
  #type
  #x
  #y
  #pinned = false
  #allTransforms = ["translate(0px,0px)","scale(1)","rotate(0deg)"]
  #pieceElement
  #legalMoves = []
  constructor(color,name,square,type,x,y){
    super()
    this.#color = color
    this.#name = name
    this.#square = square
    this.#type = type
    this.#x = x
    this.#y = y
  }
  getLegalMoves(){return this.#legalMoves}
  createMoves(){}
  StartingMoves(){return this.createMoves()}
  removeDragging(){
    this.removeDrag()
    this.removeDrop()
    this.removeEnter()
    this.removeLeave()
    this.removeCancel()
    this.removeClick()
  }
  removeClick(){
    this.#pieceElement.removeEventListener("click",this.#handleClick)
  }
  Click(){
    this.#pieceElement.addEventListener("click",this.#handleClick)
  }
  #handleClick(e){
    e.stopImmediatePropagation()
    let piece = board.getPiece(e.target.id)
    board.clickedPiece = e.target
    piece.drag(e.target)
  }
  disableLeftClick(){
    this.#pieceElement.addEventListener("contextmenu",e =>{e.preventDefault()})
  }
  initEvent(){
   this.#pieceElement = this.getPieceElement(this.getName())
   ResEvent.initEvent(this.#pieceElement,"movable","dragging","square",this.#pieceElement,this.#allTransforms)
  }
  initDrag(){
   ResEvent.enableEvent(this.#pieceElement,"start")
   this.#pieceElement.addEventListener("ResponsiveDragStart",this.#DragStartEvent.bind(this))
  }
  initDrop(){
   ResEvent.enableEvent(this.#pieceElement,"drop")
   this.#pieceElement.addEventListener("ResponsiveDrop",this.#DropEvent.bind(this))
  }
  initEnter(){
   ResEvent.enableEvent(this.#pieceElement,"enter")
   this.#pieceElement.addEventListener("ResponsiveDragEnter",this.#enter.bind(this))
  }
  initLeave(){
   ResEvent.enableEvent(this.#pieceElement,"leave")
   this.#pieceElement.addEventListener("ResponsiveDragLeave",this.#leave.bind(this))
  }
  initCancel(){
    ResEvent.enableEvent(this.#pieceElement,"cancel")
    this.#pieceElement.addEventListener("ResponsiveDragCancel",this.#DragCancel.bind(this))
  }
  removeDrag(){
    ResEvent.disableEvent(this.#pieceElement,"start")
    this.#pieceElement.removeEventListener("ResponsiveDragStart",this.#DragStartEvent)
  }
  removeDrop(){
   ResEvent.disableEvent(this.#pieceElement,"drop")
   this.#pieceElement.removeEventListener("ResponsiveDrop",this.#DropEvent)
  }
  removeEnter(){
   ResEvent.disableEvent(this.#pieceElement,"enter")
   this.#pieceElement.removeEventListener("ResponsiveDragEnter",this.#enter)
  }
  removeLeave(){
   ResEvent.disableEvent(this.#pieceElement,"leave")
   this.#pieceElement.removeEventListener("ResponsiveDragLeave",this.#leave)
  }
  removeCancel(){
    ResEvent.disableEvent(this.#pieceElement,"cancel")
    this.#pieceElement.removeEventListener("ResponsiveDragCancel",this.#DragCancel)
  }
  #DragCancel(e){
    e.detail.dragElement.parentNode.style.borderColor = "black" 
    e.detail.dragElement.style.cursor = "grab"
    this.#removeSquaresColor()
    board.highlightLastMove()
    let opponentsColor = board.getTurnTeam()[0]
    let opponentsKing = board.getPiece(`king_${opponentsColor}`)
    let opponentsKingStatus = opponentsKing.getisInCheck()
    if(opponentsKingStatus){    
      board.getSquare(opponentsKing.getSquare()).applyColor("red")
    } 
  }
  getPieceElement(targetId){
    let target = document.getElementById(targetId)
    return target
  }
  #DragStartEvent(e){
    e.target.style.cursor = "grabbing"
    e.target.draggable = true
    this.drag(e.target)
  }
  #DropEvent(e){
    e.detail.drag.style.cursor = "grab"
    e.detail.drop.style.borderColor = "black"
    this.drop({drag:e.detail.drag,drop:e.detail.drop})
  }
  #applyMovesColor(moves,pieceColor){
    moves.forEach(move =>{
      let square = board.getSquare(move)
      if(square.hasEnemyPiece(pieceColor)){
       square.applyColor("rgb(255,241,0)") 
      }else{
       square.applyColor("rgb(30,94,0)") 
      }     
    })
  }
  #removeSquaresColor(){
   board.getSquares().forEach(square =>{
      square.removeColor()
   })
  }
  #removeMovesColor(moves){
    moves.forEach(move =>{
      let square = board.getSquare(move)
      square.removeColor()
    })
  }
  removeIllegalWhenInCheck(moves){
    let newMoves = []
    let blockmoves = board.getKingStatus()
    moves.forEach(move =>{
      if(blockmoves.includes(move)){
        newMoves.push(move)
      }
    })
    return newMoves
  }
  removeIllegalWhenPinned(moves,pinmoves){
    let newMoves = []
    let blockmoves = board.getKingStatus()
    moves.forEach(move =>{
      if(pinmoves.includes(move)){
        newMoves.push(move)
      }
    })
    return newMoves
  }
  drag(piece,additionaMoves = []){
    let turnColor = board.getTurnTeam()
    let pieceColor = this.getPieceData(piece)
    //Check if the moving piece can move by turn   
    if(turnColor != pieceColor.color) return
    let square = piece.parentNode
    let startSquare = board.getSquare(square.id)
    let startX = startSquare.decode().x
    let startY = startSquare.decode().y
    startSquare.applyColor("rgb(74,236,0)")
    let pieceobj = board.getPiece(piece.id)
    let moves = pieceobj.StartingMoves()
    let kingColor = turnColor[0]
    let king = board.getPiece(`king_${kingColor}`)
    let isInCheck = king.getisInCheck()
    let CheckBlockMoves = board.getKingStatus()
    if(isInCheck && this.getPieceData(piece).type != "king"){
      moves = this.removeIllegalWhenInCheck(moves)  
    } 
    let piecePin = this.isPinned(piece.id,pieceColor.color)
    if(piecePin.isPinned){
      moves = this.removeIllegalWhenPinned(moves,piecePin.legalmoves.concat(piecePin.backmoves))
    } 
    moves = moves.concat(additionaMoves)  
    this.#applyMovesColor(moves,pieceColor.color) 
    if(pieceobj.getType() == "pawn"){
      let enpassant = pieceobj.isEnPassant(pieceColor.color,startX,startY)
      let enpCondition = (enpassant.isEnPassant && !isInCheck) || (enpassant.isEnPassant && isInCheck && (CheckBlockMoves.includes(enpassant.square) || CheckBlockMoves.includes(enpassant.targetSquare)))
      let enpCondition2 = (enpassant.isEnPassant && !piecePin.isPinned) || (enpassant.isEnPassant && piecePin.isPinned && piecePin.legalmoves.concat(piecePin.backmoves).includes(enpassant.square))
      if(enpCondition && enpCondition2){
       moves.push(enpassant.square) 
       let targetObj = board.getSquare(enpassant.square)
       targetObj.applyColor("rgb(0,255,255)")
      } 
    }
    if(pieceobj.getType() == "king"){
      let castle = pieceobj.Castle()
      let castleMoves = castle.moves
      if(castleMoves){
      castleMoves.forEach(move =>{
        let currentSquare = board.getSquare(move)
        currentSquare.applyColor("rgb(0,255,255)")
      })
      moves = moves.concat(castleMoves)
      }      
    }  
    if(pieceobj.getType() == "pawn"){  
    moves.forEach(move =>{
      let currentSquare = board.getSquare(move)
      let currentSquareY = currentSquare.gety()
      if(pieceobj.isPromotion(pieceColor.color,currentSquareY)){       
        currentSquare.applyColor("rgb(0,255,255)")
      } 
    }) 
    }
    this.#legalMoves = moves
  }
  drop(data,additionaMoves = []){
    let piece = data.drag
    let targetSquare = data.drop   
    let turnColor = board.getTurnTeam()
    let Oldcaptures = board.getcaptures()
    let pieceColor = this.getPieceData(piece) 
    let opponentColor = pieceColor.color == "white" ? "black" : "white"
    let pieceobj = board.getPiece(piece.id)
    let enpassantfen = pieceobj.getType() == "pawn" ? pieceobj.moveForward()[0] : null
    let moves = pieceobj.StartingMoves()
    let pieceX = board.getSquare(piece.parentNode.id).decode().x
    let pieceY = board.getSquare(piece.parentNode.id).decode().y
    this.#removeSquaresColor()
    let StartsquareObj = board.getSquare(piece.parentNode.id)
    let TargetsquareObj = board.getSquare(targetSquare.id)
    let isPiece = TargetsquareObj.hasPiece()
    StartsquareObj.removeColor()
    board.highlightLastMove() 
    let kingColor = turnColor[0]
    let king = board.getPiece(`king_${kingColor}`)
    let CheckBlockMoves = board.getKingStatus()
    if(king.getisInCheck()){       
      board.getSquare(king.getSquare()).applyColor("red")
    }   
    //Check if the moving piece can move by turn
    if(turnColor != pieceColor.color) return    
    let isInCheck = king.getisInCheck()
    if(isInCheck && this.getPieceData(piece).type != "king"){
      moves = this.removeIllegalWhenInCheck(moves)  
    }
    let piecePin = this.isPinned(piece.id,pieceColor.color)
    if(piecePin.isPinned){
      moves = this.removeIllegalWhenPinned(moves,piecePin.legalmoves.concat(piecePin.backmoves))
    } 
    let enpassant = {isEnPassant:false};
    if(pieceobj.getType() == "pawn"){  
      enpassant = pieceobj.isEnPassant(pieceColor.color,pieceX,pieceY)  
      let enpCondition = (enpassant.isEnPassant && !isInCheck) || (enpassant.isEnPassant && isInCheck && (CheckBlockMoves.includes(enpassant.square) || CheckBlockMoves.includes(enpassant.targetSquare)))
      let enpCondition2 = (enpassant.isEnPassant && !piecePin.isPinned) || (enpassant.isEnPassant && piecePin.isPinned && piecePin.legalmoves.concat(piecePin.backmoves).includes(enpassant.square))
      if(enpCondition && enpCondition2) moves.push(enpassant.square)
    } 
    let castle = {canCastle:false}
    if(pieceobj.getType() == "king"){
      castle = pieceobj.Castle()
      let castleMoves = castle.moves
      if(castle[targetSquare.id]){
        pieceobj.TranferRook(castle[targetSquare.id],targetSquare.id)
        moves = moves.concat(castleMoves) 
        board.updateturn()
      }
    } 
    moves = moves.concat(additionaMoves)
    //Dont allow the move in the start square 
    if(StartsquareObj.getName() == TargetsquareObj.getName()) return
    //Dont allow the move if is not legal  
    if(!moves.includes(targetSquare.id)){
      const invalidpopup = this.getPieceElement("invalid_popup")
      invalidpopup.style.animation = 'none';
      setTimeout(function() {
        invalidpopup.style.animation = 'invalidpopup 5s ease-in-out forwards';
        invalidpopup.innerText = `Invalid move ${piece.parentNode.id}-${targetSquare.id}!`
      }, 100);
      return
    } 
    if(game.getSoundAllowed()){
      let movePieceSound = new Audio("https://andreas-hodo.github.io/Chess/Game/sounds/479457-Moving_Random_Chess_Pieces_08.WAV")
      movePieceSound.play()
    }
    if(pieceobj.getType() == "king" || pieceobj.getType() == "rook"){
      pieceobj.setMoved(true)
    }
    board.getSquare(king.getSquare()).removeColor()
    let targetX = board.getSquare(targetSquare.id).decode().x
    let targetY = board.getSquare(targetSquare.id).decode().y
    let startX = board.getSquare(piece.parentNode.id).decode().x
    let startY = board.getSquare(piece.parentNode.id).decode().y
    let promotionCompleted = pieceobj.getpromotionCompleted()
    let isPromotion = pieceobj.getType() == "pawn" ? pieceobj.isPromotion(pieceColor.color,targetY) : false
    if(isPromotion && !promotionCompleted){        
     pieceobj.OpenPromotion(targetY,targetSquare.id,Oldcaptures)
     return
    }
    if(pieceobj.getType() == "pawn"){
     pieceobj.Moved2(StartsquareObj.gety(),targetY)  
    }   
    if(enpassant.isEnPassant && enpassant.square == targetSquare.id){
      let target = this.getPieceElement(enpassant.targetSquare)
      let Pieceindex = this.findPieceIndex(target.firstChild.id)   
      this.removePiece(Pieceindex)
      this.#capture(target.id)
      board.updatecaptures()
      let enemyPieceSquare = board.getSquare(enpassant.targetSquare)
      enemyPieceSquare.setpieceName(null)
    } 
    //Dont allow the capture in a square with same piece color
    if(TargetsquareObj.hasPiece() && !TargetsquareObj.hasEnemyPiece(pieceColor.color)) return  
    if(isPiece){
      let Pieceindex = this.findPieceIndex(targetSquare.firstChild.id)   
      this.removePiece(Pieceindex)
      this.#capture(targetSquare.id)
      board.updatecaptures()
    } 
    this.#MovePiece(piece,targetSquare)
    this.#updatePieceDetails(piece,targetSquare.id,targetX,targetY)
    TargetsquareObj.setpieceName(piece.id)
    StartsquareObj.setpieceName(null)
    board.removehighlight()
    board.updatelast_move([StartsquareObj.getName(),TargetsquareObj.getName()])
    board.updateall_moves(`${StartsquareObj.getName()}-${TargetsquareObj.getName()}`)
    board.updateturn()
    board.highlightLastMove() 
    let opponentsColor = board.getTurnTeam()[0]
    let friendlyColor = pieceColor.color[0]
    let opponentsKing = board.getPiece(`king_${opponentsColor}`) 
    let friendlyKing = board.getPiece(`king_${friendlyColor}`) 
    let opponentsKingStatus = opponentsKing.isInCheck(opponentsKing.getColor(),opponentsKing.getSquare(),opponentsKing.getX(),opponentsKing.getY(),true)
    board.setKingStatus(opponentsKingStatus.blockmoves)
    if(opponentsKingStatus.isInCheck){  
      opponentsKing.setisInCheck(true)     
      board.getSquare(opponentsKing.getSquare()).applyColor("red")
    }else{
      opponentsKing.setisInCheck(false) 
    } 
    friendlyKing.setisInCheck(false); 
    let team = board.getTurnTeam()
    let oppteam = team == "white" ? "black" : "white"
    let currTimer = document.getElementById(`timer_${team}`)
    let oppositeTimer = document.getElementById(`timer_${oppteam}`)
    currTimer.style.opacity = "1"
    oppositeTimer.style.opacity = "0.7" 
    let castledata = castle[targetSquare.id] ?? castle.canCastle
    if(board.getTurnTeam() == "white" && !castledata) game.updatefull_moves()   
    if(!castledata) game.updatehalf_moves(game.gethalf_moves() + 1)       
    if(pieceobj.getType() == "pawn") game.updatehalf_moves(0) 
    enpassantfen = pieceobj.getType() == "pawn" ? pieceobj.getmoved2() ? enpassantfen : "-" : "-"
    board.updateFen(startX,startY,targetX,targetY,enpassantfen,pieceColor.color)
    let [currtimer,opptimer] = [game.getTimer(team),game.getTimer(oppteam)] 
    if(!castle[targetSquare.id]){
      opptimer.stop()
      currtimer.start()  
    }    
    let endButtons = document.querySelectorAll("#columns1 i.drawbtn")
    let players = [player2,player1]
    endButtons.forEach((btn,i) =>{
      players[i].setDrawOffered(false)
      btn.style.opacity = "1"
    })
    let drawbtns = document.querySelectorAll("#columns1 i.drawbtn")
    drawbtns.forEach((btn,i) => {
      btn.onclick = () => players[i].OfferDraw()           
      btn.title = "Offer Draw"
    })
    //Calculate material points
    board.Evaluation()
    board.Draw()
    board.CheckMate()
    let isCapture = board.getcaptures() > Oldcaptures
    let notation = details.NotateMove(castledata,pieceobj.getType(),StartsquareObj.getName(),isCapture,TargetsquareObj.getName())
    details.addMove(notation)
    details.showNotation()
  }
  isPinned(pieceId,color){
    let isPinned = false
    let pieceWasFound = false
    let oppositeColor = color == "white" ? "black" : "white"
    let kingColor = color == "white" ? "w" : "b"
    let result = {isPinned,legalmoves:[],backmoves:[]}
    let pieces = ["rook","bishop"]
    let king = board.getPiece(`king_${kingColor}`)
    let kingSquare = board.getSquare(king.getSquare())
    let kingX = kingSquare.decode().x
    let kingY = kingSquare.decode().y
    pieces.forEach(piecename =>{
     let piece = board.CreatePiece(color,piecename,kingSquare,piecename,kingX,kingY)
     let piecemoves = piece.concatMoves()
     for(let i = 0; i < piecemoves.length; i++){
      for(let j = 0; j < piecemoves[i].length; j++){
        let Squareid = piecemoves[i][j]
        let square = board.getSquare(Squareid)
        let hasPiece = square.getpieceName() ? true : false      
        if(!hasPiece) continue
        let squarePiece = square.getpieceName()
        if(squarePiece != pieceId) break       
        pieceWasFound = true
        let FoundIndex = piecemoves[i].indexOf(Squareid)
        let EnemyDirection = piecemoves[i].slice(FoundIndex + 1,piecemoves[i].length)
        let backmoves = piecemoves[i].slice(0,FoundIndex)
        for(let i = 0; i < EnemyDirection.length; i++){
          Squareid = EnemyDirection[i]
          square = board.getSquare(Squareid)         
          hasPiece = square.getpieceName() ? true : false      
          if(!hasPiece) continue
          squarePiece = square.getpieceName()
          if(!square.hasSpecificPiece(piecename,oppositeColor) && !square.hasSpecificPiece("queen",oppositeColor)) break
          isPinned = true
          let pinnerSquareY = square.decode().y
          let reversedPawnPin = color == "white" ? kingY > pinnerSquareY : kingY < pinnerSquareY
          let pieceType = board.getPiece(pieceId).getType()
          result = {isPinned,legalmoves:EnemyDirection.slice(0,i+1),backmoves:[]}
          if(pieceType == "rook" || pieceType == "bishop" || pieceType == "queen" || (pieceType == "pawn" && reversedPawnPin)){ 
            result.backmoves = backmoves            
          }           
          break        
        }
      }
     }
    })   
    return result
  }
  cutDirection(moves){
    let newMoves = []
    for(let i = 0; i < moves.length; i++){     
      let square = board.getSquare(moves[i])
      let hasPiece = square.hasPiece()      
      let hasEnemyPiece = square.hasEnemyPiece(this.getColor())
      let adder = hasPiece && hasEnemyPiece ? 1 : hasPiece && !hasEnemyPiece ? 0 : null
      if(hasPiece){
        newMoves = moves.slice(0,i+adder)
        break
      }
      newMoves.push(moves[i])
    }  
    return newMoves  
  }
  #MovePiece(piece,square){
    square.appendChild(piece)
  }
  #enter(e){
    let curr = e.detail.enterElement
    curr.style.borderColor = "whitesmoke"
  }
  #leave(e){
    let curr = e.detail.leaveElement
    curr.style.borderColor = "black"
  }
  #updatePieceDetails(pieceName,square,x,y){
   let piece = board.getPiece(this.getPieceData(pieceName).name)
   if(!piece instanceof Piece) return
   piece.#setX(x)
   piece.#setY(y)
   piece.#setSquare(square)
  }
  findPieceIndex(pieceName){
    let index = null
    for(let i = 0; i < board.getPieces().length; i++){
      let name = board.getPieces()[i].getName()
      if(pieceName == name){
        index = i
      }
    }
    return index
  }
  removePiece(index,promotion = false){
   let capturedPiece = board.getPieces().splice(index,1)
   let turnColor = board.getTurnTeam()
   turnColor == "white" ? player2.updateCaptured(capturedPiece) : player1.updateCaptured(capturedPiece)
   if(!promotion) game.updatehalf_moves(-1)
  }
  getPieceData(piece){
    if(piece){
     let pieceColor = piece.classList[1]
     let pieceId = Array.from(piece.id)
     let end = pieceId.indexOf("_")
     let type = pieceId.slice(0,end).join("")
     return {name:pieceId.join(""),color:pieceColor,type} 
    }  
  }
  #capture(squareId){
  let squareElement = this.getPieceElement(squareId)
  if(squareElement.firstChild){
    squareElement.removeChild(squareElement.firstChild)
  }  
  }
  getColor(){
    return this.#color
  }
  setName(name){
   this.#name = name
  }
  getName(){
    return this.#name
  }
  setType(type){
    this.#type = type
  }
  getType(){
    return this.#type
  }
  #setSquare(square){
    this.#square = square
  }
  getSquare(){
    return this.#square
  }
  #setX(x){
    this.#x = x
  }
  getX(){
    return this.#x
  }
  #setY(y){
    this.#y = y
  }
  getY(){
    return this.#y
  }
  #setPinned(pinned){
    this.#pinned = pinned
  }
  getPinned(){
    return this.#pinned
  }
  CompressSquare(x,y){
   let square = new Square()
   return square.encode(x,y)
  }
  isOutsideBorder(startcoord,secondcoord){
   return startcoord + secondcoord > 8 || startcoord + secondcoord < 1 ? true : false
  }
  setpromotionCompleted(){
  }
  getpromotionCompleted(){
    return false
  }
}

class Rook extends Piece{
  #moved = false
  constructor(color,name,square,type,x,y){
    super(color,name,square,type,x,y)
  }
  setMoved(status){
    this.#moved = status
  }
  getMoved(){
    return this.#moved
  }
  concatMoves(){
    return [this.createUpMoves(),this.createDownMoves(),this.createLeftMoves(),this.createRightMoves()]
  }
  createMoves(){  
    return this.concatMoves().map(moves => this.cutDirection(moves)).flat()
  }
  createUpMoves(){
    let moves = []
    for(let i = this.getY() + 1; i <= 8; i++){  
      moves.push(this.CompressSquare(this.getX(),i))
    }
    return moves
  }
  createDownMoves(){
    let moves = []
    for(let i = this.getY() - 1; i >= 1; i--){
      moves.push(this.CompressSquare(this.getX(),i))
    }
    return moves
  }
  createLeftMoves(){
    let moves = []
    for(let i = this.getX() - 1; i >= 1; i--){    
      moves.push(this.CompressSquare(i,this.getY()))
    }
    return moves
  }
  createRightMoves(){
    let moves = []
    for(let i = this.getX() + 1; i <= 8; i++){    
      moves.push(this.CompressSquare(i,this.getY()))
    }
    return moves
  }
}

class Knight extends Piece{
  constructor(color,name,square,type,x,y){
    super(color,name,square,type,x,y)
  }
  concatMoves(){
    return [this.createAllMoves()]
  }
  cutDirection(moves){
    let newmoves = []
    moves.forEach(move =>{
      let square = board.getSquare(move)
      let hasPiece = square.hasPiece()      
      let hasEnemyPiece = square.hasEnemyPiece(this.getColor())
      if(!hasPiece || hasEnemyPiece) newmoves.push(move)
    })  
    return newmoves 
  }
  createAllMoves(){
    let coords = [[1,2],[-1,2],[-2,1],[-2,-1],[1,-2],[-1,-2],[2,1],[2,-1]]
    let moves = []
    coords.forEach(coord =>{
      let BordersX = this.isOutsideBorder(this.getX(),coord[0])
      let BordersY = this.isOutsideBorder(this.getY(),coord[1])
      if(BordersX || BordersY) return 
      moves.push(this.CompressSquare(this.getX() + coord[0],this.getY() + coord[1]))
    })
    return moves
  }
  createMoves(){  
    return this.cutDirection(this.concatMoves().flat())
  }
}

class Bishop extends Piece{
  constructor(color,name,square,type,x,y){
    super(color,name,square,type,x,y)
  }      
  concatMoves(){
    return [this.createRightUpMoves(),this.createLeftUpMoves(),this.createRightDownMoves(),this.createLeftDownMoves()]
  }
  createMoves(){ 
    return this.concatMoves().map(moves => this.cutDirection(moves)).flat()
  }
  createRightUpMoves(){
    let moves = []
    for(let i = this.getX() + 1,y = this.getY() + 1; i <= 8 && y <= 8; i++,y++){  
      moves.push(this.CompressSquare(i,y))
    }
    return moves
  }
  createLeftUpMoves(){
    let moves = []
    for(let i = this.getX() - 1,y = this.getY() + 1; i >= 1 && y <= 8; i--,y++){  
      moves.push(this.CompressSquare(i,y))
    }
    return moves
  }
  createRightDownMoves(){
    let moves = []
    for(let i = this.getX() + 1,y = this.getY() - 1; i <= 8 && y >= 1; i++,y--){  
      moves.push(this.CompressSquare(i,y))
    }
    return moves
  }
  createLeftDownMoves(){
    let moves = []
    for(let i = this.getX() - 1,y = this.getY() - 1; i >= 1 && y >= 1; i--,y--){  
      moves.push(this.CompressSquare(i,y))
    }
    return moves
  }
}

class Queen extends Piece{
  constructor(color,name,square,type,x,y){
    super(color,name,square,type,x,y)
  }
  concatMoves(){
    let bishopmoves = new Bishop(this.getColor(),this.getName(),this.getSquare(),this.getType(),this.getX(),this.getY()).concatMoves()
    let rookmoves = new Rook(this.getColor(),this.getName(),this.getSquare(),this.getType(),this.getX(),this.getY()).concatMoves()
    return [Object.values(bishopmoves),Object.values(rookmoves)].flat()
  }
  createMoves(){
    return this.concatMoves().map(moves => this.cutDirection(moves)).flat()
  }
}

class King extends Piece{
  #isInCheck = false
  #moved = false
  constructor(color,name,square,type,x,y){
    super(color,name,square,type,x,y)

  }
  setMoved(status){
    this.#moved = status
  }
  getMoved(){
    return this.#moved
  }
  setisInCheck(state){
    this.#isInCheck = state
  }
  getisInCheck(){
    return this.#isInCheck
  }
  concatMoves(){
    return [this.createAllMoves()]
  }
  removeIllegal(moves,color){
    let newMoves = []
    moves.forEach(move =>{
      let square = board.getSquare(move)
      let squareX = square.decode().x
      let squareY = square.decode().y
      let squareisControlledByEnemy = this.isInCheck(color,square.getName(),squareX,squareY,false).isInCheck
      if(!squareisControlledByEnemy) newMoves.push(move)
    })
    return newMoves
  }
  TranferRook(data,square){
    if(!data.canCastle) return 
    const rook = board.getPiece(data.rookId)
    const rookElem = this.getPieceElement(data.rookId)
    const squareElem = board.getSquare(data.rook).getSquareElement(data.rook)
    rook.drag(rookElem)
    rook.drop({drag:rookElem,drop:squareElem})
  }
  Castle(){
    let result = {move:"",rook:"",rookId:"",canCastle:false}
    if(this.getisInCheck() || this.getMoved()) return result
    const y = this.getColor() == "white" ? 1 : 8
    let color = this.getColor() == "white" ? "w" : "b"
    let checkCastle = (empty,forcheck,rookId) =>{ 
      let canCastle = true 
      const targetSquareX = forcheck[1][0]
      let transferRookSquare = {g: `f${y}`,c:`d${y}`}  
      const rook = board.getPiece(rookId)
      if(!rook) return result
      if(rook.getMoved()) return result
      for(let move of empty){
        let square = board.getSquare(move)
        if(square.hasPiece()) return result
        let squareX = square.decode().x
        let squareY = square.decode().y
        if(forcheck.includes(move)){
          let squareisControlledByEnemy = this.isInCheck(this.getColor(),square.getName(),squareX,squareY,false).isInCheck
          if(squareisControlledByEnemy){
            canCastle = false
            break
          } 
        }       
     }
     let castleData = {move:forcheck[1],rook:transferRookSquare[targetSquareX],rookId,canCastle}
     if(canCastle) return castleData
     return result    
   }
   const rook1 = checkCastle([`f${y}`,`g${y}`],[`f${y}`,`g${y}`],`rook_2${color}`) 
   const rook2 = checkCastle([`d${y}`,`c${y}`,`b${y}`],[`d${y}`,`c${y}`],`rook_1${color}`)
   let data = {moves:[rook1.move, rook2.move].filter(Boolean),[rook1.move]:rook1,[rook2.move]:rook2};
   return data
  }
  isInCheck(color,square,x,y,forKing){
    let pieces = ["rook","knight","bishop","queen","king","pawn"]
    let isInCheck = false
    let blockmoves = []
    let checks = 0
    let kingSquare = board.getSquare(this.getSquare());
    if(!forKing){
      kingSquare.setpieceName(null)
    }
    let opponentColor = board.getTurnTeam() == "white" ? "black" : "white"
    pieces.forEach(piecename =>{     
      let piece = board.CreatePiece(color,piecename,square,piecename,x,y)
      let isPawn = piecename == "pawn" ? true : false
      let cuttedmoves = []
      let piecemoves = isPawn ? piece.concatDiagonalMoves() : piece.concatMoves()
      if(isPawn){
       cuttedmoves = piecemoves
      }
      piecemoves.forEach(directionmoves =>{
        if(!isPawn){
          cuttedmoves.push(piece.cutDirection(directionmoves))
        }        
      })
      for(let i = 0; i < cuttedmoves.length; i++){
        for(let j = 0; j < cuttedmoves[i].length; j++){
          let squareId = cuttedmoves[i][j]
          let square = board.getSquare(squareId)
          let squarePiece = square.getpieceName()
          if(!squarePiece) continue
          let hasPiece = square.hasSpecificPiece(piecename,opponentColor)      
          if(!hasPiece) continue  
          if(forKing && piecename == "king") continue
          checks++  
          isInCheck = true
          blockmoves = cuttedmoves[i] 
          if(piecename == "pawn" || piecename == "knight"){
            blockmoves = [square.getName()]
          }    
        }          
        if(checks == 2){
          blockmoves = []
          break
        }  
      }      
    })
    if(!forKing){
      kingSquare.setpieceName(this.getName())
    }
    return {isInCheck,blockmoves}   
  }
  createAllMoves(){
    let coords = [[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0]]
    let moves = []
    coords.forEach(coord =>{
      let BordersX = this.isOutsideBorder(this.getX(),coord[0])
      let BordersY = this.isOutsideBorder(this.getY(),coord[1])
      if(BordersX || BordersY) return 
      moves.push(this.CompressSquare(this.getX() + coord[0],this.getY() + coord[1]))
    })
    return moves
  }
  cutDirection(moves){
    let newmoves = []
    moves.forEach(move =>{
      let square = board.getSquare(move)
      let hasPiece = square.hasPiece()      
      let hasEnemyPiece = square.hasEnemyPiece(this.getColor())
      if(!hasPiece || hasEnemyPiece) newmoves.push(move)
    })  
    return newmoves
  }
  createMoves(){  
    let cuttedMoves = this.cutDirection(this.concatMoves().flat())
    return this.removeIllegal(cuttedMoves,this.getColor())
  }
}

class Pawn extends Piece{
  #moved2
  #promotionCompleted = false
  constructor(color,name,square,type,x,y){
    super(color,name,square,type,x,y)
    this.#moved2 = false
  }
  setpromotionCompleted(status){
    this.#promotionCompleted = status
  }
  getpromotionCompleted(){
    return this.#promotionCompleted
  }
  getmoved2(){
    return this.#moved2
  }
  Moved2(startY,endY){
    this.#moved2 = startY - endY == 2 || endY - startY == 2 ? true : false
  }
  isPromotion(color,y){
    let promoteY = color == "white" ? 8 : 1
    let promoteColor = promoteY == 8 ? "white" : promoteY == 1 ? "black" : false
    return y == promoteY && this.getColor() == promoteColor
  }
  PinnedEnPassant(EnPassant,x,y,color,enemyColor){
    if(!EnPassant.isEnPassant) return false  
    let KingX = board.getPiece(`king_${color[0]}`).getX()
    let KingY = board.getPiece(`king_${color[0]}`).getY()
    if(KingY !== y) return false
    let startSquareK = new Piece().CompressSquare(KingX,KingY)
    let rook = new Rook(color,"rook",startSquareK,"rook",KingX,KingY)
    let map = x > KingX ? rook.createRightMoves() : rook.createLeftMoves()
    let targetSquareObj = board.getSquare(EnPassant.targetSquare)
    let startSquare = new Piece().CompressSquare(x,y)
    let targetX = targetSquareObj.getx()
    let [index1,index2] = [map.indexOf(startSquare),map.indexOf(EnPassant.targetSquare)]
    let [map1,map2] = Math.abs(targetX - KingX) > Math.abs(x - KingX) ? [map.slice(0,index1),map.slice(index2 + 1,map.length)] : [map.slice(0,index2),map.slice(index1 + 1,map.length)]   
    let checkSquares = (squares,enemyColor,type) =>{
      let pieceFound = type == 2 ? false : true
      if(squares.length == 0) return true
      for(let i = 0; i < squares.length; i++){
        let currentSquare = board.getSquare(squares[i])
        if(type == 2) pieceFound = (currentSquare.hasSpecificPiece("queen",enemyColor) || currentSquare.hasSpecificPiece("rook",enemyColor)) ? true : false               
        if(type == 2 && pieceFound) return true
        if(currentSquare.hasPiece()) return false
      }    
      return pieceFound 
    }
    let [empty,piece] = [checkSquares(map1,enemyColor,1),checkSquares(map2,enemyColor,2)]
    return empty && piece
  }
  isEnPassant(color,x,y){
    const enpassantY = color == "white" ? 5 : 4;
    const enemyColor = color == "white" ? "black" : "white";
    const enpassantColor = enpassantY == 5 ? "white" : enpassantY == 4 ? "black" : null;
    const adder = color == "white" ? -1 : 1
    let result = {isEnPassant: false,square: null,targetSquare: null};
    if (y !== enpassantY || this.getColor() !== enpassantColor) return result;
    const enemyPawnSquare = this.CompressSquare(this.getX(), this.getY() + adder);
    const pawn = new Pawn(color, "pawn", enemyPawnSquare, "pawn", this.getX(), this.getY() + adder);
    const moves = pawn.concatDiagonalMoves().flat();
    for (const move of moves) {
      const currSquare = board.getSquare(move);
      if (!currSquare.hasEnemyPiece()) continue;
      if (!currSquare.hasSpecificPiece("pawn", enemyColor)) continue;
      const pieceName = currSquare.getpieceName();
      const piece = board.getPiece(pieceName);
      if (!piece.getmoved2()) continue;
      if (board.getlast_move()[1] !== currSquare.getName()) continue;
      const {x:px,y:py} = currSquare.decode();
      const targetY = color == "white" ? py + 1 : py - 1;
      const enpassantSquare = this.CompressSquare(px, targetY);
      result = {isEnPassant: true,square: enpassantSquare,targetSquare: currSquare.getName()};
      break;
    }
    let PinnedEnPassant = this.PinnedEnPassant(result,x,enpassantY,color,enemyColor)
    if(PinnedEnPassant) result = {isEnPassant: false,square: null,targetSquare: null}
    return result;
  }
  Promote(type){
    let promotion = this.getPieceElement("promotion")
    let imagesSrc = {white:{rook:"white-rook.jpg",knight:"white-knight.jpg",bishop:"white-bishop.jpg",queen:"white-queen.jpg"},black:{rook:"chess-36314_1280.png",knight:"knight-147065_1280.png",bishop:"bishop-147064_1280.png",queen:"queen-147062_1280.png"}}
    promotion.style.display = "none" 
    let pieceData = game.getPromotionData()
    let fcolorLetter = pieceData.color[0]
    let pieceId = `${type}_${game.getcounter()}${fcolorLetter}`
    let createNewPiece = () =>{
      let newPiece = document.createElement("img")
      newPiece.src = `../images/${imagesSrc[pieceData.color][type]}`
      newPiece.id = pieceId
      newPiece.classList.add("pieces",pieceData.color)
      return newPiece
    }
    let newPiece = createNewPiece()
    let preparePiece = () =>{     
      let square = document.getElementById(pieceData.square)
      square.removeChild(square.firstChild)
      square.appendChild(newPiece)
    }
    preparePiece()
    let piece = board.CreatePiece(pieceData.color,pieceId,pieceData.square,type,pieceData.x,pieceData.y)
    piece.setpromotionCompleted(true)
    board.makePieceDraggable(piece)   
    piece.drag(newPiece,[pieceData.targetSquare])
    let targetSquare = document.getElementById(pieceData.targetSquare)
    piece.drop({drag:newPiece,drop:targetSquare},[pieceData.targetSquare])
    game.updatecounter()
    let oldPieceIndex = this.findPieceIndex(pieceData.pawnid)
    this.removePiece(oldPieceIndex,true)
    board.Evaluation()
    let isCapture = board.getcaptures() > pieceData.Oldcaptures
    let notation = details.NotateMove(false,"pawn",pieceData.square,isCapture,pieceData.targetSquare,{isPromotion:true,type})
    details.addMove(notation)
    details.showNotation()
    game.setPromotionData({})
  }
  OpenPromotion(y,target,Oldcaptures){
    if(!this.isPromotion(this.getColor(),y)) return
    let promotion = this.getPieceElement("promotion")
    game.setPromotionData({color:this.getColor(),square:this.getSquare(),x:this.getX(),y:this.getY(),targetSquare:target,pawnid:this.getName(),Oldcaptures})
    promotion.style.display = "flex"
  }
  concatDiagonalMoves(){
    return [this.diagonalMove(1).concat(this.diagonalMove(-1))]
  }
  concatMoves(){
    return [this.moveForward()].concat(this.concatDiagonalMoves())
  }
  createMoves(){
    return this.concatMoves().map((moves,i) => i == 0 ? this.cutDirection(moves) : this.cutDiagonal(moves)).flat()
  }
  getDirection(color){
    return color === "white" ? 1 : -1
  }
  cutDiagonal(moves){
    let newmoves = []
    moves.forEach(move =>{
      let square = board.getSquare(move)
      if(square){
        let hasEnemy = square.hasEnemyPiece(this.getColor()) 
        hasEnemy ? newmoves.push(move) : null
      }    
    })
    return newmoves
  }
  cutDirection(moves){
    let newMoves = []
    for(let i = 0; i < moves.length; i++){     
      let square = board.getSquare(moves[i])
      let hasPiece = square.hasPiece()      
      if(hasPiece){
        newMoves = moves.slice(0,i)
        break
      } 
      newMoves.push(moves[i])
    }
    return newMoves
  }
  diagonalMove(direction2){
    let moves = []
    let direction = this.getDirection(this.getColor())
    let condition = direction2 == 1 ? this.getX() <= 7 : this.getX() >= 2 
    if(!condition) return moves  
    moves.push(this.CompressSquare(this.getX() + direction2,this.getY() + direction))
    return moves    
  }
  moveForward(){
    let moves = []
    const direction = this.getDirection(this.getColor())
    const startRow = this.getColor() === "white" ? 2 : 7
    const maxSteps = this.getY() === startRow ? 2 : 1
    if(this.getY() + 1 > 8 || this.getY() - 1 < 1) return moves
    for (let step = 1; step <= maxSteps; step++) {
      const newY = this.getY() + step * direction
      moves.push(this.CompressSquare(this.getX(),newY))
    }
    return moves
  }
}
class Timer{
  #time;
  #team;
  #ended = false        
  #counter;
  handlevisibility;
  offline;
  online;
  constructor(time,team){
    this.#time = time
    this.#team = team
  }
  getEnded(){
    return this.#ended
  }
  #update(){
    this.#time--   
    this.End()      
    let timer = document.getElementById(`timer_${this.#team}`)
    let [minutes,seconds] = [String(parseInt(this.#time / 60)).padStart(2,"0"),String(this.#time % 60).padStart(2,"0")]
    let beepSound = new Audio("https://andreas-hodo.github.io/Chess/Game/sounds/point-smooth-beep-230573.mp3")
    let opponentColor = this.#team == "white" ? "black" : "white"
    let low = this.#time <= 9
    timer.style.color = low && this.#time % 2 == 1 ? "red" : opponentColor
    if(game.getSoundAllowed() && low) beepSound.play()
    timer.innerText = `${minutes}:${seconds}`
    }
    start(){if(!this.#ended) this.#counter = setInterval(() =>{this.#update()},1000)}
    stop(){if(!this.#ended) clearInterval(this.#counter)}
    remainingTime(){return this.#time}
    handleState(){
      this.handlevisibility = () =>{
        let state = document.visibilityState === "hidden"
        state ? this.Offline() : this.Online()
      } 
      document.addEventListener("visibilitychange",this.handlevisibility)   
    }
    balance(){
      let offtime = parseInt(this.online / 1000 - this.offline / 1000) - 1
      let availTime = this.#time - offtime > 0
      this.#time = availTime ? this.#time -= offtime : 1
      this.start()
    }
    End(time = 0){
      if(this.#time > 0 && this.#time > time) return 
      this.stop()
      this.#ended = true
      document.removeEventListener("visibilitychange",this.handlevisibility)
      let winner = this.#team == "white" ? "Black" : "White"
      game.resultActions(`${winner} WON!`,`Time ended!`)
    }
    Online(){
      let secs = new Date().getTime()
      this.online = secs
      this.balance()
    }
    Offline(){ 
      this.stop()    
      let secs = new Date().getTime()
      this.offline = secs
    }
} 
class Details{
  #movesNotation = []
  addMove(move){this.#movesNotation.push(move)}
  getMoves(){return this.#movesNotation}
  #removelastMove(){this.#movesNotation.pop()}
  showNotation(){
    const turn = board.getTurnTeam()
    const notation = this.getMoves().at(-1)
    const fullMoves = game.getfull_moves()
    let move = turn === "white" ? (fullMoves === 2 ? 1 : fullMoves - 1) : fullMoves
    if (turn === "black" && move > 1) {
      const colorClass = turn === "black" ? "whiteMove" : "blackMove"
      const element = document.querySelector(`#move${move} .${colorClass}`)
      if(!element){
        const cont = document.querySelector(".lastmoves")
        const div = document.createElement("div")
        div.className = "moves"
        div.id = `move${move}`
        div.innerHTML = `<span>${move}.</span><span class="whiteMove">${notation}</span><span class="blackMove" style="color:white;"></span>`
        cont.appendChild(div)
      }else{element.innerText = notation}
    }else{
      const colorClass = turn === "black" ? "whiteMove" : "blackMove"
      const element = document.querySelector(`#move${move} .${colorClass}`)
      element.innerText = notation
      element.style.color = "rgb(227, 224, 150)"    
    }
    if(turn === "black") move--
    let lastMove = document.querySelector(`#move${move} .${turn}Move`)
    if(lastMove) lastMove.style.color = "white"  
  }
  NotateMove(castle,type,startsquare,capture,targetSquare,promotion = {isPromotion:false}){
    let notation = ""
    let color = board.getTurnTeam()
    let oppColor = color == "white" ? "black" : "white"
    if(castle.canCastle){notation = castle.move[0] == "g" ? "O-O" : "O-O-O";this.#removelastMove();return notation}
    if(game.getis_Draw()){notation = "1/2-1/2";return notation}
    let index = type == "knight" ? 1 : 0
    notation += type == "pawn" ? "" : type[index].toUpperCase()
    if(type !== "pawn" && type !== "king"){
      let {x,y} = board.getSquare(targetSquare).decode()
      let moves = board.CreatePiece(color,type,targetSquare,type,x,y).StartingMoves()
      let startobj = board.getSquare(startsquare)
      let stx = startobj.decode().x
      let sty = startobj.decode().y
      moves.forEach(move =>{
        let sqobj = board.getSquare(move)
        let cx = sqobj.decode().x
        let cy = sqobj.decode().y
        if(sqobj.hasSpecificPiece(type,oppColor)) notation += stx !== cx ? startsquare[0] : sty !== cy ? startsquare[1] : startsquare        
      })
    }
    if(capture) notation += type == "pawn" ? `${startsquare[0]}x` : "x"  
    notation += targetSquare
    if(promotion.isPromotion){notation += ` = ${promotion.type[0].toUpperCase()}`;this.#removelastMove()}
    let turn = board.getTurnTeam()
    let king = board.getPiece(`king_${turn[0]}`)
    if(king.getisInCheck() && !game.getis_Checkmate()) notation += "+"
    if(king.getisInCheck() && game.getis_Checkmate()) notation += "#"
    return notation
  }
}
let game = new Game()
let board = new Board()
let player1 = new Player("Black","black")
let player2 = new Player("White","white")
let countdownWhite = new Timer(600,"white") 
let countdownBlack = new Timer(600,"black")
let details = new Details()
game.setTimers(countdownWhite,countdownBlack)
console.log("Chess version 4!")