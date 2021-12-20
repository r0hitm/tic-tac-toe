/**
 * Tic Tac Toe
 *
 * Author: Rohit Mehta (@r0hitm)
 */


const possibleGamestates = Object.freeze({'start': 0, 'play': 1, 'over': 2,});
const GameState = (() => {
    let cur_gamestate = possibleGamestates.start;

    /**
     * @returns {cur_gamestate}
     */
    const getGameState = () => cur_gamestate;

    /**
     * changes the current gamestate
     * @param {availableGameStates}
     * @returns {Boolean} returns true if successful
     */
    const setGameState = (g) => {
        cur_gamestate = g;
    }

    return {getGameState, setGameState}
})();

/**
 * Gameboard Module
 * Handles all the gameboard operations, like placing pieces, checking for over conditions
 * 
 * Gameboard directly interacts with the human player, and provides the interface
 * for game AI
 */

const Gameboard = (() => {
    const player_X = 'X';
    const player_O = 'O';
    let total_move_count = 0;   // the combined total of number of moves (X's and O's) played so far
    let turn_of_x = true;   // is it X's turn? (X begins the match)
    const cells = Array.from(document.querySelectorAll('div.cell'));
    const getCellValAt = (i) => cells[i].textContent;

    for (let i = 0; i < 9; i++) {
        console.log(i, cells[i].getAttribute('data-i'));  
    }

    /**
     * 
     * @param {HTMLDivElement} cell - the gameboard cell
     * @returns {Boolean} - true if cell's textContent is empty; otherwise false
     */
    const isCellEmpty = (cell) => {
        if (cell.textContent === '')
            return true;
        else
            return false;
    }

    /**
     * clear the game board
     */
    const clear = () => {
        cells.forEach(el => el.textContent = '');

    }

    /**
     * Checks if all the given arguments are strictly equal.
     * 
     * @param {arguments}
     * @returns {Boolean}
     */
    function areEqual(){
        var len = arguments.length;
        for (var i = 1; i< len; i++){
           if (arguments[i] === '' || arguments[i] !== arguments[i-1])
              return false;
        }
        return true;
     }

    /**
     * @returns {string} returns player_X or player_O whoever is won;
     *                   if no legal move is left then returns 'Draw'
     *                   if no one has won returns ''
     */
    const checkWinner = () => {
        if (total_move_count <= 4) return '';

        if (areEqual(getCellValAt(0), getCellValAt(1), getCellValAt(2)))
            return getCellValAt(0);

        else if (areEqual(getCellValAt(3), getCellValAt(4), getCellValAt(5)))
            return getCellValAt(3);

        else if (areEqual(getCellValAt(6), getCellValAt(7), getCellValAt(8)))
            return getCellValAt(6);
        
        else if (areEqual(getCellValAt(0), getCellValAt(3), getCellValAt(6)))
            return getCellValAt(0);

        else if (areEqual(getCellValAt(1), getCellValAt(4), getCellValAt(7)))
            return getCellValAt(1);

        else if (areEqual(getCellValAt(2), getCellValAt(5), getCellValAt(8)))
            return getCellValAt(2);

        else if (areEqual(getCellValAt(0), getCellValAt(4), getCellValAt(8)))
            return getCellValAt(0);

        else if (areEqual(getCellValAt(2), getCellValAt(4), getCellValAt(6)))
            return getCellValAt(2);
        
        else if (total_move_count === 9)
            return 'Draw'

        else
            return '';
    }

    /**
     * 
     * Game is over if any player wins or if there's a draw
     * 
     * @returns {Boolean} returns true if the game is over
     */
    const checkGameOver = () => {
        switch(checkWinner()) {
            case player_X: 
                console.log(player_X + " won!!!");
                GameState.setGameState(possibleGamestates.over);
                break;

            case player_O:
                console.log(player_O + " won!!!");
                GameState.setGameState(possibleGamestates.over);
                break;

            case 'Draw':
                console.log('It\'s a DRAW! No legal moves available')
                GameState.setGameState(possibleGamestates.over);
        }
    }

    const initPlay = () => {
        cells.forEach(el => el.addEventListener('click', function() {
            // debug code
            console.log('Cell ' + (parseInt(el.getAttribute('data-i')) + 1) + ' clicked.');
            // ------
    
    
            if (isCellEmpty(el)) {
                total_move_count++;
    
                if (turn_of_x) {
                    el.textContent = player_X;
                    turn_of_x = false;
                } else {
                    el.textContent = player_O;
                    turn_of_x = true;
                }
    
                checkGameOver();
                playing();
            }
        }));
    }

    return {initPlay, clear}
})();

/**
 * Changes the game state between play and start
 */
function toggleGamestate() {
    console.log('Button clicked');

    if (GameState.getGameState() === possibleGamestates.start || GameState.getGameState() === possibleGamestates.over) {
        GameState.setGameState(possibleGamestates.play);
    }
    else if (GameState.getGameState() === possibleGamestates.play) {
        GameState.setGameState(possibleGamestates.start);
        Gameboard.clear();
    }

    playing();
}


/**
 * the function responds to the changes in the gamestate
 */
const playing = () => {
    if (GameState.getGameState() === possibleGamestates.play) {
        Gameboard.initPlay();
    }
}