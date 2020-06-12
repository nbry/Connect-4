let currPlayer = 1;  
const WIDTH = 7;
const HEIGHT = 6;
const board = [];  // array of rows, each row is array of cells  (board[y][x])
const pieceCounter = [];  //when pieceCounter.length = WIDTH * HEIGHT, board is full. 

// Creates an array matrix that represents the board. Each nested Array represents a row. 
// Each element represents a cell. We are making a board of undefined elements.  A player's
// piece will be represented in the array matrix as a number... 1 or 2. 

function makeBoard() {
    for (let y = 0; y < HEIGHT; y++) {
    board.push([...new Array(WIDTH)]);
  }
}

function makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

  // Creates clickable top row. Sets Id from 1 to WIDTH
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  htmlBoard.append(top);

  // Creates actual game board. No click events. Sets Coordinate ID's
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }

    htmlBoard.append(row);
  }
}

// If relevent position in board matrix array is null, then return y... because that's where the piece
// is going. Loop over to check from bottom up. If column in the matrix array is full, then return 
// null. This will prevent more pieces from being placed.
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

// Creates piece div. Adds the classes. Appends piece to cell with appropriate ID. 
function placeInTable(y, x) {
  const nextPiece = document.createElement("div");
  nextPiece.classList.add("piece", `p${currPlayer}`);

  const placement = document.getElementById(`${y}-${x}`);
  placement.append(nextPiece);

  pieceCounter.push('turn'); // +1 to a counter that monitors the number of pieces on the board. 
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg);
}

function handleClick(evt) {

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return; //stop the function here, if y is null (i.e. if column is full)
  }


  // Alters board array matrix to reflect a players turn.
  board[y][x] = currPlayer;

  // Places piece on HTMLboard. 
  placeInTable(y, x);

  // check for win. Remove ability to click board.
  if (checkForWin()) {
    document.getElementById('column-top').removeEventListener('click', handleClick);
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie. Comes after check for win. If there is no win, and board is full: tie
  if (pieceCounter.length === WIDTH * HEIGHT) {
    return endGame('Tie!');
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  let turnIdentifier = document.querySelector('#turn').childNodes[1];
  if (currPlayer === 1) {
    turnIdentifier.innerText = "Red";
  } else {
    turnIdentifier.innerText = "Blue";
  }
}


function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Loops over entire board. 
  // Checks for any four adjacent cells on the board. 
  // Checks for win conditions for any 4 adjacent cells
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
