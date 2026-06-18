let whiteSeconds = 600;
let blackSeconds = 600;

let capturedByWhite = [];
let capturedByBlack = [];


var game = new Chess();

const board = Chessboard("board", {
    draggable: true,
    position: "start",

    pieceTheme:
    "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png",

    onDragStart: function(source, piece) {

        if (game.game_over()) return false;

        if (
            (game.turn() === "w" && piece.search(/^b/) !== -1) ||
            (game.turn() === "b" && piece.search(/^w/) !== -1)
        ) {
            return false;
        }
    },

    onDrop: function(source, target) {

        const move = game.move({
            from: source,
            to: target,
            promotion: "q"
        });

        if (move === null) return "snapback";
setTimeout(makeAIMove, 500);

        updateCapturedPieces(move);

        document.getElementById("turnDisplay").innerText =
            "Turn: " +
            (game.turn() === "w" ? "White" : "Black");

        document.getElementById("moveHistory").innerText =
            "Moves: " + game.history().join(" ");

        if (game.in_checkmate()) {
            document.getElementById("gameOver").style.display = "flex";
        }
    },

    onSnapEnd: function() {
        board.position(game.fen());
    }
});

function updateCapturedPieces(move) {

    if (!move.captured) return;

    const pieceMap = {
        p: "♟",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚"
    };

    if (move.color === "w") {
        capturedByWhite.push(pieceMap[move.captured]);
    } else {
        capturedByBlack.push(pieceMap[move.captured]);
    }

    const cw = document.getElementById("capturedByWhite");
    const cb = document.getElementById("capturedByBlack");

    cw.innerHTML = capturedByWhite.join(" ");
    cb.innerHTML = capturedByBlack.join(" ");
}

setInterval(function() {

    if (game.game_over()) return;

    if (game.turn() === "w") {
        whiteSeconds--;
    } else {
        blackSeconds--;
    }

    document.getElementById("whiteTime").innerText =
        Math.floor(whiteSeconds / 60) + ":" +
        String(whiteSeconds % 60).padStart(2, "0");

    document.getElementById("blackTime").innerText =
        Math.floor(blackSeconds / 60) + ":" +
        String(blackSeconds % 60).padStart(2, "0");

}, 1000);

function newGame() {

    game.reset();

    board.position("start");

    whiteSeconds = 600;
    blackSeconds = 600;

    capturedByWhite = [];
    capturedByBlack = [];

    document.getElementById("capturedByWhite").innerHTML = "";
    document.getElementById("capturedByBlack").innerHTML = "";

    document.getElementById("whiteTime").innerText = "10:00";
    document.getElementById("blackTime").innerText = "10:00";

    document.getElementById("turnDisplay").innerText =
        "Turn: White";

    document.getElementById("moveHistory").innerText =
        "Moves: -";

    document.getElementById("gameOver").style.display = "none";
}

function undoMove() {

    game.undo();

    board.position(game.fen());

    document.getElementById("turnDisplay").innerText =
        "Turn: " +
        (game.turn() === "w" ? "White" : "Black");

    document.getElementById("moveHistory").innerText =
        "Moves: " + game.history().join(" ");
}
function undoMove() {

    game.undo();

    board.position(game.fen());

    document.getElementById("turnDisplay").innerText =
        "Turn: " +
        (game.turn() === "w" ? "White" : "Black");

    document.getElementById("moveHistory").innerText =
        "Moves: " + game.history().join(" ");
}

function makeAIMove() {
const difficulty =
document.getElementById("difficulty").value;
    const moves = game.moves({ verbose: true });

    if (moves.length === 0) return;

    let bestMove = null;
    let bestScore = -9999;

    const pieceValue = {
        p: 100,
        n: 320,
        b: 330,
        r: 500,
        q: 900,
        k: 20000
    };

    for (let move of moves) {

        let score = 0;
if(difficulty === "easy"){
    score += Math.random() * 200;
}

if(difficulty === "medium"){
    score += Math.random() * 100;
}

if(difficulty === "hard"){
    score += Math.random() * 0;
}
        if (move.captured) {
            score += pieceValue[move.captured];
        }

        if (move.flags.includes("k")) score += 50;
        if (move.flags.includes("q")) score += 50;

        if (
            move.to === "d4" ||
            move.to === "e4" ||
            move.to === "d5" ||
            move.to === "e5"
        ) {
            score += 30;
        }

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    game.move(bestMove);

    board.position(game.fen());

    document.getElementById("turnDisplay").innerText =
        "Turn: " +
        (game.turn() === "w" ? "White" : "Black");

    document.getElementById("moveHistory").innerText =
        "Moves: " + game.history().join(" ");
}