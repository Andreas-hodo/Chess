class Player{
    constructor(name,team){
         this.name = name
         this.team = team
         this.captured = []
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
         this.full_moves = 0
         this.half_moves = 0
         
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
  this.all_pieces.push(new King(`king_w`,"white",this.create_cordinates(4,1),5,1))
    this.all_pieces.push(new King(`king_b`,"black",this.create_cordinates(4,8),5,8))
  //Queens 
  this.all_pieces.push(new Queen(`queen_w`,"white",this.create_cordinates(5,1),4,1))
  this.all_pieces.push(new Queen(`queen_b`,"black",this.create_cordinates(5,8),4,8))
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
      var moves_index = board.find_index(board.all_pieces,data)
      var moves = board.all_pieces[moves_index].create_legal_moves()
      var square_index = board.find_index(board.all_squares,id)
      var square_color = board.all_squares[square_index].color
      var cor_y = board.all_pieces[moves_index].y
      var cor_x = board.all_pieces[moves_index].x
      var piece_color = board.all_pieces[moves_index].color
      var piece_type = board.all_pieces[moves_index].type
      if(piece_type == "pawn"){
        var pawn = new Pawn() 
        var enpassant = pawn.en_passant(cor_x,cor_y,piece_color,parent_elem1)
        moves = moves.concat(enpassant)
       }
      if(moves.indexOf(id) !== -1){
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
       promotion_window.style.display = "block"
       var promote = this.pawn_promote(id,promotion_window,piece_color,cor_x,cor_y)
       pieces.forEach(piece =>{
       var event = document.getElementById(piece).addEventListener("click",promote)
       })
      }
      this.change_turn()
      var new_cordinates = this.change_piece_details(data,id)
      this.change_fen(cor_y,square_index,piece_type,piece_color,cor_x,data)
      }
      this.remove_square_color()
    }
    change_fen_row(y,piece_type,cordinates){
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
          if(counter !== 0){
          change += counter
        }
        if(color == "white"){
          if(elem[1] == "n" && piece_type == "knight"){
          var id_1 = elem[1].toUpperCase()
          }else{
            var id_1 =  piece_id[0].toUpperCase() 
          }
          change += id_1
      }else{
        if(elem[1] == "n" && piece_type == "knight"){
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
    change_fen(old_y,index,piece_type,piece_color,x,id){
      var cordinates = [[8,1],[7,2],[6,3],[5,4],[4,5],[3,6],[2,7],[1,8]]
      var castle_cordinates = {
       "rook_1w":["Q"],
        "rook_2w":["K"],
        "rook_1b":["q"],
        "rook_2b":["k"],
        "king_b":["kq"],
        "king_w":["KQ"]
      }
      var new_y = board.all_squares[index].y
        //Change turn
        this.fen[9] = board.turn[0].toLowerCase()
        //Change castle status
       if(piece_type == "rook" || piece_type == "king"){
        var castle = castle_cordinates[id]
        castle.forEach(piece =>{
          board.fen[10] = board.fen[10].replace(piece,"")
          if(board.fen[10] == ""){
            board.fen[10] = "-"
          }
        })
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
        var old_fen = this.change_fen_row(old_y,piece_type,cordinates)
        //Change new row 
        var new_fen = this.change_fen_row(new_y,piece_type,cordinates)
        console.log(new_fen)
    }
    pawn_promote(square_id,promotion_window,piece_color){
     return function(e){
      promotion_window.style.display = "none"
      var index = board.find_index(board.all_squares,square_id)
      var new_x = board.square_decode(board.all_squares[index].name).x
      var new_y = board.square_decode(board.all_squares[index].name).y
      board.remove_enemy_piece(board.all_squares[index].name)
      var square = document.getElementById(square_id)
      var id_color = Array.from(piece_color)[0]
      var counter = 3
      var piece_id = e.target.id
        board.create_new_promote_piece(piece_id,piece_color,counter,square,id_color)
        board.create_promote_object(piece_id,piece_color,counter,square_id,new_x,new_y,id_color)
        counter++
     } 
  }
  create_new_promote_piece(piece_id,color,counter,square,id_color){
var images = [
  ["rook","white","white-rook.jpg"],
  ["knight","white","white-knight.jpg"],
  ["bishop","white","white-bishop.jpg"],
  ["queen","white","white-queen.jpg"], 
  ["rook","black","chess-36314_1280.png"],
  ["knight","black", "knight-147065_1280.png"],
  ["bishop","black","bishop-147064_1280.png"],
  ["queen","black","queen-147062_1280.png"] 
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
      var captured_piece = board.all_pieces.splice(index,1)
      square.removeChild(square.firstElementChild)
      //Update half moves
      this.half_moves = -1
      if(board.all_pieces[index].color == "white"){
        player_2.captured.push(captured_piece)
      }else{
        player_1.captured.push(captured_piece)
      }
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
        
      if(arr[i] == 2){
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
      }
      var index = this.find_index(this.all_squares,arr[i])
      var square = document.getElementById(arr[i])
       this.all_squares[index].color = square_color
        square.style.backgroundColor = square_color
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
          if(piece_type == "pawn"){
            var pawn = new Pawn() 
            var enpassant = pawn.en_passant(x,y,piece_color,null)
            moves = moves.concat(enpassant)
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
      this.moved = false
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
      var all_moves = this.legal_moves
      this.legal_moves = []
      return all_moves
 }
}
class King extends Pieces{
    constructor(name,color,square,x,y){
      super(name,color,square,x,y)
      this.type = "king"
      this.moved = false
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
    
      if(square == board.fen[11] && enemy_1.firstChild){
        board.remove_enemy_piece(enemy_1.id)
      }else if(square == board.fen[11] && enemy_2.firstChild){
        board.remove_enemy_piece(enemy_2.id)
      }
      return enpassant_arr
    }
    diagonal_captures(){
       if(this.color == "white"){
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
       }else{
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
       return this.legal_moves
    }
    move_forward(){
      if(this.color == "white"){
      for(let i = this.y + 1; i <= this.y + 2; i++){
        var square = document.getElementById(board.create_cordinates(this.x,i)).firstChild
        if((this.y !== 2 && i == this.y + 2) || board.obstacles(square,this.color)){
             break
        }
        this.legal_moves.push(board.create_cordinates(this.x,i))
     }
    }else{
      for(let i = this.y - 1; i >= this.y - 2; i--){
        var square = document.getElementById(board.create_cordinates(this.x,i)).firstChild
        if((this.y !== 7 && i == this.y - 2) || board.obstacles(square,this.color)){
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












