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

    const moves = game.moves({ verbose: true });

    if (moves.length === 0) return;

    const move =
    moves[Math.floor(Math.random() * moves.length)];

    game.move(move);

    board.position(game.fen());

    document.getElementById("turnDisplay").innerText =
    "Turn: " +
    (game.turn() === "w" ? "White" : "Black");

    document.getElementById("moveHistory").innerText =
    "Moves: " + game.history().join(" ");
}