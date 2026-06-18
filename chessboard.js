let whiteSeconds = 600;
let blackSeconds = 600;

let capturedByWhite = [];
let capturedByBlack = [];
const stockfish = new Worker("./stockfish-18.js");
stockfish.onerror = function(err){
    console.log("WORKER ERROR:", err.message);
    console.log("FILENAME:", err.filename);
    console.log("LINENO:", err.lineno);
};
console.log("Worker created");
stockfish.postMessage("uci");

stockfish.postMessage("isready");

stockfish.onmessage = function(e){
console.log("ENGINE:", e.data);
    const line = e.data;

    if(!line.startsWith("bestmove")) return;

    const move = line.split(" ")[1];

    if(move === "(none)") return;

    const aiMove = game.move({
        from: move.substring(0,2),
        to: move.substring(2,4),
        promotion: "q"
    });

    if(!aiMove) return;

    updateCapturedPieces(aiMove);

    board.position(game.fen());

    document.getElementById("turnDisplay").innerText =
    "Turn: " +
    (game.turn()==="w" ? "White" : "Black");

    document.getElementById("moveHistory").innerText =
    "Moves: " + game.history().join(" ");
};

stockfish.postMessage("uci");

console.log("Before Chess:", typeof Chess);
var game = new Chess();
console.log("After Chess");


let playerSide = "white";

function makeAIMove(){

    console.log("AI TURN STARTED");
    console.log("FEN:", game.fen());

    stockfish.postMessage(
        "position fen " + game.fen()
    );

    stockfish.postMessage("go depth 10");
}
function updateCapturedPieces(move){

if(!move.captured) return;

const pieceMap = {
    p:"♟",
    r:"♜",
    n:"♞",
    b:"♝",
    q:"♛",
    k:"♚"
};

if(move.color === "w"){
    capturedByWhite.push(pieceMap[move.captured]);
}else{
    capturedByBlack.push(pieceMap[move.captured]);
}

const cw = document.getElementById("capturedByWhite");
const cb = document.getElementById("capturedByBlack");

if(cw){
    cw.innerHTML =
    capturedByWhite.map(p => `<span>${p}</span>`).join("");
}

if(cb){
    cb.innerHTML =
    capturedByBlack.map(p => `<span>${p}</span>`).join("");
}

}

setInterval(function(){

if(game.game_over()) return;

if(game.turn() === "w"){
    whiteSeconds--;
}else{
    blackSeconds--;
}

document.getElementById("whiteTime").innerText =
    Math.floor(whiteSeconds/60) + ":" +
    String(whiteSeconds%60).padStart(2,"0");

document.getElementById("blackTime").innerText =
    Math.floor(blackSeconds/60) + ":" +
    String(blackSeconds%60).padStart(2,"0");

},1000);

const board = Chessboard("board",{
draggable:true,
position:"start",

pieceTheme:
"https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png",

onDragStart:function(source,piece){

    if(game.game_over()) return false;

    if(
        (game.turn()==="w" && piece.search(/^b/)!==-1) ||
        (game.turn()==="b" && piece.search(/^w/)!==-1)
    ){
        return false;
    }
},

onDrop:function(source,target){

    const move = game.move({
        from:source,
        to:target,
        promotion:"q"
    });

if(move===null) return "snapback";

setTimeout(makeAIMove,300);

updateCapturedPieces(move);
  

    $("#board .square-55d63").removeClass("highlight");

    $("#board .square-"+source).addClass("highlight");
    $("#board .square-"+target).addClass("highlight");

    document.getElementById("turnDisplay").innerText =
        "Turn: " +
        (game.turn()==="w" ? "White" : "Black");

    document.getElementById("moveHistory").innerText =
        "Moves: " + game.history().join(" ");

    if(game.in_checkmate()){
        document.getElementById("gameOver").style.display = "flex";
    }
},

onSnapEnd:function(){
    board.position(game.fen());
}

});

function newGame(){

game.reset();

board.position("start");

whiteSeconds = 600;
blackSeconds = 600;

capturedByWhite = [];
capturedByBlack = [];

const cw = document.getElementById("capturedByWhite");
const cb = document.getElementById("capturedByBlack");

if(cw) cw.innerHTML = "";
if(cb) cb.innerHTML = "";

document.getElementById("whiteTime").innerText = "10:00";
document.getElementById("blackTime").innerText = "10:00";

document.getElementById("turnDisplay").innerText =
    "Turn: White";

document.getElementById("moveHistory").innerText =
    "Moves: -";

document.getElementById("gameOver").style.display =
    "none";

$("#board .square-55d63").removeClass("highlight");

}

function undoMove(){

game.undo();

board.position(game.fen());

document.getElementById("turnDisplay").innerText =
    "Turn: " +
    (game.turn()==="w" ? "White" : "Black");

document.getElementById("moveHistory").innerText =
    "Moves: " + game.history().join(" ");

$("#board .square-55d63").removeClass("highlight");

}