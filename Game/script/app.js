class Player{
    constructor(name,team){
         this.name = name
         this.team = team
         this.captured = []
    }
    play_again(){
      location.reload()
    }
    resign(){
      let button = document.getElementById("resign_btn")
      button.disabled = "true"
      button.style.color = "red";
      button.style.opacity = 0.95
      button.disabled = "true"
      board.resigned = true;
      let winner_message = board.fen[9] == "w" ? "Black Won!" : "White Won!"
      let final_res_message = board.fen[9] == "w" ? "White resigned!" : "Black resigned!"
      let endSound = new Audio("sounds/level-win-6416.mp3")
      if(board.isSoundAllowed){
      endSound.play()
      }
      board.remove_dragging()
      let result_elem = document.getElementById("resultpopup")
      let winner_elem = document.getElementById("winner")
      let final_res = document.getElementById("finalresult")
      result_elem.style.display = "flex"
      winner_elem.innerText = winner_message
      final_res.innerText = final_res_message
    }
    handleSound(){
       var soundelem = document.getElementById("volume")
       if(soundelem.classList.contains("fa-volume-up")){
         soundelem.classList.replace("fa-volume-up","fa-volume-off")
         board.isSoundAllowed = false
       }else if(soundelem.classList.contains("fa-volume-off")){
        soundelem.classList.replace("fa-volume-off","fa-volume-up")
        board.isSoundAllowed = true
       }
    }
    copyFen(){
      var fenelem = document.getElementById("fen")
      let fen = board.stringFen
      fenelem.innerText = fen
     navigator.clipboard.writeText(fenelem.innerText);
    }
}
class Board{
    constructor(){
         this.fen = [0,"rnbqkbnr","pppppppp","8","8","8","8","PPPPPPPP","RNBQKBNR","w","KQkq","-","0","1"]
         this.all_squares = []
         this.all_pieces = []
         this.cordinates_x = [0,"a","b","c","d","e","f","g","h"]
         this.cordinates_y = [0,1,2,3,4,5,6,7,8]
         this.turn = "White's Turn"
         this.full_moves = 1
         this.half_moves = 0
         this.counter = 3
         this.all_moves = []
         this.last_move = []
         this.king_status = []
         this.has_legal = true
         this.is_Checkmate = false
         this.is_Draw = false
         this.resigned = false
         this.isSoundAllowed = false
         this.stringFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }
    PinnedEnpassant(piece){
      let num = this.fen[9] == "w" ? 1 : -1 
      let rank = this.fen[9] == "w" ? 5 : 4
      let color = this.fen[9]
      let friendlyColor = this.fen[9] == "w" ? "white" : "black"
      let enemyColor = this.fen[9] == "w" ? "black" : "white"
      let FoundKing = false
      let FoundenemyPiece = false
      let pieceElem = document.getElementById(piece).parentNode.id
      let kingElem = document.getElementById(`king_${color}`).parentNode.id
      let distance = -1
      var KingY = board.square_decode(kingElem).y
      var PieceY = board.square_decode(pieceElem).y
      var PieceX = board.square_decode(pieceElem).x
      var lastPiece = null;
      if(this.fen[11] != "-"){
        var x = board.square_decode(this.fen[11]).x
        var y = board.square_decode(this.fen[11]).y - num
        distance = Math.abs(PieceX-x)
      }
      color = this.fen[9] == "w" ? "black" : "white"
      if(y == rank && PieceY == rank && KingY == rank && distance == 1){
        for(let i = 1; i <= 4; i++){
          color = color == "white" ? "black" : "white"
          let currentX = PieceX
          let currentY = PieceY
           if(i > 2){
             currentX = x
             currentY = y
             color = color == "white" ? "white" : "black"
           }
           let square = board.create_cordinates(currentX,currentY)
           let rook = new Rook("rook",color,square,currentX,currentY,false)
           let moves = rook.create_legal_moves()
           for(let i = 1; i <= 2; i++){
              moves = this.row_seperation(color,square)["rook"][i]
            let lastSquare = document.getElementById(moves[moves.length - 2])
           if(lastSquare && lastSquare.firstChild){
            var lastPiece =  lastSquare.firstChild.id
            let pieceArr = Array.from(lastPiece)
            let index = pieceArr.indexOf("_")
            var typeArr = pieceArr.slice(0,index)
            var type = typeArr.join("")
            var piece_color = pieceArr[pieceArr.length - 1] == "w" ? "white" : "black"         
           if((type == "king" && piece_color == friendlyColor)){
            FoundKing = true
           }else if((type == "queen" && piece_color == enemyColor) || (type == "rook" && piece_color == enemyColor)){
            FoundenemyPiece = true
           }
          }
          }
        }
      }
      if(FoundKing && FoundenemyPiece){
         return true
      }
      return false
    }
    row_seperation(color,square){
      let x = board.square_decode(square).x
      let y = board.square_decode(square).y
      let details = {
        rook: new Rook("rook",color,square,x,y,false).create_legal_moves(),
        bishop: new Bishop("bishop",color,square,x,y,false).create_legal_moves()
       }
       let rows = {
        rook:[],
        bishop:[]
       }
       let pieces = ["rook","bishop"]
       for(let i = 0; i < pieces.length; i++){
        let first_index = 0
        for(let j = 1; j <= 4; j++){
          let last_index = details[pieces[i]].indexOf("/")
          let current_row = details[pieces[i]].slice(first_index,last_index)
          rows[pieces[i]].push(current_row)   
          details[pieces[i]].splice(last_index,1)
          first_index = last_index 
        }
       }
      return rows
    }
    is_Pinned(){
      let squares = {
        rook:[],
        bishop:[]
      }
      let pins = {};
      let backMoves = {}
      let color = this.fen[9]
      let kingindex = board.find_index(board.all_pieces,`king_${color}`)
      let kingSquare = board.all_pieces[kingindex].square
      color = color == "w" ? "black": "white";
      let pieces = this.row_seperation(color,kingSquare)
      for(var piece in pieces){
         for(let i = 0; i < pieces[piece].length; i++){
          if(pieces[piece][i][pieces[piece][i].length - 1] == 2){
            let square = pieces[piece][i][pieces[piece][i].length - 2]
            let pieceId = document.getElementById(square).firstChild.id
            let pieceArr = Array.from(pieceId)
            let index = pieceArr.indexOf('_')
            let piecetype = pieceArr.slice(0,index).join("")
            squares[piece].push([square,i,pieceId])
            if(square && (piecetype == "rook" || piecetype == "queen" || piecetype == "bishop") && (piece == piecetype || piecetype == "queen")){
              backMoves[pieceId] = pieces[piece][i].slice(0,pieces[piece][i].length - 2)
            }
          }
         }
      } 
      color = color == "white" ? "black": "white"; 
      for(var piece in squares){
       for(let i = 0; i < squares[piece].length; i++){
        let directionNum = squares[piece][i][1]
        let direction = this.row_seperation(color,squares[piece][i][0])[piece][directionNum]
        for(let j = 0; j < direction.length; j++){
          //console.log(`For the ${squares[piece][i][0]} square that is ${piece} type  and the direction number is ${directionNum} we must check ${direction} squares`)
          if(direction[direction.length - 1] == 2){
            let pieceId = document.getElementById(`${direction[direction.length - 2]}`).firstChild.id
            let pieceArr = Array.from(pieceId)
            let index = pieceArr.indexOf('_')
            let piecetype = pieceArr.slice(0,index).join("")
            //console.log(`The ${direction[direction.length - 2]} square has an enemy ${piecetype}`)
            if(piecetype == piece || piecetype == "queen"){
              pins[squares[piece][i][2]] = direction
                 //console.log(`An ${piecetype} is pinning the piece that is in the ${squares[piece][i][0]} square`)
            }
          }
        }
       } 
      }
      return {pins,backMoves}
    }
    remove_illegal_when_pinned(moves,id){
      let newMoves = []
       if(this.is_Pinned()["pins"][id]){
          for(let i = 0; i < moves.length; i++){
             if(moves[i] == "/" || moves[i] == 2){
                  continue
             }
             let index = this.is_Pinned()["pins"][id].indexOf(moves[i]) 
             let currentMove =  moves[i]
             let secondMove = moves[i + 1]
             if(index != -1 && secondMove == 2){
              newMoves.push(currentMove,secondMove)
             }else if(index != -1 && secondMove != 2){
              newMoves.push(currentMove)
             }
          }
          let backMoves = this.is_Pinned()["backMoves"][id]
          if(backMoves){
            var all_moves = newMoves.concat(backMoves) 
          }else{
            var all_moves = newMoves
          }
       }else{
        return moves
       }
       return all_moves
    }
    remove_dragging(){
      var pieces = document.querySelectorAll(".pieces")
      pieces.forEach(item =>{
        item.draggable = false
      })
    }
    makepopup_movable(){
      var details_btn = document.getElementById("butup")
      var drag_btn = document.getElementById("movebtn")
    var my_id = document.getElementById("resultpopup")
    var details_popup = document.getElementById("details")
    drag_btn.addEventListener("pointerdown",(e)=>{
    drag_btn.style.backgroundColor = "red"
    drag_btn.classList.add("dragging")
    })
     details_btn.addEventListener("pointerdown",(e)=>{
    details_btn.style.backgroundColor = "red"
    details_btn.classList.add("dragging")
    })
    drag_btn.addEventListener("pointermove",(e)=>{
    if(drag_btn.classList[0] == "dragging" && document.body.clientWidth >= 716){
    let x = e.clientX - 10 - (document.body.clientWidth / 2)
    let y = e.clientY + 25 - (document.body.clientHeight / 4) 
    my_id.style.transform = `translate(${x}px,${y}px)` 
    }else if(drag_btn.classList[0] == "dragging" && document.body.clientWidth < 716){
      let x = e.clientX - 16 - (document.body.clientWidth / 2)
      let y = e.clientY - 28 - (document.body.clientHeight / 4) 
      my_id.style.transform = `translate(${x}px,${y}px)`
    }
    })
    details_btn.addEventListener("pointermove",(e)=>{
    if(details_btn.classList[2] == "dragging" && document.body.clientWidth >= 716){
    let x = e.clientX - 505 - (document.body.clientWidth / 2)
    let y = e.clientY + 36 - (document.body.clientHeight / 4) 
   details_popup.style.transform = `translate(${x}px,${y}px)` 
    }else if(details_btn.classList[2] == "dragging" && document.body.clientWidth < 716){
      let x = e.clientX + 105 - (document.body.clientWidth / 2)
      let y = e.clientY + 36 - (document.body.clientHeight / 4) 
      details_popup.style.transform = `translate(${x}px,${y}px)`
    }
    })
    drag_btn.addEventListener("pointerup",(e)=>{
        drag_btn.classList.remove("dragging")
        drag_btn.style.backgroundColor = "green"
    })
    details_btn.addEventListener("pointerup",(e)=>{
    details_btn.classList.remove("dragging")
    details_btn.style.backgroundColor = "green"
    })
    }
    is_draw(){
      let result_elem = document.getElementById("resultpopup")
      let winner_elem = document.getElementById("winner")
      let final_res = document.getElementById("finalresult")
      let endSound = new Audio("sounds/level-win-6416.mp3")
      let color = this.fen[9]
      let status = false
      this.all_pieces.forEach(piece =>{
        let arr = Array.from(piece.name)
        let piece_color = arr[arr.length - 1] 
        let moves = piece.create_legal_moves()
        const removable_items = ["/"]
         if(color == piece_color){
              let new_arr = moves.filter(element => !removable_items.includes(element))
              if(new_arr.length >= 1){
                status = true 
              }
         }})
         this.has_legal = status
      if((this.fen[9] == "w" || this.fen[9] == "b") && this.king_status.length == 0 && !this.has_legal){
      board.remove_dragging()
      this.is_Draw = true
      winner_elem.innerText = "Draw!"
      final_res.innerText = "No legal moves!"
      result_elem.style.display = "flex"
      let button = document.getElementById("resign_btn")
      button.style.opacity = 0.95
      button.disabled = "true"
      if(this.isSoundAllowed){
      endSound.play()
      }
      }
    }
    define_if_legal(){
      let color = this.fen[9]
      let status = false
      this.all_pieces.forEach(piece =>{
        let arr = Array.from(piece.name)
        let piece_color = arr[arr.length - 1] 
        let moves = piece.create_legal_moves()
        const removable_items = ["/"]
         if(color == piece_color){
              let new_arr = moves.filter(element => !removable_items.includes(element))
                var secondMoves = this.remove_illegal_when_in_check(new_arr)
                var legal =  this.remove_illegal_when_pinned(secondMoves,piece.name)
                //console.log(piece,legal)
              if(legal.length >= 1){
                status = true 
                return status
              }
         }
      })
      return status
    }
    define_winner(){
      let result_elem = document.getElementById("resultpopup")
      let winner_elem = document.getElementById("winner")
      let final_res = document.getElementById("finalresult")
      let endSound = new Audio("sounds/level-win-6416.mp3")
      let button = document.getElementById("resign_btn")
      if(this.fen[9] == "w" && this.king_status.length >= 1 && !this.has_legal){
        board.remove_dragging()
        this.is_Checkmate = true
        winner_elem.innerText = "Black WON!"
        final_res.innerText = "by Checkmate!"
        result_elem.style.display = "flex"
        if(this.isSoundAllowed){
          endSound.play()
        }     
        button.style.opacity = 0.95
        button.disabled = "true"
      }else if(this.fen[9] == "b" && this.king_status.length >= 1 && !this.has_legal){
        board.remove_dragging()
        this.is_Checkmate = true
        winner_elem.innerText = "White WON!"
        final_res.innerText = "by Checkmate!"
        result_elem.style.display = "flex"
        button.style.opacity = 0.95
        button.disabled = "true"
        if(this.isSoundAllowed){
        endSound.play()
        }
      }
    }
    start_timer(x,y){
      let timer ={
        white:x,
        black:y
      }
      let color = this.fen[9] == "w" ? "white" : "black"
      let timer_elem = document.getElementById(`timer_${color}`)
      let result_elem = document.getElementById("resultpopup")
      let winner_elem = document.getElementById("winner")
      let final_res = document.getElementById("finalresult")
      let endSound = new Audio("sounds/level-win-6416.mp3")
      let timerSound = new Audio("sounds/point-smooth-beep-230573.mp3")
      let minutes = parseInt(timer[color] / 60)
      let seconds = timer[color] % 60
      if(minutes < 10){
        minutes = "0" + minutes; 
      }
      if(seconds < 10){
        seconds = "0" + seconds;
        if(minutes == 0 && seconds % 2 == 1){
           timer_elem.style.color = "red"
           if(this.isSoundAllowed){
           timerSound.play()
           }
        }else if(minutes == 0 && seconds % 2 == 0){
           color = color == "black" ? "white" : "black"
           timer_elem.style.color = color
           color = color == "black" ? "white" : "black"
           if(this.isSoundAllowed){
           timerSound.play()
           }
        }
      }
     timer_elem.innerText = `${minutes}:${seconds}`
     setTimeout(() =>{
      if(timer[color] == 0){
        let opp_color = color == "white" ? "Black" : "White"
        winner_elem.innerText = `${opp_color} WON!`
        final_res.innerText = "Time ended!"
        result_elem.style.display = "flex"
        board.remove_dragging()
        let button = document.getElementById("resign_btn")
        button.style.opacity = 0.95
        button.disabled = "true"
        if(this.isSoundAllowed){
        endSound.play()
        }
        return
      }
       if(timer[color] > 0 && color == "white" && !this.is_Checkmate && !this.resigned && !this.is_Draw){
        this.start_timer(x - 1,y)
       }else if(timer[color] > 0 && color == "black" && !this.is_Checkmate && !this.resigned && !this.is_Draw){
        this.start_timer(x,y - 1)
       }
     },1000)     
    }
    create_squares(){
         for(let i = 1; i <= 8; i++){
            for(let j = 1; j <= 8; j++){
                var id  = this.create_cordinates(i,j)
                var current_square  = document.getElementById(id)
                if((i % 2 == 1 && j % 2 == 1) || (i % 2 == 0 && j % 2 == 0)){
                      this.all_squares.push(new Square(id,"black",i,j))
                }else{
                    this.all_squares.push(new Square(id,"white",i,j))
                }
            }
         }
         return this.all_squares
    }
    create_pieces(){
      //Pawns 
      for(let i = 1; i <= 8; i++){
        this.all_pieces.push(new Pawn(`pawn_${i}w`,"white",this.create_cordinates(i,2),i,2))
        this.all_pieces.push(new Pawn(`pawn_${i}b`,"black",this.create_cordinates(i,7),i,7))
      }
     //Rooks
     var cor = 1
     for(let i = 1; i <= 2; i++){
      this.all_pieces.push(new Rook(`rook_${i}w`,"white",this.create_cordinates(cor,1),cor,1))
      this.all_pieces.push(new Rook(`rook_${i}b`,"black",this.create_cordinates(cor,8),cor,8))
      cor+= 7
    }
    //Knights
    cor = 2
    for(let i = 1; i <= 2; i++){
     this.all_pieces.push(new Knight(`knight_${i}w`,"white",this.create_cordinates(cor,1),cor,1))
     this.all_pieces.push(new Knight(`knight_${i}b`,"black",this.create_cordinates(cor,8),cor,8))
     cor+= 5
   }
   //Bishops
   cor = 3
   for(let i = 1; i <= 2; i++){
    this.all_pieces.push(new Bishop(`bishop_${i}w`,"white",this.create_cordinates(cor,1),cor,1))
    this.all_pieces.push(new Bishop(`bishop_${i}b`,"black",this.create_cordinates(cor,8),cor,8))
    cor+= 3
  }
  //Kings 
  this.all_pieces.push(new King(`king_w`,"white",this.create_cordinates(5,1),5,1))
    this.all_pieces.push(new King(`king_b`,"black",this.create_cordinates(5,8),5,8))
  //Queens 
  this.all_pieces.push(new Queen(`queen_w`,"white",this.create_cordinates(4,1),4,1))
  this.all_pieces.push(new Queen(`queen_b`,"black",this.create_cordinates(4,8),4,8))
      this.all_pieces.forEach(piece =>{
        piece.drag()
      })
      return this.all_pieces
    }
    move(squares){
        squares.forEach(element => {
         var current_square = document.getElementById(element.name)
         current_square.addEventListener("dragover",this.allowdrop.bind(this))
         current_square.addEventListener("drop",this.drop.bind(this))
        });
    }
    allowdrop(e){
      e.preventDefault()
    }
     drop(e){
      e.preventDefault()
      const data = e.dataTransfer.getData("Text");
      var parent_elem = document.getElementById(e.target.id).parentNode
      var parent_elem1 = document.getElementById(e.target.id).id
      if(e.target.classList[0] == "pieces"){
        var id = parent_elem.id
      }else{
        var id  = parent_elem1
      }
      var id_1 = Array.from(data)
      if((id_1[id_1.length - 1] == "w" && board.define_turn() == "White's Turn") || (id_1[id_1.length - 1] == "b" && board.define_turn() == "Black's Turn")){
      var old_parent = document.getElementById(data).parentNode.id
      var moves_index = board.find_index(board.all_pieces,data)
      var moves = board.all_pieces[moves_index].create_legal_moves()
      var square_index = board.find_index(board.all_squares,id)
      var square_color = board.all_squares[square_index].color
      var cor_y = board.all_pieces[moves_index].y
      var cor_x = board.all_pieces[moves_index].x
      var new_cor_x =  board.all_squares[square_index].x
      var new_cor_y = board.all_squares[square_index].y
      var new_square_color = board.all_squares[square_index].color 
      var piece_color = board.all_pieces[moves_index].color
      var piece_type = board.all_pieces[moves_index].type
      if(piece_type != "king"){
            moves = board.remove_illegal_when_pinned(moves,data)
      }
      if(piece_type == "king" && board.create_cordinates(cor_x,cor_y) == "e1" && new_square_color == "rgb(149,255,245)"){
       var king = new King() 
       var castle = king.castle(id,piece_color,true)
       moves = moves.concat(castle)
      }else if(piece_type == "king" && board.create_cordinates(cor_x,cor_y) == "e8" && new_square_color == "rgb(149,255,245)"){
        var king = new King() 
        var castle = king.castle(id,piece_color,true)
        moves = moves.concat(castle)
      }
      if(piece_type == "pawn"){
        var pawn = new Pawn() 
        var enpassant = pawn.en_passant(cor_x,cor_y,piece_color,parent_elem1)
        if(enpassant.includes(this.fen[11])){
           moves = moves.concat(enpassant)
        }
       }
       if(board.king_status.length > 0 && piece_type != "king"){
       moves = this.remove_illegal_when_in_check(moves)
       }
      if(moves.indexOf(id) !== -1){
        var sound = new Audio("sounds/479457-Moving_Random_Chess_Pieces_08.WAV")
        if(this.isSoundAllowed){
        sound.play()
        }
        this.all_moves.push(old_parent+"-"+id)
        this.last_move = []
        this.last_move.push(old_parent,id)
      if(square_color == "rgb(255,241,0)"){
        this.remove_enemy_piece(id)
        }
      if(e.target.classList[0] == "pieces"){
        parent_elem.appendChild(document.getElementById(data));
      }else{
        e.target.appendChild(document.getElementById(data));
      }
      if(piece_type == "pawn" && ((cor_y == 2 && piece_color == "black") || (cor_y == 7 && piece_color == "white"))){
        var pieces = ["rook","knight","bishop","queen"]
       var promotion_window = document.getElementById("promotion")
       promotion_window.style.display = "flex"
      }
      this.change_turn()
      var new_cordinates = this.change_piece_details(data,id)
      this.change_fen(cor_y,square_index,piece_color,cor_x,data,piece_type)
      var board_element = document.getElementById("chess_board_wrapper")
      var pieces_elements = document.querySelectorAll(".pieces")
      if(board.fen[9] == "w"){
        pieces_elements.forEach(item =>{
          item.style.animation = "rotate-black 1s ease-in-out forwards"
        })
        board_element.style.animation = "rotate-black 1s ease-in-out forwards"
      }else{
        board_element.style.animation = "rotate-white 1s ease-in-out forwards"
        pieces_elements.forEach(item =>{
          item.style.animation = "rotate-white 1s ease-in-out forwards" 
        })
      }
      var king = new King()
      var black_king = document.getElementById("king_b").parentNode.id
      var white_king = document.getElementById("king_w").parentNode.id
      var index1 = board.find_index(board.all_pieces,"king_w")
      var index2 = board.find_index(board.all_pieces,"king_b")
      if(Object.keys(king.Incheck(black_king,white_king)).length == 1){
        let key = Object.keys(king.Incheck(black_king,white_king))
        this.king_status = king.Incheck(black_king,white_king)[key][1]
      }else if(Object.keys(king.Incheck(black_king,white_king)).length == 2){
        this.king_status = ["two"]
      }else{
        this.king_status = []
      }
       if(board.fen[9] == "b" && board.all_pieces[index1].inCheck){
        board.all_pieces[index1].inCheck = false
       }else if(board.fen[9] == "w" && board.all_pieces[index2].inCheck){
        board.all_pieces[index2].inCheck = false 
       }
       if(board.fen[9] == "w" && board.all_pieces[index1].inCheck){
        this.has_legal = this.define_if_legal()
      }else if(board.fen[9] == "b" && board.all_pieces[index2].inCheck){
        this.has_legal = this.define_if_legal()
      }
      if((board.fen[9] == "w" && board.all_pieces[index1].create_legal_moves().length >= 1) || (board.fen[9] == "b" && board.all_pieces[index2].create_legal_moves().length >= 1)){
        this.has_legal = true
      }
      this.define_winner()
      board.is_draw()
      }else{
       if(old_parent != id){
       var invalidpopup = document.getElementById("invalid_popup");
       invalidpopup.style.animation = 'none';
    setTimeout(function() {
        invalidpopup.style.animation = 'invalidpopup 5s ease-in-out forwards';
        invalidpopup.innerText = `Invalid move ${old_parent}-${id}!`
    }, 100);
       }
      }
      this.remove_square_color()
      this.apply_square_color(this.last_move,"rgb(227, 224, 150)")
    }
    }
    remove_illegal_when_in_check(moves){
      let legal  = []
      if(board.king_status[0] == "two"){
         return legal
      }
      for(let i = 0; i < moves.length; i++){
          if(this.king_status.indexOf(moves[i]) != -1 && moves[i+1] == 2){
            legal.push(moves[i],2)
            i += 1
          }else if(this.king_status.indexOf(moves[i]) != -1 && moves[i+1] != 2){
            legal.push(moves[i])
          }else if(this.king_status.indexOf(moves[i]) == -1 && moves[i+1] == 2){
            i += 1  
          }
      }
      return legal
    }
    change_fen_row(y,cordinates){
      var cor;
      cordinates.forEach(item =>{
        if(item[0] == y){
          cor = item[1]
        }
      })
      let counter = 0
      var change = ""
      for(let i = 1; i <= 8; i++){
        var child = document.getElementById(board.create_cordinates(i,y)).firstChild
        if(child){
        var elem = Array.from(child.id)
        var piece_id = child.id
        var color = child.classList[1]
        var index = elem.indexOf("_")
        var type = ""
        var cut = elem.slice(0,index)
        cut.forEach(el =>{
          type = type + el
        })
          if(counter !== 0){
          change += counter
        }
        if(color == "white"){
          if(elem[1] == "n" && type == "knight"){
          var id_1 = elem[1].toUpperCase()
          }else{
            var id_1 =  piece_id[0].toUpperCase() 
          }
          change += id_1
      }else{
        if(elem[1] == "n" && type == "knight"){
          change += elem[1]
        }else{
        change += elem[0]
      }
      }
          counter = 0;
        }else{
          counter++
          if(i == 8){
            change += counter
          }
        }
      }
      this.fen[cor] = change
      var fen = ""
      for(let i = 1; i < this.fen.length; i++){
        if(i <= 7){
        fen += this.fen[i] + "/"
      }else{
        fen += this.fen[i] + " "
      }
      }
      return fen
    }
    change_fen(old_y,index,piece_color,x,id,piece_type){
      var cordinates = [[8,1],[7,2],[6,3],[5,4],[4,5],[3,6],[2,7],[1,8]]
      var castle_cordinates = {
       "rook_1w":["Q"],
        "rook_2w":["K"],
        "rook_1b":["q"],
        "rook_2b":["k"],
        "king_b":["k","q"],
        "king_w":["K","Q"]
      }
      var castle_squares = {
        a1:"rook_1w",
        h1:"rook_2w",
        a8:"rook_1b",
        h8:"rook_2b"
      }
      var new_y = board.all_squares[index].y
        //Change turn
        this.fen[9] = board.turn[0].toLowerCase()
        //Change castle status
        var square = document.getElementById(id).parentNode.id
      if(castle_squares[square]){
        let castle = castle_cordinates[castle_squares[square]]
          castle.forEach(piece =>{
            board.fen[10] = board.fen[10].replace(piece,"")
            if(board.fen[10] == ""){
              board.fen[10] = "-"
            }
          })
      }
       if(piece_type == "rook" || piece_type == "king"){
        let castle = castle_cordinates[id]
        if(castle){
        castle.forEach(piece =>{
          board.fen[10] = board.fen[10].replace(piece,"")
          if(board.fen[10] == ""){
            board.fen[10] = "-"
          }
        })
      }
       }
        //Change en passant status
        if(piece_type == "pawn" && new_y - old_y == 2 && piece_color == "white"){
          this.fen[11] = this.create_cordinates(x,new_y - 1)
        }else if(piece_type == "pawn" && new_y - old_y == -2 && piece_color == "black"){
          this.fen[11] = this.create_cordinates(x,new_y + 1)
        }else{
          this.fen[11] = "-"
        }
        //Update half moves
        if(piece_type == "pawn"){
          this.half_moves = 0
          this.fen[12] = this.half_moves
        }else{
          this.half_moves++
          this.fen[12] = this.half_moves
        }
        //Update full moves
        if(this.turn == "White's Turn"){
           this.full_moves++
           this.fen[13] = this.full_moves
        }
        //Change old row
        var old_fen = this.change_fen_row(old_y,cordinates)
        //Change new row 
        var new_fen = this.change_fen_row(new_y,cordinates)
        console.log(new_fen)
        this.stringFen = new_fen
    }
    pawn_promote(clicked){
      var square_id = board.last_move[1]
      var piece_elem = document.getElementById(square_id).firstChild.id
      var piece_color = document.getElementById(piece_elem).classList[1]
      var promotion_window = document.getElementById("promotion")
      var square_index = board.find_index(board.all_squares,square_id)
      var new_x = board.square_decode(board.all_squares[square_index].name).x
      var new_y = board.square_decode(board.all_squares[square_index].name).y
      board.remove_enemy_piece(board.all_squares[square_index].name)
      var square = document.getElementById(square_id)
      var id_color = Array.from(piece_color)[0]
      var piece_id = clicked.id
        board.create_new_promote_piece(piece_id,piece_color,board.counter,square,id_color,new_y)
        board.create_promote_object(piece_id,piece_color,board.counter,square_id,new_x,new_y,id_color)
        board.counter++
       promotion_window.style.display = "none"
       var king = new King()
       var black_king = document.getElementById("king_b").parentNode.id
       var white_king = document.getElementById("king_w").parentNode.id
       king.Incheck(black_king,white_king)
       if(Object.keys(king.Incheck(black_king,white_king)).length == 1){
        let key = Object.keys(king.Incheck(black_king,white_king))
        this.king_status = king.Incheck(black_king,white_king)[key][1]
      }else if(Object.keys(king.Incheck(black_king,white_king)).length == 2){
        this.king_status = ["two"]
      }else{
        this.king_status = []
      }
      var index1 = board.find_index(board.all_pieces,"king_w")
      var index2 = board.find_index(board.all_pieces,"king_b")
      if(board.fen[9] == "w" && board.all_pieces[index1].inCheck){
        this.has_legal = this.define_if_legal()
      }else if(board.fen[9] == "b" && board.all_pieces[index2].inCheck){
        this.has_legal = this.define_if_legal()
      }
      // if((board.fen[9] == "w" && board.all_pieces[index1].create_legal_moves().length >= 1) || (board.fen[9] == "b" && board.all_pieces[index2].create_legal_moves().length >= 1)){
      //   this.has_legal = true
      // }
       board.apply_square_color([],null)
       board.define_winner()
       board.is_draw()
  }
  create_new_promote_piece(piece_id,color,counter,square,id_color,new_y){
var cordinates = [[8,1],[7,2],[6,3],[5,4],[4,5],[3,6],[2,7],[1,8]]
var images = [
  ["rook","white","images/white-rook.jpg"],
  ["knight","white","images/white-knight.jpg"],
  ["bishop","white","images/white-bishop.jpg"],
  ["queen","white","images/white-queen.jpg"], 
  ["rook","black","images/chess-36314_1280.png"],
  ["knight","black", "images/knight-147065_1280.png"],
  ["bishop","black","images/bishop-147064_1280.png"],
  ["queen","black","images/queen-147062_1280.png"] 
]
for(let i = 0; i < images.length; i++){
if(piece_id == images[i][0] && color == images[i][1]){
var image_id = images[i][2]
}
}
var new_piece = document.createElement("img")
   new_piece.setAttribute("src",image_id)
   new_piece.classList.add("pieces")
   new_piece.classList.add(color)
   new_piece.id = `${piece_id}_${counter}${id_color}`
   new_piece.draggable = true
   square.appendChild(new_piece)
   var new_fen = this.change_fen_row(new_y,cordinates)
   if(color == "white"){
    new_piece.style.animation = "rotate-white 0s ease-in-out forwards"
   }else{
     new_piece.style.animation = "rotate-black 0s ease-in-out forwards"
   }
   console.log(new_fen)
  }
  create_promote_object(piece_id,color,counter,square,new_x,new_y,id_color){
    var piece;
    if(piece_id == "rook"){
      piece = new Rook(`${piece_id}_${counter}${id_color}`,color,square,new_x,new_y)
      piece.drag()
      board.all_pieces.push(piece)
    }else if(piece_id == "knight"){
      piece = new Knight(`${piece_id}_${counter}${id_color}`,color,square,new_x,new_y)
      piece.drag()
      board.all_pieces.push(piece)
    }else if(piece_id == "bishop"){
      piece = new Bishop(`${piece_id}_${counter}${id_color}`,color,square,new_x,new_y)
      piece.drag()
      board.all_pieces.push(piece) 
    }else if(piece_id == "queen"){
      piece = new Queen(`${piece_id}_${counter}${id_color}`,color,square,new_x,new_y)
      piece.drag()
      board.all_pieces.push(piece)
    }
  }
    remove_enemy_piece(id){
      var square = document.getElementById(id)
      var child = document.getElementById(id).firstChild
      var index = board.find_index(board.all_pieces,child.id)
      var captured_piece;
      //Update half moves
      this.half_moves = -1
      if(board.all_pieces[index].color == "black"){
        captured_piece = board.all_pieces.splice(index,1)
        player_2.captured.push(captured_piece)
      }else{
        captured_piece = board.all_pieces.splice(index,1)
        player_1.captured.push(captured_piece)
      }
      square.removeChild(square.firstElementChild)
    }
    change_piece_details(piece,square_id){
        var index = this.find_index(this.all_pieces,piece)
        this.all_pieces[index].square = square_id
        this.all_pieces[index].x = this.square_decode(square_id).x
        this.all_pieces[index].y = this.square_decode(square_id).y 
        return {cor_x:this.all_pieces[index].x,cor_y:this.all_pieces[index].y}

    }
    define_turn(){
      var turn  = document.getElementById("turn").innerText = this.turn
      return this.turn
    }
    change_turn(){
      if(this.turn == "White's Turn"){
         this.turn = "Black's Turn"
      }else{
         this.turn = "White's Turn"
      }
      this.define_turn()
    }
    create_cordinates(x,y){
        return this.cordinates_x[x] + this.cordinates_y[y]
    }
    find_index(arr,square){
       return arr.findIndex(obj => obj.name == square)
    }
    obstacles(child,color){
      if(child){
        var id = child.id
        if((id[id.length - 1] == "w" && color == "white") || (id[id.length - 1] == "b" && color == "black")){
            return 1
        }else if((id[id.length - 1] == "b" && color == "white") || (id[id.length - 1] == "w" && color == "black")){
            return 2
        } 
        }
    }
    square_decode(square){
      var cors  = Array.from(square)
      var cor_x = this.cordinates_x.indexOf(cors[0])
      var cor_y = this.cordinates_y.indexOf(parseInt(cors[1]))
      return {x: cor_x,y: cor_y}
    }
    apply_square_color(arr,square_color){
      for(let i = 0; i < arr.length; i++){
      if(arr[i] == "/"){
         continue
      }else if(arr[i] == 2){
        var index = this.find_index(this.all_squares,arr[i - 1])
        var square = document.getElementById(arr[i - 1])
        this.all_squares[index].color = "rgb(255,241,0)"
         square.style.backgroundColor = "rgb(255,241,0)" 
         continue
      }else if(arr[i] == 3){
        var index = this.find_index(this.all_squares,arr[i - 1])
        var square = document.getElementById(arr[i - 1])
        this.all_squares[index].color = "rgb(0,255,255)"
         square.style.backgroundColor = "rgb(0,255,255)"
         continue
      }else if(arr[i] == 4){
        var index = this.find_index(this.all_squares,arr[i - 1])
        var square = document.getElementById(arr[i - 1])
        this.all_squares[index].color = "rgb(149,255,245)"
         square.style.backgroundColor = "rgb(149,255,245)"
         continue
      }
      var index = this.find_index(this.all_squares,arr[i])
      var square = document.getElementById(arr[i])
       this.all_squares[index].color = square_color
        square.style.backgroundColor = square_color
      }
      var kings = {
        black: board.all_pieces[board.find_index(board.all_pieces,"king_b")].inCheck,
        white:  board.all_pieces[board.find_index(board.all_pieces,"king_w")].inCheck
      }
      var black_king = document.getElementById("king_b").parentNode
      var white_king = document.getElementById("king_w").parentNode
      if(kings.black){
        let index = board.find_index(board.all_squares,black_king.id)
        this.all_squares[index].color = "red"
        black_king.style.backgroundColor = "red"
      }
      if(kings.white){
        let index = board.find_index(board.all_squares,white_king.id)
        this.all_squares[index].color = "red"
        white_king.style.backgroundColor = "red"
      }
    }
    remove_square_color(){
      this.all_squares.forEach(item =>{
        var square = document.getElementById(item.name)
        if(item.defaultcolor == "black"){
          square.style.backgroundColor = "rgb(100,75,43)"
          item.color = item.defaultcolor
        }else{
          square.style.backgroundColor = "rgb(240,201,150)"
          item.color = item.defaultcolor
        }
      })
    }
}
class Square{
constructor(name,defaultcolor,x,y){
     this.name = name
     this.defaultcolor = defaultcolor
     this.color = defaultcolor
     this.x = x 
     this.y = y
}
}

