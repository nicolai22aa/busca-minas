const numRows = 10;  // Filas
const numCols = 10;  // Columnas
const numMines = 20; // Minas

let board = [];
let revealedCount = 0;
let gameOver = false;

function createBoard() {
    board = [];
    for (let row = 0; row < numRows; row++) {
        board[row] = [];
        for (let col = 0; col < numCols; col++) {
            board[row][col] = {
                mine: false,
                revealed: false,
                flagged: false,
                adjacentMines: 0
            };
        }
    }

    // Colocar las minas
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        let row = Math.floor(Math.random() * numRows);
        let col = Math.floor(Math.random() * numCols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }

    // Calcular las minas adyacentes
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (!board[row][col].mine) {
                let adjacentMines = 0;
                for (let r = row - 1; r <= row + 1; r++) {
                    for (let c = col - 1; c <= col + 1; c++) {
                        if (r >= 0 && r < numRows && c >= 0 && c < numCols && board[r][c].mine) {
                            adjacentMines++;
                        }
                    }
                }
                board[row][col].adjacentMines = adjacentMines;
            }
        }
    }
}

function renderBoard() {
    const table = document.getElementById('minesweeper-board');
    table.innerHTML = '';
    for (let row = 0; row < numRows; row++) {
        let tr = document.createElement('tr');
        for (let col = 0; col < numCols; col++) {
            let td = document.createElement('td');
            td.addEventListener('click', () => handleClick(row, col));
            td.addEventListener('contextmenu', (e) => handleRightClick(e, row, col));
            if (board[row][col].revealed) {
                td.classList.add('revealed');
                if (board[row][col].mine) {
                    td.classList.add('mine');
                    td.innerText = '💣';
                } else if (board[row][col].adjacentMines > 0) {
                    td.innerText = board[row][col].adjacentMines;
                }
            } else if (board[row][col].flagged) {
                td.classList.add('flagged');
                td.innerText = '🚩';
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function handleClick(row, col) {
    if (gameOver || board[row][col].revealed || board[row][col].flagged) return;

    board[row][col].revealed = true;
    revealedCount++;

    if (board[row][col].mine) {
        gameOver = true;
        // Al perder, revelamos todas las minas
        revealAllMines();
        alert('¡Perdiste! Has hecho clic en una mina.');
        renderBoard();
        return;
    }

    if (board[row][col].adjacentMines === 0) {
        revealAdjacentCells(row, col);
    }

    if (revealedCount === numRows * numCols - numMines) {
        alert('¡Ganaste! Has despejado todo el campo.');
        gameOver = true;
    }

    renderBoard();
}

// Función para revelar todas las minas al perder
function revealAllMines() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (board[row][col].mine && !board[row][col].revealed) {
                board[row][col].revealed = true;
            }
        }
    }
}

function revealAdjacentCells(row, col) {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < numRows && c >= 0 && c < numCols && !board[r][c].revealed) {
                board[r][c].revealed = true;
                revealedCount++;
                if (board[r][c].adjacentMines === 0) {
                    revealAdjacentCells(r, c);
                }
            }
        }
    }
}

function handleRightClick(e, row, col) {
    e.preventDefault();
    if (gameOver || board[row][col].revealed) return;
    
    board[row][col].flagged = !board[row][col].flagged;
    renderBoard();
}

createBoard();
renderBoard();