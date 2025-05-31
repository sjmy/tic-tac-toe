// Gameboard object
// IIFE as only one board is needed
const board = (function Gameboard() {
    const board = [];
    const rows = 3;
    const columns = 3;

    // Create the board
    const resetBoard = () => {
        for (r = 0; r < rows; r++) {
            board[r] = [];

            for (c = 0; c < columns; c++) {
                board[r].push(Cell());
            };
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
            return false;
        };
    };

    return { getBoard, resetBoard, placeMarker, printBoard, getRows, getColumns };
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
const game = (function GameController() {
    const infoContainer = document.querySelector(".info");

    // Create player objects in an array
    const players = [{name: "", marker: "X"}, {name: "", marker: "O"}];

    // X goes first by default
    let activePlayer = players[0];

    // Set the player names from the text input buttons
    const setPlayerNames = (playerX, playerO) => {
        if (playerX == "") {
            playerX = "Player X"
        };

        if (playerO == "") {
            playerO = "Player O"
        };

        players[0].name = playerX;
        players[1].name = playerO;
    };

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        infoContainer.textContent = `${getActivePlayer().name}'s turn`;
    };

    // Used this for console debugging
    const printCurrentState = () => {
        board.printBoard();
    };

    // Takes the row and column from the cell the player clicked on, finds the cell, attempts to place the marker
    const playRound = (row, column) => {
        const cell = board.getBoard()[row][column];

        // If the cell has been chosen already, exit
        if (!board.placeMarker(getActivePlayer().marker, cell)) {
            infoContainer.textContent = "That cell is taken!";
            return;
        };

        // We have a winner!
        // Display the victor, print the board, end input
        if (game.checkWinner()) {
            infoContainer.textContent = `${game.getActivePlayer().name} wins!`;
            screen.removeEventListener();
            screen.reset();
            return;
        };

        if (game.checkTie()) {
            infoContainer.textContent = "It's a tie!";
            screen.removeEventListener();
            screen.reset();
            return;
        };

        game.switchPlayerTurn();
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
    
    return { setPlayerNames, getActivePlayer, switchPlayerTurn, printCurrentState, playRound, checkWinner, checkTie };
})();

// ScreenController object
// IIFE as only one screen in needed
const screen = (function ScreenController() {
    const gridContainer = document.querySelector(".grid-container");
    const infoContainer = document.querySelector(".info");
    const actionButton = document.createElement("button");
    const playerX = document.getElementById("player-x");
    const playerO = document.getElementById("player-o");
    
    function updateScreen() {
        // Clears the board
        gridContainer.textContent = "";

        // Creates a button for each cell, adds a data-attribute (rowcol), appends the buttons to gridContainer
        for (r = 0; r < board.getRows(); r++) {
            for (c = 0; c < board.getColumns(); c++) {
                const button = document.createElement("button");
                button.setAttribute("class", "cell");
                button.dataset.rowcol = `${r}${c}`;
                button.textContent = board.getBoard()[r][c].getValue();
                gridContainer.appendChild(button);

                if (button.textContent == "E") {
                    button.style.fontSize = 0;
                };
            };
        };
    };

    // Gets the row and column from the clicked button, plays round, updates screen
    const clickHandler = (e) => {
        const row = e.target.dataset.rowcol[0];
        const col = e.target.dataset.rowcol[1];
        game.playRound(row, col);
        updateScreen();
    };

    // Initialize the game
    const initial = () => {
        // Prep the play button, start the button event listener
        actionButton.setAttribute("class", "actionButton");
        actionButton.textContent = "Play!";
        actionButton.addEventListener("click", start);
        infoContainer.appendChild(actionButton);

        board.resetBoard();
        updateScreen();
    };

    // Starts event listener
    const start = () => {
        // Set the names from the input values, disable the inputs for the duration of the game
        game.setPlayerNames(playerX.value, playerO.value);
        playerX.disabled = true;
        playerO.disabled = true;

        // Hide the play button, replace it with next turn message
        actionButton.hidden = true;
        infoContainer.textContent = `${game.getActivePlayer().name}'s turn`;

        // Start the game grid event listener
        gridContainer.addEventListener("click", clickHandler);

        board.resetBoard();
        updateScreen();
        
    };

    // Kills event listener
    const removeEventListener = () => {
        gridContainer.removeEventListener("click", clickHandler);
    };

    // Reset the game. Enable the player name inputs. Show the play again button.
    const reset = () => {
        playerX.disabled = false;
        playerO.disabled = false;
        infoContainer.appendChild(actionButton);
        actionButton.hidden = false;
        actionButton.textContent = "Play again!";
    };

    return { start, clickHandler, start, initial, removeEventListener, reset };
})();

screen.initial();