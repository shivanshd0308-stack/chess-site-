const game = new Chess();
console.log(game.fen());
const board = document.getElementById("board");

let pieces = [
["♜","♞","♝","♛","♚","♝","♞","♜"],
["♟","♟","♟","♟","♟","♟","♟","♟"],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["","","","","","","",""],
["♙","♙","♙","♙","♙","♙","♙","♙"],
["♖","♘","♗","♕","♔","♗","♘","♖"]
];

let selected = null;
let turn = "white";

function drawBoard(){

  document.getElementById("turnDisplay").textContent =
  "Turn: " + turn.charAt(0).toUpperCase() + turn.slice(1);

  board.innerHTML="";

  for(let row=0; row<8; row++){
    for(let col=0; col<8; col++){

      let square = document.createElement("div");

      square.className =
      "square " + (((row+col)%2===0) ? "white" : "black");

      square.textContent = pieces[row][col];

      square.onclick = ()=>{

        if(selected === null){

          if(pieces[row][col] !== ""){

            const piece = pieces[row][col];

            const isWhite =
            "♙♖♘♗♕♔".includes(piece);

            const isBlack =
            "♟♜♞♝♛♚".includes(piece);

            if(
              (turn==="white" && isWhite) ||
              (turn==="black" && isBlack)
            ){
              selected = {row,col};
            }
          }

        }else{

          pieces[row][col] =
          pieces[selected.row][selected.col];

          pieces[selected.row][selected.col] = "";

          turn = (turn==="white")
          ? "black"
          : "white";

          selected = null;

          drawBoard();
        }
      };

      board.appendChild(square);
    }
  }
}

function newGame(){

  pieces = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
  ];

  turn = "white";
  selected = null;

  drawBoard();
}

drawBoard();