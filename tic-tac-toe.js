// Gameboard object
// IIFE as only one board is needed
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
// IIFE as only one game is needed
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
        console.log(`It's ${getActivePlayer().name}'s turn.`);
    };

    const printCurrentState = () => {
        board.printBoard();
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

        if (game.checkTie()) {
            console.log("It's a tie!");
            game.printCurrentState();
            return;
        };

        game.switchPlayerTurn();
        game.printCurrentState();
    };

    // There are eight potential winning combinations: each row, each column, and two diagonals
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

    // Check for empty spots. If none, it's a tie
    const checkTie = () => {   
        for (r = 0; r < board.getRows(); r++) {
            const row = board.getBoard()[r];

            for (c = 0; c < board.getColumns(); c++) {
                const cell = row[c].getValue();

                if (cell == "E") {
                    return false;
                };
            };
        };

        return true;
    };
    
    return { getActivePlayer, switchPlayerTurn, printCurrentState, playRound, checkWinner, checkTie };
})();

// ScreenController object
//     - interacts with a GameController object (game)
//     - interacts with the DOM
//     - updateScreen()
//         - clears the screen
//         - gets the state of the board
//         - draws the board
//         - cells are buttons
//     - start()
//         - calls updateScreen() to draw the initial board
//         - starts event listener
//     - reset()
//         - do I need this if I have start()?

// ScreenController object
// IIFE as only one screen in needed
const screen = (function ScreenController() {
    const gridContainer = document.querySelector(".grid-container");
    
    function updateScreen() {
        // Clears the board
        gridContainer.textContent = "";

        // Creates a button for each cell, adds a data-attribute (rowcol), appends the buttons to gridContainer
        for (r = 0; r < board.getRows(); r++) {
            for (c = 0; c < board.getColumns(); c++) {
                const button = document.createElement("button");
                button.dataset.rowcol = `${r}${c}`;
                button.textContent = board.getBoard()[r][c].getValue();
                gridContainer.appendChild(button);
            };
        };
    };

    // Gets the row and column from the clicked button, plays round, updates screen
    function clickHandler(e) {
        const row = e.target.dataset.rowcol[0];
        const col = e.target.dataset.rowcol[1];
        game.playRound(row, col);
        updateScreen();
    };

    // Kicks off the initial screen draw, starts event listener
    const start = () => {
        updateScreen();
        gridContainer.addEventListener("click", clickHandler);
    };

    return { start };
})();

game.printCurrentState();
screen.start();