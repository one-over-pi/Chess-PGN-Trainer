document.addEventListener('DOMContentLoaded', function () {
  // Initial chess board position  
  let chessBoard = [
      'br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br',
      'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp',
      'wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'
    ];
  
    const gridContainer = document.querySelector('.grid-container');
    // Track the selected cell
    let selectedCell = null;
  
    function refreshBoard() {
      gridContainer.innerHTML = ''; // Clear the grid
  
      chessBoard.forEach((piece, index) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
  
        // Set cell color based on row and column
        const row = Math.floor(index / 8);
        const col = index % 8;
        cell.classList.add(row % 2 === col % 2 ? 'beige' : 'brown');
  
        gridContainer.appendChild(cell);
  
        if (cell) {
            if (chessBoard[index] != ''){
                const image = document.createElement('img');
                image.src = `Chess Assets/${piece}.png`;
                image.classList.add('draggable-piece', 'piece');
                image.draggable = false; // Disable draggable attribute
                
                cell.appendChild(image);
            }
  
          cell.addEventListener('click', function () {
            handleCellClick(cell, index);
          });
        }
      });
    }
  
    function handleCellClick(cell, index) { 
        console.log(chessBoard[index]);
        // If selectedCell is null and the chessboard square you select is not empty:
        if (!selectedCell && chessBoard[index]!= '') {
            // Select the selected cell
            selectedCell = index;
            // Apply red highlight colour to selected cell
            cell.classList.add('selected-cell');
        
        // Otherwise if you reselect the cell you previously selected
        } else if (selectedCell == index) {
            // Unselect cell
            selectedCell = null;
            // Remove highlight
            refreshBoard();
        
        // Otherwise (if you have selected a cell and the next cell you selected is not the cell you previously selected)
        } else{
            // --------------------------------------------------
            // Insert logic for checking move is valid chess move
            // --------------------------------------------------

            // Move the piece to the target cell
            const targetCell = index;
    
            // Check if the target cell is empty or not
            if (!chessBoard[targetCell] ) {
            chessBoard[targetCell] = chessBoard[selectedCell];
            chessBoard[selectedCell] = '';
            } else {
            // Destroy the piece if the target cell is occupied
            chessBoard[targetCell] = chessBoard[selectedCell];
            chessBoard[selectedCell] = '';
            }
    
            refreshBoard();
    
            selectedCell = null;
        }
    }
  
    refreshBoard();
  });
  
