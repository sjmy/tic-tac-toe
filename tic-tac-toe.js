// Gameboard object
// IIME as only one board is needed.
const board = (function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // Create the board
    for (r = 0; r < rows; r++) {
        board[r] = [];

        for (c = 0; c < columns; c++) {
            board[r].push(Cell());
        };
    };

    // Return current board
    const getBoard = () => board;

    // Get the cell values, put them in an array, display in the console
    const printBoard = () => {
        const readableBoard = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(readableBoard);
    };

    // Drop the current player's marker if the cell is empty
    // called by GameController in the playRound function
    const dropMarker = (marker, cell) => {
        if (cell.getValue() == "E") {
            cell.addMarker(marker);
        } else {
            console.log("That cell is taken!");
        };
    };

    return { getBoard, dropMarker, printBoard };
})();

// Cell object
function Cell() {
    // "E" for empty. Didn't want to use 0 due to confusion with O
    let value = "E";

    const addMarker = (playerMarker) => {
        value = playerMarker;
    };

    const getValue = () => value;

    return { addMarker, getValue };
};

// GameController object
//     - controls flow and state of the game's turns
//     - checks if there is a winner

//     - playRound = (cellValue) {
//         - board.dropMarker(gameController.getActivePlayer().marker, cellValue)
//     };

// GameController object
// IIME as only one game is needed.
const game = (function GameController(
    playerXName = "Player X",
    playerOName = "Player O"
) {
    // Create player objects in an array
    const players = [{name: playerXName, marker: "X"}, {name: playerOName, marker: "O"}];

    // X goes first by default
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const printCurrentState = () => {
        board.printBoard();
        console.log(`It's ${activePlayer.name}'s turn.`)
    };

    return { getActivePlayer, switchPlayerTurn, printCurrentState };
})();

game.printCurrentState();