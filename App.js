/**
 * Tic Tac Toe
 *
 * Author: Rohit Mehta (@r0hitm)
 */


/**
 * Gameboard Module
 * Handles all the gameboard operations, like placing pieces, checking for over conditions
 * 
 * Gameboard directly interacts with the human player, and provides the interface
 * for game AI
 */

const Gameboard = (() => {
    const PLAYER_SYMBOLS = ['X', 'O'];
    let p1_turn = true; // player 1, ie PLAYERS[0] plays first, then followed by next player
    let total_move_count = 0; // the combined total of number of moves (X's and O's) played so far
    const cells = Array(9).fill('');

    /**
     * clear the game board
     */
    const reset = () => {
        p1_turn = true;
        total_move_count = 0;
        cells.fill('');
    }

    /**
     * Return the board cells data
     */
    const getBoard = () => cells;

    /**
     * Interface to let players play the move on the board
     * 
     * Return true when successful; false otherwise
     */
    const nextMoveAt = (pos) => {
        if (cells[pos] === '') {
            if (p1_turn) {
                cells[pos] = PLAYER_SYMBOLS[0];
                p1_turn = false;
            } else {
                cells[pos] = PLAYER_SYMBOLS[1];
                p1_turn = true;
            }
            total_move_count++;
            return true;
        } else
            return false;
    }

    /**
     * check for win
     */
    const checkWin = () => {
        if (areEqual(cells[0], cells[1], cells[2]) ||
            areEqual(cells[3], cells[4], cells[5]) ||
            areEqual(cells[6], cells[7], cells[8]) ||
            areEqual(cells[0], cells[3], cells[6]) ||
            areEqual(cells[1], cells[4], cells[7]) ||
            areEqual(cells[2], cells[5], cells[8]) ||
            areEqual(cells[0], cells[4], cells[8]) ||
            areEqual(cells[2], cells[4], cells[6])) {
            return true;
        } else
            return false;
    }

    /**
     * Returns true if the game is over.
     * Either by win/loss or draw
     */
    const over = () => {
        if (total_move_count > 4 && checkWin() || total_move_count === 9) {
            return true;
        } else
            return false;
    }

    /**
     * returns the current player symbol who'll play the next move
     */
    const getNextPlayerSymbol = () => PLAYER_SYMBOLS[p1_turn ? 0 : 1];

    /**
     * returns the last player symbol
     */
    const getLastPlayerMove = () => p1_turn ? PLAYER_SYMBOLS[1] : PLAYER_SYMBOLS[0];

    /** returns the winner; '' if none */
    // const getWinner = () => winner;

    return {
        reset,
        getBoard,
        nextMoveAt,
        over,
        getNextPlayerSymbol,
        getLastPlayerMove,
        checkWin,
    }
})();

const render = () => {
    const grid = Array.from(document.querySelectorAll('div.cell'));
    const cells = Gameboard.getBoard();

    /**
     * Renders the gameboard cells data from Gameboard to the screen
     * 
     */
    for (let i = 0; i < cells.length; i++) {
        grid[i].textContent = cells[i];
    }

    // console.log('***** Debug: render() was called.'); // DEBUG CODE
};

// Render Gameboard on the screen
const displayController = (() => {
    let startBtnPressed = false; // Keeps record whether Start btn was pressed
    const board = document.querySelector('div.gameboard');
    const feedbackHandle = document.querySelector('span.feedback');

    const updateFeedback = () => {
        // console.log('Current player symbol: ' + Gameboard.getNextPlayerSymbol());
        feedbackHandle.textContent = Gameboard.getNextPlayerSymbol();
    }

    // this interface allows for updating state
    const btnPressed = () => {
        startBtnPressed = true;
        // console.log('ONCE only!!!!'); // DEBUG CODE
        // This is to update the state change from the just btn press
        updateFeedback();
    }

    // re-render the board
    board.addEventListener('click', () => {
        render();
        // shout out the player who has to play next
        if (startBtnPressed)
            updateFeedback();
    });

    return {
        btnPressed,
        updateFeedback,
    }
})();


