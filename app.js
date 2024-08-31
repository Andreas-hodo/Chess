class Player{
    constructor(name,team){
         this.name = name
         this.team = team
         this.captured = []
    }

}
class Board{
    constructor(){
         this.fen = ["rnbkqbnr","pppppppp","8","8","8","8","PPPPPPPP","RNBKQBNR"]
         this.all_squares = []
         this.all_pieces = []
         this.cordinates_x = [0,"a","b","c","d","e","f","g","h"]
         this.cordinates_y = [0,1,2,3,4,5,6,7,8]
         this.turn = "White's Turn"
         
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
  this.all_pieces.push(new King(`king_w`,"white",this.create_cordinates(4,1),4,1))
    this.all_pieces.push(new King(`king_b`,"black",this.create_cordinates(4,8),4,8))
  //Queens 
  this.all_pieces.push(new Queen(`queen_w`,"white",this.create_cordinates(5,1),5,1))
  this.all_pieces.push(new Queen(`queen_b`,"black",this.create_cordinates(5,8),5,8))
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
      e.target.appendChild(document.getElementById(data));
      this.change_turn()
      this.change_piece_details(data,e.target.id)
      this.remove_square_color()
    }
    change_piece_details(piece,square_id){
        var index = this.find_index(this.all_pieces,piece)
        this.all_pieces[index].square = square_id
        this.all_pieces[index].x = this.square_decode(square_id).x
        this.all_pieces[index].y = this.square_decode(square_id).y 

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
          board.apply_square_color(moves,"rgb(30,94,0)")
        }
       })
      }

}
class Rook extends Pieces{
    constructor(name,color,square,x,y,pinned){
      super(name,color,square,x,y,pinned)
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
    }
    diagonal_captures(){
       if(this.color == "white"){
        let square_1 = document.getElementById(board.create_cordinates(this.x + 1,this.y + 1))
        let square_2 = document.getElementById(board.create_cordinates(this.x - 1,this.y + 1))
        if(this.x == 1 && board.obstacles(square_1.firstChild,this.color)){
          this.legal_moves.push(square_1.id,2)
        }else if(this.x == 8 && board.obstacles(square_2.firstChild,this.color)){
          this.legal_moves.push(square_2.id,2)
        }else{
          if(this.x !== 8 &&  board.obstacles(square_1.firstChild,this.color)){
            this.legal_moves.push(square_1.id,2)
          }
          if( this.x !== 1 && board.obstacles(square_2.firstChild,this.color)){
            this.legal_moves.push(square_2.id,2)
          } 
        }
       }else{
        let square_1 = document.getElementById(board.create_cordinates(this.x + 1,this.y - 1))
        let square_2 = document.getElementById(board.create_cordinates(this.x - 1,this.y - 1))
        if(this.x == 1 && board.obstacles(square_1.firstChild,this.color)){
          this.legal_moves.push(square_1.id,2)
        }else if(this.x == 8 && board.obstacles(square_2.firstChild,this.color)){
          this.legal_moves.push(square_2.id,2)
        }else{
          if(this.x !== 8 &&  board.obstacles(square_1.firstChild,this.color)){
            this.legal_moves.push(square_1.id,2)
          }
          if( this.x !== 1 && board.obstacles(square_2.firstChild,this.color)){
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
      console.log(forward_moves,diagonal_moves)
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