class Pieces{
    constructor(name,color,square,x,y){
         this.name = name
         this.color = color 
         this.square = square
         this.x = x
         this.y = y
         this.pinned = false
         this.legal_moves = []
    }
    drag(){
       var current_piece  = document.getElementById(this.square).firstChild
       current_piece.addEventListener("dragstart",(e)=>{
        e.target.style.cursor = "grab"
        var index = board.find_index(board.all_pieces,e.target.id)
        var current_square = board.all_pieces[index].square
        var moves = board.all_pieces[index].create_legal_moves()
        var id = Array.from(e.target.id)
        if((id[id.length - 1] == "b" && board.define_turn() == "Black's Turn") || (id[id.length - 1] == "w" && board.define_turn() == "White's Turn")){
          e.dataTransfer.setData("Text", e.target.id);
          var current_square = document.getElementById(e.target.id).parentNode
          current_square.style.backgroundColor = "rgb(74,236,0)"
          var piece_type = board.all_pieces[index].type
          var piece_color = board.all_pieces[index].color
          var x = board.all_pieces[index].x
          var y = board.all_pieces[index].y
          if(piece_type != "king"){
            moves = board.remove_illegal_when_pinned(moves,e.target.id)
          }
          if(piece_type == "pawn"){
            var pawn = new Pawn() 
            var enpassant = pawn.en_passant(x,y,piece_color,null)
            moves = moves.concat(enpassant)
           }
           if((piece_type == "king" && board.create_cordinates(x,y) == "e1" && piece_color == "white") || (piece_type == "king" && board.create_cordinates(x,y) == "e8" && piece_color == "black")){
            var king = new King() 
            var castle = king.castle(current_square.id,piece_color,null,e.target.id) 
            moves = moves.concat(castle)
           }
           if(board.king_status.length > 0 && piece_type != "king"){
            moves = board.remove_illegal_when_in_check(moves)
           }
          board.apply_square_color(moves,"rgb(30,94,0)")
        }
       })
      }
}
class Rook extends Pieces{
    constructor(name,color,square,x,y,pinned){
      super(name,color,square,x,y,pinned)
      this.type = "rook"
    }
    create_legal_moves(){
      for(let i = this.y + 1; i <= 8; i++){
      let child = document.getElementById(board.create_cordinates(this.x,i)).firstElementChild
      if(board.obstacles(child,this.color) == 1){
        break
      }else if(board.obstacles(child,this.color) == 2){
        this.legal_moves.push(board.create_cordinates(this.x,i),2)
        break
      }
      this.legal_moves.push(board.create_cordinates(this.x,i))
      }
      this.legal_moves.push("/")
      for(let i = this.x + 1; i <= 8; i++){
        let child = document.getElementById(board.create_cordinates(i,this.y)).firstElementChild
        if(board.obstacles(child,this.color) == 1){
          break
        }else if(board.obstacles(child,this.color) == 2){
          this.legal_moves.push(board.create_cordinates(i,this.y),2)
          break
        }
        this.legal_moves.push(board.create_cordinates(i,this.y))
     }
     this.legal_moves.push("/")
     for(let i = this.x - 1; i >= 1; i--){
      let child = document.getElementById(board.create_cordinates(i,this.y)).firstElementChild
      if(board.obstacles(child,this.color) == 1){
        break
      }else if(board.obstacles(child,this.color) == 2){
        this.legal_moves.push(board.create_cordinates(i,this.y),2)
        break
      }
      this.legal_moves.push(board.create_cordinates(i,this.y))
    }
    this.legal_moves.push("/")
      for(let i = this.y - 1; i >= 1; i--){
        let child = document.getElementById(board.create_cordinates(this.x,i)).firstElementChild
        if(board.obstacles(child,this.color) == 1){
          break
        }else if(board.obstacles(child,this.color) == 2){
          this.legal_moves.push(board.create_cordinates(this.x,i),2)
          break
        }
      this.legal_moves.push(board.create_cordinates(this.x,i))
   }
   this.legal_moves.push("/")
   var all_moves = this.legal_moves
       this.legal_moves = []
      return all_moves
    }
}
class Knight extends Pieces{
    constructor(name,color,square,x,y,pinned){
      super(name,color,square,x,y,pinned)
      this.type = "knight"
    }
    create_legal_moves(){
      var cors = [[1,2],[-1,2],[1,-2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]]
      for(let i = 0; i < 8; i++){
        var square = document.getElementById(board.create_cordinates(this.x + cors[i][0],this.y + cors[i][1]))
        if(square){
          var child = square.firstChild
             if(child){
             if(board.obstacles(child,this.color) == 1){
              continue
             }else if(board.obstacles(child,this.color) == 2){
               this.legal_moves.push(square.id,2)
               continue
             }
            }
            this.legal_moves.push(square.id)
        }
      }
        var all_moves = this.legal_moves
        this.legal_moves = []
        return all_moves
 }
}
class Bishop extends Pieces{
    constructor(name,color,square,x,y,pinned){
      super(name,color,square,x,y,pinned)
      this.type = "bishop"
    }
    create_legal_moves(){
      var y = this.y + 1
    for(let i = this.x + 1; i <= 8; i++){
          if(y == 9){
            break
          }
          let child = document.getElementById(board.create_cordinates(i,y)).firstElementChild
          if(board.obstacles(child,this.color) == 1){
            break
          }else if(board.obstacles(child,this.color) == 2){
            this.legal_moves.push(board.create_cordinates(i,y),2)
            break
          }
          this.legal_moves.push(board.create_cordinates(i,y))
          y++
    }
    this.legal_moves.push("/")
        y = this.y + 1
    for(let i = this.x - 1; i >= 1; i--){
          if(y == 9){
            break
          }
          let child = document.getElementById(board.create_cordinates(i,y)).firstElementChild
          if(board.obstacles(child,this.color) == 1){
            break
          }else if(board.obstacles(child,this.color) == 2){
            this.legal_moves.push(board.create_cordinates(i,y),2)
            break
          }
          this.legal_moves.push(board.create_cordinates(i,y))
          y++
    }
    this.legal_moves.push("/")
    y = this.y - 1
    for(let i = this.x + 1; i <= 8; i++){
          if(y == 0){
            break
          }
          let child = document.getElementById(board.create_cordinates(i,y)).firstElementChild
          if(board.obstacles(child,this.color) == 1){
            break
          }else if(board.obstacles(child,this.color) == 2){
            this.legal_moves.push(board.create_cordinates(i,y),2)
            break
          }
          this.legal_moves.push(board.create_cordinates(i,y))
          y--
    }
    this.legal_moves.push("/")
    y = this.y - 1
    for(let i = this.x - 1; i >= 1; i--){
          if(y == 0){
            break
          }
          let child = document.getElementById(board.create_cordinates(i,y)).firstElementChild
          if(board.obstacles(child,this.color) == 1){
            break
          }else if(board.obstacles(child,this.color) == 2){
            this.legal_moves.push(board.create_cordinates(i,y),2)
            break
          }
          this.legal_moves.push(board.create_cordinates(i,y))
          y--
    }
    this.legal_moves.push("/")
      var all_moves = this.legal_moves
      this.legal_moves = []
      return all_moves
 }
}
class King extends Pieces{
    constructor(name,color,square,x,y){
      super(name,color,square,x,y)
      this.type = "king"
      this.inCheck = false
    }
    Incheck(black,white){
    var check_status = {}
    var end_of_row_cors = {}
    var legal_moves  = []
    var counter = 1
    var details = {
        black:[],
        white:[]
    }
    var black_king = document.getElementById("king_b").parentNode.id
    var white_king = document.getElementById("king_w").parentNode.id
    var color = board.fen[9] == "w" ? "white": "black"
    details.black.push(black,"king_b")
    details.white.push(white,"king_w")
    var square = details[color][0]
    var pieces = {
      rook: new Rook("rook",color,square,board.square_decode(square).x,board.square_decode(square).y,false).create_legal_moves(),
      knight: new Knight("knight",color,square,board.square_decode(square).x,board.square_decode(square).y,false).create_legal_moves(),
      bishop: new Bishop("bishop",color,square,board.square_decode(square).x,board.square_decode(square).y,false).create_legal_moves(),
      queen: new Queen("queen",color,square,board.square_decode(square).x,board.square_decode(square).y,false).create_legal_moves(),
      pawn: new Pawn("pawn",color,square,board.square_decode(square).x,board.square_decode(square).y,false).diagonal_captures(),
    }
    for(var item in pieces){
      let cors = []
         if(item == "rook" || item == "bishop" || item == "queen"){
          for(let i = 0; i < pieces[item].length; i++){
            if(pieces[item][i] == "/"){
              cors.push(i)
            }
          } 
          end_of_row_cors[item] = cors
         }
    }
    for(var item in pieces){
      for(let i = 0; i < pieces[item].length; i++){
        if(pieces[item][i] == 2 || pieces[item][i] == "/"){
          continue
        }
        var child = document.getElementById(pieces[item][i]).firstChild
        if(child){
          var id = child.id
          var index = id.indexOf("_")
          var elem = Array.from(id).splice(0,index)
          var type = ""
          elem.forEach(item =>{
            type += item
          })
          if(item == type && (square == black_king || square == white_king)){
          let index = board.find_index(board.all_pieces,details[color][1])
          board.all_pieces[index].inCheck = true
          if(item == "rook" || item == "bishop" || item == "queen"){
          let index1 = pieces[item].indexOf(pieces[item][i])
          let start = 0
          let end = 0
          for(let j = 0; j < end_of_row_cors[item].length; j++){
            if(end_of_row_cors[item][j] >= index1){
              start = end_of_row_cors[item][j-1]
              end = end_of_row_cors[item][j]  
              break
           }
          }
          legal_moves = pieces[item].slice(start,end)
        }else{
          legal_moves.push(pieces[item][i])
        }
          }
          if(item == type){
            //console.log(`A ${type} is checking the ${color} king. King's square:${square},piece square:${pieces[item][i]}`)
            check_status[`${type}${counter}`] = [pieces[item][i],legal_moves,true]
            counter++
          }
        }
      }
    }
    //console.log(check_status)
    return check_status
  }
    castle(king_square,color,drop){
      var castle_squares = [["f1","g1"],["d1","b1","c1"],["f8","g8"],["d8","b8","c8"]]
      var castle = []
      var castle_details = {
        g1:["K",false,"f1","h1","K","Q"],
        c1:["Q",false,"d1","a1","K","Q"],
        g8:["k",false,"f8","h8","k","q"],
        c8:["q",false,"d8","a8","k","q"]
      }
      var check = {
         white:[["e1","f1","g1"],["e1","d1","b1","c1"]],
         black:[["e8","f8","g8"],["e8","d8","b8","c8"]],
         g1:true,
         c1:true,
         g8:true,
         c8:true,
      }
    for(let i = 0; i < check[color].length; i++){
      let z = true
      for(let j = 0; j < check[color][i].length; j++){
          if(Object.keys(this.Incheck(check[color][i][j],check[color][i][j])).length !== 0){
        z = false
      }
     check[check[color][i][check[color][i].length - 1]] = z
      }
    }
    //console.log(check)
     for(let i = 0; i < castle_squares.length; i++){
      var status = true
      for(let j = 0; j < castle_squares[i].length; j++){
          var child = document.getElementById(castle_squares[i][j]).firstChild
          if(child){
            status = status && false
          }
      }
      var index = board.fen[10].indexOf(castle_details[castle_squares[i][castle_squares[i].length - 1]][0])
      if(index == -1){
        status = status && false
      }
      var available = castle_details[castle_squares[i][castle_squares[i].length - 1]][1] = status
      var castle_square = castle_squares[i][castle_squares[i].length - 1]
      if(((castle_square == "g1" && available && check["g1"] || castle_square == "c1" && available && check["c1"]) && king_square == "e1" && color == "white") || castle_square == king_square){
          castle.push(castle_square,4)
      }
      if(((castle_square == "g8" && available && check["g8"] || castle_square == "c8" && available && check["c8"]) && king_square == "e8" && color == "black") || castle_square == king_square){
          castle.push(castle_square,4)
      }
     }
     if(drop){
     var child = castle_details[king_square][3]
     var new_rook_square_id = castle_details[king_square][2]
     var new_rook_square = document.getElementById(new_rook_square_id)
     var child = document.getElementById(child).firstChild
     var index = board.find_index(board.all_pieces,child.id)
     var new_x = board.square_decode(new_rook_square_id).x
     var new_y = board.square_decode(new_rook_square_id).y
     board.all_pieces[index].square = new_rook_square_id 
     board.all_pieces[index].x = new_x
     board.all_pieces[index].y = new_y
     new_rook_square.appendChild(child)
     var change_king = castle_details[king_square][4]
     var change_queen = castle_details[king_square][5]
     board.fen[10] = board.fen[10].replace(change_king,"")
     board.fen[10] = board.fen[10].replace(change_queen,"")
     if(board.fen[10] == ""){
       board.fen[10] = "-"
     }
    }
       return castle
    }
    create_legal_moves(){
      var cors = [[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1]]
    for(let i = 0; i < cors.length; i++){
      var square = document.getElementById(board.create_cordinates(this.x + cors[i][0],this.y + cors[i][1]))
      if(square){
        var child = square.firstChild
           if(child){
           if(board.obstacles(child,this.color) == 1){
            continue
           }else if(board.obstacles(child,this.color) == 2){
            if(Object.keys(this.Incheck(square.id,square.id)).length == 0){
             this.legal_moves.push(square.id,2)
             continue
            }
          }
          }
          if(Object.keys(this.Incheck(square.id,square.id)).length == 0 && !this.CheckBackMove(square.id)){
          this.legal_moves.push(square.id)
          }
      }
    }
    this.legal_moves = this.remove_illegal_for_king(this.legal_moves)
    var all_moves = this.legal_moves
    this.legal_moves = []
    return all_moves
 }
 CheckBackMove(move){
    let color = board.fen[9] == "w" ? "black" : "white"
    let details = []
    let pieces = ["rook","bishop"]
    let kingFound = false
    let index = board.find_index(board.all_pieces,`king_${board.fen[9]}`)
    let kingSquare = board.all_pieces[index].square
      var square = document.getElementById(move)
      let myx = board.square_decode(square.id).x
      let myy = board.square_decode(square.id).y
      var piece = square.firstChild
      if(!piece){
        pieces.forEach(piece =>{
          let pieceSeperated = board.row_seperation(color,square.id)[piece]
          for(let i = 0; i < pieceSeperated.length; i++){
           if(pieceSeperated[i].includes(kingSquare)){
                  details.push(i,kingSquare,piece)
                  kingFound = true
                  break
           }
        }
        })
      }
      if(kingFound){
      color = color == "white" ? "black" : "white"
      console.log(color,details[1],details[2],details[0])
      let pieceSeperated  = board.row_seperation(color,details[1])[details[2]][details[0]]
      for(let i = 0; i < pieceSeperated.length; i++){
          if(pieceSeperated[i] != 2){
             let square = document.getElementById(pieceSeperated[i])
             var child = square.firstChild
             if(child){
             let idArr = Array.from(child.id)
             let index = idArr.indexOf("_")
             let type = idArr.slice(0,index).join("")
             if(type == details[2] || type == "queen"){
                return true
             }
             }
          }
      }
      }
      return false     
 }
 remove_illegal_for_king(moves){
  var cors = [[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1]]
  var color = board.fen[9] == "w" ? "b" : "w"
  var index = board.find_index(board.all_pieces,`king_${color}`)
 var king_square = board.all_pieces[index].square
var x = board.square_decode(king_square).x
var y = board.square_decode(king_square).y
  for(let i = 0; i < cors.length; i++){
    var square = document.getElementById(board.create_cordinates(x + cors[i][0],y + cors[i][1]))
    if(square){
       if(moves.indexOf(square.id) != -1){
        let index = moves.indexOf(square.id)
        if(moves[index + 1] == 2){
          moves.splice(index,2)
        }else{
          moves.splice(index,1)
        }
       }   
    }
  } 
  return moves  
 }
}
class Queen extends Pieces{
    constructor(name,color,square,x,y,pinned){
      super(name,color,square,x,y,pinned)
      this.type = "queen"
    }
    create_legal_moves(){
      var bishop_moves = new Bishop()
      var rook_moves = new Rook()
      this.legal_moves = bishop_moves.create_legal_moves.call(this).concat(rook_moves.create_legal_moves.call(this))
      var all_moves = this.legal_moves
      this.legal_moves = []
      return all_moves
   }
 }