/**
 * Factory function for player.
 */

const playerFactory = (mode) => {
    const gridCells = Array.from(document.querySelectorAll('div.cell'));
    const checkEndGame = (winner) => {
        render(); // update screen, before proceeding further

        // console.log('WInner is ' + winner); // DEBUG CODE

        if (Gameboard.over()) {
            // remove the above event listener now the game is over
            gridCells.forEach(el => el.removeEventListener('click', playerInput));

            const msg = 'Game Over! ';
            console.log(msg); // DEBUG CODE

            if (Gameboard.checkWin())
                alert(msg + 'Player ' + winner + ' Won, yay!');
            else
                alert(msg + 'It\'s a Draw');

        }
    }

    /**
     * callback function to handle the player input from the click event
     */
    const playerInput = (evnt) => {
        const el = evnt.currentTarget;
        // console.log(el); // DEBUG CODE

        // Player moves
        const index = parseInt(el.getAttribute('data-i'));
        if (!Gameboard.nextMoveAt(index))
            return; // return if player is trying to play illegal move

        checkEndGame(Gameboard.getLastPlayerMove()); // Has player won?

        if (!Gameboard.over() && mode === 'comp') {
            // don't let player play, until comp has played
            gridCells.forEach(el => el.removeEventListener('click', playerInput));

            /**
             * Computer will play her turn randomly, not a very strategic play-style
             */
            setTimeout(() => {
                let flag = false;
                let compMove = Math.floor(Math.random() * 9);

                while (!flag) {
                    compMove = Math.floor(Math.random() * 9);
                    flag = Gameboard.nextMoveAt(compMove);
                    checkEndGame(Gameboard.getLastPlayerMove()); // Has comp won?
                    // console.log('just after computer move, player symbol is ' + Gameboard.getNextPlayerSymbol());
                }

                // update screen output after computer move
                render();
                displayController.updateFeedback();
                // player can play hi/her turn now
                gridCells.forEach(el => el.addEventListener('click', playerInput));
            }, 1000);
        }
    }

    /**
     * Let the players play by letting them place pieces on the Gameboard
     */
    const play = () => {
        gridCells.forEach(el => el.addEventListener('click', playerInput));
    }

    /**
     * removes the playerInput from the gridCells
     */
    const reset = () => {
        gridCells.forEach(el => el.removeEventListener('click', playerInput));
    }

    return {
        play,
        reset
    }
}

const init = (() => {
    let player;

    const playAgainstCompBtn = document.querySelector('button.start-comp');
    const playLocalBtn = document.querySelector('button.start-local');

    const hardReset = () => {
        if (player instanceof Object) { // remove all previously set eventListeners
            player.reset();
        }

        // THe order of below calls matter!
        displayController.btnPressed();
        Gameboard.reset();
        displayController.updateFeedback();
        render();
    }

    playAgainstCompBtn.addEventListener('click', () => {
        hardReset();

        player = playerFactory('comp');     // playing against computer
        player.play();

        playAgainstCompBtn.textContent = 'Restart';
        playLocalBtn.textContent = 'Pass & Play against Friends';
    });

    playLocalBtn.addEventListener('click', () => {
        hardReset();

        player = playerFactory();   // playing locally against friends
        player.play();

        playAgainstCompBtn.textContent = 'Play against Computer';
        playLocalBtn.textContent = 'Restart';
    });
})();



//~~~~~~~~~~~~~~~~~~~ HELPER FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~
/**
 * Checks if all the given arguments are strictly equal.
 * 
 * @param {arguments}
 * @returns {Boolean}
 */
function areEqual() {
    var len = arguments.length;
    for (var i = 1; i < len; i++) {
        if (arguments[i] === '' || arguments[i] !== arguments[i - 1])
            return false;
    }
    return true;
}