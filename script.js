document.addEventListener('DOMContentLoaded', function () {
  // Initial chess board position
  const chessBoard = [
    'br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br',
    'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp',
    'wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'
  ];

  var slider = document.getElementById("slider");
  let chessBoardSize = 480;

  let enpassantable = false;
  let enpassantIndex = null;

  function updateSliderValue() {
    chessBoardSize = slider.value * 9.6 + 260;
    refreshBoard()
  }

  slider.addEventListener("input", updateSliderValue);

  const gridContainer = document.querySelector('.grid-container');
  let selectedCell = null;

  function refreshBoard() {
    gridContainer.innerHTML = ''; // Clear the grid

    // Iterate over each cell on the chessboard
    chessBoard.forEach((piece, index) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.style.width = cell.style.height = `${chessBoardSize / 8}px`;
      gridContainer.style.width = gridContainer.style.height = `${chessBoardSize}px`
      gridContainer.style.gridTemplateColumns = gridContainer.style.gridTemplateRows = `repeat(8, ${chessBoardSize / 8}px)`;

      // Set cell color based on row and column
      const row = Math.floor(index / 8);
      const col = index % 8;
      cell.classList.add(row % 2 === col % 2 ? 'beige' : 'brown');

      gridContainer.appendChild(cell);

      // Add a chess piece image to the cell if it's not empty
      if (chessBoard[index] !== '') {
        const image = document.createElement('img');
        image.src = `Chess Assets/${piece}.svg`;
        image.classList.add('draggable-piece', 'piece');
        image.draggable = false;

        // Set the width of the image
        image.style.width = `${chessBoardSize / 8}px`;

        cell.appendChild(image);
      }

      // Add a click event listener to each cell
      cell.addEventListener('click', () => handleCellClick(cell, index));
    });
  }

  function createBitBoard(piece, index) {
    let bitBoard = Array(64).fill(0);

    if (piece.substring(1) === 'k') {
      // Ways king can move
      let kingBitBoard = Array(9).fill(1);
      kingBitBoard[4] = 0;

      // Removes edge cases to overlay small bitboard on large bitboard
      if (index <= 7) {
        kingBitBoard[0] = kingBitBoard[1] = kingBitBoard[2] = 0;
      } else if (index >= 56) {
        kingBitBoard[6] = kingBitBoard[7] = kingBitBoard[8] = 0;
      }
      if (index % 8 === 0) {
        kingBitBoard[0] = kingBitBoard[3] = kingBitBoard[6] = 0;
      } else if (index % 8 === 7) {
        kingBitBoard[2] = kingBitBoard[5] = kingBitBoard[8] = 0;
      }

      // Extract row and column information from the index
      let rowIndex = Math.floor(index / 8);
      let colIndex = index % 8;

      // Overlay the kingBitBoard on the bitBoard
      for (let i = 0; i < 3; i++) { // i = row
        for (let j = 0; j < 3; j++) { // j = column
          let bitBoardIndex = (rowIndex + i - 1) * 8 + colIndex + j - 1;

          // Check if the bitBoardIndex is within valid bounds (0 to 63)
          if (bitBoardIndex >= 0 && bitBoardIndex <= 63) {
            bitBoard[bitBoardIndex] += kingBitBoard[i * 3 + j];
          }
        }
      }
    }

    return bitBoard;
  }


  function handleCellClick(cell, index) {

    if (!selectedCell && chessBoard[index] !== '') {
      // If no cell is selected and the clicked cell is not empty, select it
      selectedCell = index;
      cell.classList.add('selected-cell');
    } else if (selectedCell === index) {
      // If the same cell is clicked again, unselect it
      selectedCell = null;
      refreshBoard();
    } else if (selectedCell !== null) {
      //====================================
      // Here is where chess logic should go
      //====================================

      // Logic for en passant
      if (enpassantable) {
        if (index === enpassantIndex - 8 && chessBoard[selectedCell] === 'wp') {
          chessBoard[index + 8] = '';
        } else if (index === enpassantIndex + 8 && chessBoard[selectedCell] === 'bp') {
          chessBoard[index - 8] = '';
        }
      }

      // Check if pawn is just moved two squares
      if (selectedCell >= 48 && selectedCell <= 55 && index === selectedCell - 16 && chessBoard[selectedCell] === 'wp') {
        enpassantable = true;
        enpassantIndex = index;
      } else if (selectedCell >= 8 && selectedCell <= 15 && index === selectedCell + 16 && chessBoard[selectedCell] === 'bp') {
        enpassantable = true;
        enpassantIndex = index;
      } else {
        enpassantable = false;
        enpassantIndex = null;
      }

      // If a cell is already selected, move the piece to the clicked cell
      const targetCell = index;
      chessBoard[targetCell] = chessBoard[selectedCell];
      chessBoard[selectedCell] = '';
      refreshBoard();
      selectedCell = null;
    }
  }

  updateSliderValue(); // updateSliderValue() calls refreshBoard()
});
