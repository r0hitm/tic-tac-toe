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
    let turn_of_p1 = true; // player 1, ie PLAYERS[0] plays first, then followed by next player
    let total_move_count = 0; // the combined total of number of moves (X's and O's) played so far
    const cells = Array(9).fill('');

    /**
     * clear the game board
     */
    const reset = () => {
        turn_of_p1 = true;
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
            if (turn_of_p1) {
                cells[pos] = PLAYER_SYMBOLS[0];
                turn_of_p1 = false;
            } else {
                cells[pos] = PLAYER_SYMBOLS[1];
                turn_of_p1 = true;
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
    const getCurrentPlayerSymbol = () => PLAYER_SYMBOLS[turn_of_p1 ? 0 : 1];

    /** returns the winner; '' if none */
    // const getWinner = () => winner;

    return {
        reset,
        getBoard,
        nextMoveAt,
        over,
        getCurrentPlayerSymbol,
        checkWin,
    }
})();

const render = () => {
    const grid = Array.from(document.querySelectorAll('div.cell'));
    const cells = Gameboard.getBoard();
    const feedbackHandle = document.querySelector('span.feedback');

    /**
     * Renders the gameboard cells data from Gameboard to the screen
     * 
     */
    for (let i = 0; i < cells.length; i++) {
        grid[i].textContent = cells[i];
    }

    // shout out the player who has to play next
    feedbackHandle.textContent = Gameboard.getCurrentPlayerSymbol();

    // console.log('***** Debug: render() was called.'); // DEBUG CODE
};

// Render Gameboard on the screen
const displayController = (() => {
    // re-render the board
    document.querySelector('div.gameboard').addEventListener('click', () => {

        render();
    });
})();


/**
 * Factory function for player.
 */

const playerFactory = () => {
    const gridCells = Array.from(document.querySelectorAll('div.cell'));

    /**
     * callback function to handle the player input from the click event
     */
    const playerInput = (evnt) => {
        const el = evnt.currentTarget;
        const index = parseInt(el.getAttribute('data-i'));
        Gameboard.nextMoveAt(index);

        // check for game over condition
        if (Gameboard.over()) {

            // remove the above event listener now the game is over
            gridCells.forEach(el => el.removeEventListener('click', playerInput));

            const msg = 'Game Over! ';
            setTimeout(() => {
                if (Gameboard.checkWin())
                    alert(msg + 'Player ' + el.textContent + ' Won, yay!');
                else
                    alert(msg + 'It\'s a Draw');
            }, 1);
        }
    }

    /**
     * Let the players play by letting them place pieces on the Gameboard
     */
    const play = () => {
        gridCells.forEach(el => el.addEventListener('click', playerInput));
    }

    return {
        play,
    }
}

const gameFlow = (() => {
    const player = playerFactory();

    const startBtn = document.querySelector('button.start')
    startBtn.addEventListener('click', evnt => {
        // Update the button message, once
        if (startBtn.textContent === 'Start') {
            startBtn.textContent = 'Restart';
        }
        Gameboard.reset();
        player.play();

        render();
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