class Pawn extends Pieces{
    constructor(name,color,square,x,y,pinned){
      super(name,color,square,x,y,pinned)
      this.type = "pawn"
    }
    en_passant(x,y,color,square){
      var enpassant_arr = []
      var remove_piece_square = null
      if(x >= 2){
        var enemy_1 = document.getElementById(board.create_cordinates(x - 1,y))
        if(enemy_1.firstChild){
          if(color !== enemy_1.firstChild.classList[1] && (board.create_cordinates(x - 1,y - 1) == board.fen[11] || board.create_cordinates(x - 1,y + 1) == board.fen[11])){
            enpassant_arr.push(board.fen[11],3)
           }
        }
      }
      if(x <= 7){
      var enemy_2 = document.getElementById(board.create_cordinates(x + 1,y))
      if(enemy_2.firstChild){
        if(color !== enemy_2.firstChild.classList[1] && (board.create_cordinates(x + 1,y - 1) == board.fen[11] || board.create_cordinates(x + 1,y + 1) == board.fen[11])){
         enpassant_arr.push(board.fen[11],3)
        }
      }
      }
      let corx = board.square_decode(board.fen[11]).x
      let cory = board.square_decode(board.fen[11]).y
      let pieceId = document.getElementById(board.create_cordinates(x,y)).firstChild.id
      if(color == "white"){
        remove_piece_square = board.create_cordinates(corx,cory - 1);
     }else{
       remove_piece_square = board.create_cordinates(corx,cory + 1);
     }
     if(remove_piece_square  && square == board.fen[11]&& !board.PinnedEnpassant(pieceId)){
      var deleting_square = document.getElementById(remove_piece_square)
      board.remove_enemy_piece(deleting_square.id)
     }
     if(board.PinnedEnpassant(pieceId)){
      let Squareindex = enpassant_arr.indexOf(board.fen[11])
      enpassant_arr.splice(Squareindex,1)
      let numindex = enpassant_arr.indexOf(3)
      enpassant_arr.splice(numindex,1)
     }
      return enpassant_arr
    }
    diagonal_captures(){
       if(this.color == "white"){
        if(this.y !== 8){
        let square_1 = document.getElementById(board.create_cordinates(this.x + 1,this.y + 1))
        let square_2 = document.getElementById(board.create_cordinates(this.x - 1,this.y + 1))
        if(this.x == 1 && board.obstacles(square_1.firstChild,this.color) == 2){
          this.legal_moves.push(square_1.id,2)
        }else if(this.x == 8 && board.obstacles(square_2.firstChild,this.color) == 2){
          this.legal_moves.push(square_2.id,2)
        }else{
          if(this.x !== 8 &&  board.obstacles(square_1.firstChild,this.color) == 2){
            this.legal_moves.push(square_1.id,2)
          }
          if( this.x !== 1 && board.obstacles(square_2.firstChild,this.color) == 2){
            this.legal_moves.push(square_2.id,2)
          } 
        }
      }
       }else{
        if(this.y !== 1){
        let square_1 = document.getElementById(board.create_cordinates(this.x + 1,this.y - 1))
        let square_2 = document.getElementById(board.create_cordinates(this.x - 1,this.y - 1))
        if(this.x == 1 && board.obstacles(square_1.firstChild,this.color) == 2){
          this.legal_moves.push(square_1.id,2)
        }else if(this.x == 8 && board.obstacles(square_2.firstChild,this.color) == 2){
          this.legal_moves.push(square_2.id,2)
        }else{
          if(this.x !== 8 &&  board.obstacles(square_1.firstChild,this.color) == 2){
            this.legal_moves.push(square_1.id,2)
          }
          if(this.x !== 1 && board.obstacles(square_2.firstChild,this.color) == 2){
            this.legal_moves.push(square_2.id,2)
          } 
        }
       }
      }
       return this.legal_moves
    }
    move_forward(){
      if(this.color == "white"){
      for(let i = this.y + 1; i <= this.y + 2; i++){
        if((this.y !== 2 && i == this.y + 2 || this.y == 8)){
          break
        }
        var square = document.getElementById(board.create_cordinates(this.x,i)).firstChild
        if(board.obstacles(square,this.color)){
          break
        }
        this.legal_moves.push(board.create_cordinates(this.x,i))
     }
    }else{
      for(let i = this.y - 1; i >= this.y - 2; i--){
        if(this.y !== 7 && i == this.y - 2 || this.y == 1){
          break
        }
        var square = document.getElementById(board.create_cordinates(this.x,i)).firstChild
        if(board.obstacles(square,this.color)){
             break
        }
        this.legal_moves.push(board.create_cordinates(this.x,i))
     }
    }
     return this.legal_moves
    }
    create_legal_moves(){
      var forward_moves = this.move_forward()
      var diagonal_moves  = this.diagonal_captures()
      var all_moves = this.legal_moves
      this.legal_moves = []
      return all_moves
 }
}


//Player 1
var player_1 = new Player("Andreas","black")
//Player 2
var player_2 = new Player("Nick","white")
//Chess board
var board = new Board()
//All squares
var squares = board.create_squares()
//All pieces
board.create_pieces()
//Add the listener to all pieces
board.move(squares)
//Start timer
board.start_timer(600,600)
//Make movable the resultpopup
board.makepopup_movable()












