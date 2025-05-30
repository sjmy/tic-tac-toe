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

        // We have a winner!
        // Display the victor, print the board, end input
        // Still need to implement a game reset
        if (game.checkWinner()) {
            console.log(`${game.getActivePlayer().name} wins!`);
            game.printCurrentState();
            return;
        };
        game.switchPlayerTurn();
        game.printCurrentState();
    };

    // There are eight potential winning combinations:
    // Each row, each column, and two diagonals
    // Checks for each of those winners at the appropriate points
    const checkWinner = () => {
        for (r = 0; r < board.getRows(); r++) {
            const row = board.getBoard()[r];
            let rowWin = "";

            // Check for row winners
            for (c = 0; c < board.getColumns(); c++) {
                let colWin = "";
                rowWin += row[c].getValue();

                // If we're in the first row, pause to check for column winners
                if (r == 0) {
                    let diagWin = "";
                    colWin += row[c].getValue();

                    for (n = 1; n < board.getRows(); n++) {
                        const rowTemp = board.getBoard()[n];
                        colWin += rowTemp[c].getValue();
                    };

                    // If we're also in the first or third column, pause to check for a diagonal winner
                    if (c == 0) {
                        diagWin += row[c].getValue();

                        for (colTemp = 1; colTemp < board.getRows(); colTemp++) {
                            const rowTemp = board.getBoard()[colTemp];
                            diagWin += rowTemp[colTemp].getValue();
                        };
                    } else if (c == board.getColumns() - 1) {
                        diagWin += row[c].getValue();

                        // One of the diagonal checks has to have the row and column incrementing opposite each other
                        // Using n to increment the rows while colTemp decrements the columns
                        let n = 0;
                        for (colTemp = board.getColumns() - 2; colTemp >= 0; colTemp--) {
                            n++;
                            const rowTemp = board.getBoard()[n];
                            diagWin += rowTemp[colTemp].getValue();
                        };
                    };

                    if (colWin == "XXX" || colWin == "OOO" || diagWin == "XXX" || diagWin == "OOO") {
                        return true;
                    };
                };
            };

            if (rowWin == "XXX" || rowWin == "OOO") {
                return true;
            };
        };
    };

    return { getActivePlayer, switchPlayerTurn, printCurrentState, playRound, checkWinner };
})();

game.printCurrentState();