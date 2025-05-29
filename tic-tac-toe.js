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

    // Return rows and columns. Used in GameController() to check for a winner
    const getRows = () => rows;

    const getColumns = () => columns;

    // Get the cell values, put them in an array, display in the console
    const printBoard = () => {
        const readableBoard = board.map((row) => row.map((cell) => cell.getValue()));
        console.table(readableBoard);
    };

    // Place the current player's marker if the cell is empty
    // Called by GameController in the playRound function
    const placeMarker = (marker, cell) => {
        if (cell.getValue() == "E") {
            cell.changeMarker(marker);
            return true;
        } else {
            console.log("That cell is taken!");
            return false;
        };
    };

    return { getBoard, placeMarker, printBoard, getRows, getColumns };
})();

// Cell object
function Cell() {
    // "E" for empty. Didn't want to use 0 due to confusion with O
    let value = "E";

    const changeMarker = (playerMarker) => {
        value = playerMarker;
    };

    const getValue = () => value;

    return { changeMarker, getValue };
};

// GameController object
//     - controls flow and state of the game's turns
//     - checks if there is a winner

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
        console.log(`It's ${getActivePlayer().name}'s turn.`);
    };

    // Takes the row and column from the cell the player clicked on, finds the cell, attempts to place the marker
    const playRound = (row, column) => {
        const cell = board.getBoard()[row][column];

        // If the cell has been chosen already, exit
        if (!board.placeMarker(getActivePlayer().marker, cell)) {
            game.printCurrentState();
            return;
        };

        game.checkWinner();
        game.switchPlayerTurn();
        game.printCurrentState();
    };

    const checkWinner = () => {
        for (r = 0; r < board.getRows(); r++) {
            for (c = 0; c < board.getColumns(); c++) {
                const cell = board.getBoard()[r][c];
                console.log(cell.getValue());
                
                // Need to call continue if a match isn't found, break completely if no more possible matches or a winner
                // if (cell.getValue() == "X" && board.getBoard()[r][c + 1].getValue() == "X" && board.getBoard()[r][c + 2].getValue() == "X") {
                //     console.log("Player X wins!");
                // };
            };
        };
    };

    return { getActivePlayer, switchPlayerTurn, printCurrentState, playRound, checkWinner };
})();

game.printCurrentState();