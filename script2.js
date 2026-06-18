const board = document.getElementById("board");

const game = new Chess();
let selectedSquare = null;
function drawBoard() {

  board.innerHTML = "";

  const position = game.board();

  for(let row=0; row<8; row++) {

    for(let col=0; col<8; col++) {

      const square = document.createElement("div");

      square.className =
      "square " + (((row+col)%2===0) ? "white" : "black");

      const piece = position[row][col];

      if(piece){

        let symbol = "";

        if(piece.type==="p") symbol = piece.color==="w"?"♙":"♟";
        if(piece.type==="r") symbol = piece.color==="w"?"♖":"♜";
        if(piece.type==="n") symbol = piece.color==="w"?"♘":"♞";
        if(piece.type==="b") symbol = piece.color==="w"?"♗":"♝";
        if(piece.type==="q") symbol = piece.color==="w"?"♕":"♛";
        if(piece.type==="k") symbol = piece.color==="w"?"♔":"♚";

        square.textContent = symbol;
      }
const file = "abcdefgh"[col];
const rank = 8 - row;
const squareName = file + rank;

square.onclick = () => {

  if(selectedSquare === null){

    selectedSquare = squareName;

  } else {

    const move = game.move({
      from: selectedSquare,
      to: squareName,
      promotion: "q"
    });

    selectedSquare = null;

  drawBoard();

  }

};
      board.appendChild(square);

    }
  }

  document.getElementById("turnDisplay").innerText =
  "Turn: " + (game.turn()==="w" ? "White" : "Black");
}

function newGame(){
  game.reset();
  drawBoard();
}

drawBoard();