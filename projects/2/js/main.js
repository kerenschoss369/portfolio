'use strict';

var gBoard = [];
var gElTimer, gTimeout;
var gMillisecond = 0;
var gSeconds = 0;
var gMinutes = 0;
var gHintCount = 3;

// var gFinishedAt = null;

var gLevel = {
    size: 4,
    mines: 2
};

var gGame = {
    isOn: true, //boolean, when true we let the user play
    shownCount: 0, //how many cells are shown
    markedCount: 0, //how many cells are marked (with a flag)
    isHint: false, // if true means the user can click a safe click
    lives: 3,
    safeClicks: 3
}

function initGame() {
    gElTimer = document.querySelector(".timer");
    buildBoard();
    console.log(gBoard);
    renderBoard();
}

function buildBoard() {
    for (var i = 0; i < gLevel.size; i++) {
        var currRow = [];
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false,
                wasShown: false
            }
            currRow.push(currCell);
        }
        gBoard.push(currRow);
    }
}

function setMines(cellI, cellJ) {
    let totalCurrMines = 0;
    while (totalCurrMines < gLevel.mines) {
        var randomI = Math.floor(Math.random() * gLevel.size);
        var randomJ = Math.floor(Math.random() * gLevel.size);
        // don't locate mines at the clicked cell or his neighbors
        if (randomI !== cellI && randomJ !== cellJ &&
            !isNeighbors(cellI, cellJ, randomI, randomJ)) {
            if (!gBoard[randomI][randomJ].isMine) {
                gBoard[randomI][randomJ].isMine = true;
                totalCurrMines++;

            }
        }
    }
}

// Check if two cells are neighbors
function isNeighbors(firstI, firstJ, secondI, secondJ) {
    var isNegs = false;
    for (var i = firstI - 1; i <= firstI + 1; i++) {
        for (var j = firstJ - 1; j <= firstJ + 1; j++) {
            if (j < 0 || j >= gLevel.size || i < 0 || i >= gLevel.size) {
                continue;
            }
            if (i === firstI && j === firstJ) continue;
            if (secondI === i && secondJ === j) {
                isNegs = true;
            }
        }
    }
    return isNegs;
}

// Count mines around each cell and set the cell's minesAroundCount.
function setMinesNegsCount() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            gBoard[i][j].minesAroundCount = getCellNegsCount(i, j);
        }
    }
}

// Count mines around specific cell 
function getCellNegsCount(cellI, cellJ) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.size || i < 0 || i >= gLevel.size) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) {
                neighborsCount++;
            }
        }
    }
    return neighborsCount;
}

// Render the board as a < table > to the page
function renderBoard() {
    var strHTML = `<table><tbody>`;
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < gLevel.size; j++) {
            var cellValue = '';
            var cell = gBoard[i][j];
            if (cell.isMine) {
                cellValue = '💣';
            }

            if (!cell.isShown) {
                if (cell.isMarked) {
                    cellValue = '🚩';
                } else cellValue = '';
            }
            if (cell.isShown && !cell.isMine) {
                if (cell.minesAroundCount === 0) {
                    cellValue = '';
                } else {
                    cellValue = cell.minesAroundCount;
                }
            }
            var isCellShown = cell.isShown;
            var className = `cell-${i}-${j} ${isCellShown ? 'shown' : ''} `;
            strHTML += `<td onclick="onCellClicked(${i}, ${j})" onmousedown="cellMarked(${i}, ${j})" class="cell ${className}">${cellValue}</td>`;
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`;
    var elTableContainer = document.querySelector('.board-container');
    elTableContainer.innerHTML = strHTML;
}

function onCellClicked(i, j) {
    var cell = gBoard[i][j];
    // if is marked or the game is finished you cant press it
    if (!gGame.isOn || cell.isMarked) return;
    if (!gGame.isHint) {
        //  count click only if the cell was not shown
        if (!cell.isShown) gGame.shownCount++;
        // first click
        if (gGame.shownCount === 1) {
            firstClickOnCell(i, j);
        }
        // regular click
        if (!cell.isMine) {
            gBoard[i][j].isShown = true;
            renderBoard();
        } else {
            // click on a bomb
            if (gGame.lives > 1) {
                gBoard[i][j].isShown = true;
                renderBoard();
                gGame.lives--;
                var elLives = document.querySelector('.lives');
                elLives.innerText = `${gGame.lives} lives left`;
            } else { //lose
                showAllMines();
                gameOver(false);
                var elEmoji = document.querySelector('.emoji-btn');
                elEmoji.src = "images/sad.png";
                var elLives = document.querySelector('.lives');
                elLives.innerText = `0 lives left`;
            }
        }
    }
    //  if you press the hint button
    else {
        setTimeout(function() {
            unexpandShown(i, j);
            gBoard[i][j].isShown = false;
            renderBoard();
        }, 1000);
        expandShown(i, j);
        gBoard[i][j].isShown = true;
        renderBoard();
        gGame.isHint = false;
    }
    if (isWin()) {
        gameOver(true);
        var elEmoji = document.querySelector('.emoji-btn');
        elEmoji.src = "images/win.png";
    }
}

function firstClickOnCell(i, j) {
    timer(); // start the timer
    expandShown(i, j);
    setMines(i, j);
    countClicksOfExpandShown(i, j);
    setMinesNegsCount();
    renderBoard();
}

function isWin() {
    var maxClicked = (gLevel.size * gLevel.size) - gLevel.mines;
    var maxFlagged = gLevel.mines;
    if (gGame.shownCount === maxClicked && gGame.markedCount === maxFlagged) {
        return true
    }
    return false;
}

function showAllMines() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) gBoard[i][j].isShown = true;
        }
    }
    renderBoard();
}

function cellMarked(i, j) {
    var isRightClick;
    var event = window.event;
    // check if it is actually right click
    isRightClick = (event.which === 3);
    if (isRightClick) {
        const cell = gBoard[i][j];
        cell.isMarked = !cell.isMarked;
        if (cell.isMarked) gGame.markedCount++;
        renderBoard();
        if (isWin()) {
            gameOver(true);
            var elEmoji = document.querySelector('.emoji-btn');
            elEmoji.src = "images/win.png";
        }
    }
}

function gameOver(win) {
    gGame.isOn = false;
    var elGameOver = document.querySelector('.game-over-container');
    var elP = document.createElement('p');
    elP.classList.add("game-over-msg");
    if (win) {
        elP.innerText = 'YOU WIN! Maybe you want to play again?';
    } else {
        elP.innerText = 'YOU LOSE! But maybe you want to play again?';
    }
    elGameOver.appendChild(elP);
    var elButton = document.createElement('button');
    elButton.innerText = 'Play Again';
    elButton.classList.add("play-again-btn");
    elButton.setAttribute('onclick', 'resetGame()');
    elGameOver.appendChild(elButton);
    gGame.shownCount = 0;
    resetTimer();
}

function resetGame(size = gLevel.size, mines = gLevel.mines) {
    var elEmoji = document.querySelector('.emoji-btn');
    elEmoji.src = "images/happy.png";
    gHintCount = 3;
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        isHint: false,
        lives: 3,
        safeClicks: 3
    }
    gLevel = {
        size,
        mines
    };
    resetBoard();
    resetTimer();
    var elLives = document.querySelector('.lives');
    elLives.innerText = `3 lives left`;
    var elSafeClicks = document.querySelector('.safe-click-btn');
    elSafeClicks.innerText = `you have 3 more safe clicks`;
    const elBtns = document.querySelectorAll('.hint-btn');
    elBtns.forEach(btn => btn.style.display = 'flex');
    var elGameOver = document.querySelector('.game-over-container');
    // check if the element have at least one child
    if (elGameOver.firstChild) {
        elGameOver.removeChild(elGameOver.firstChild);
        elGameOver.removeChild(elGameOver.firstChild);
    }
}

// Open the cell and its neighbors.
function expandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.size || i < 0 || i >= gLevel.size) continue;
            if (i === cellI && j === cellJ) continue;
            // if it was not the fist click and it was shown before
            if (gGame.shownCount > 1 && gBoard[i][j].isShown) gBoard[i][j].wasShown = true;
            gBoard[i][j].isShown = true;
        }
    }
}

function unexpandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.size || i < 0 || i >= gLevel.size) continue;
            if (i === cellI && j === cellJ) continue;
            // if it was shown before (the hint) don't cover it
            if (gBoard[i][j].wasShown) gBoard[i][j].isShown = true;
            else gBoard[i][j].isShown = false;
        }
    }
}

// Count how much cells was open on expandShown
function countClicksOfExpandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gLevel.size || i < 0 || i >= gLevel.size) continue;
            if (i === cellI && j === cellJ) continue;
            if (!gBoard[i][j].isMine) gGame.shownCount++;
        }
    }
}

// Timer
function updateTime() {
    gMillisecond++;
    if (gMillisecond >= 100) {
        gMillisecond = 0;
        gSeconds++;
        if (gSeconds >= 60) {
            gSeconds = 0;
            gMinutes++;
        }
    }
    gElTimer.textContent = (gMinutes ? (gMinutes > 9 ? gMinutes : "0" + gMinutes) : "00") +
        ":" + (gSeconds ? (gSeconds > 9 ? gSeconds : "0" + gSeconds) : "00") +
        ":" + (gMillisecond > 9 ? gMillisecond : "0" + gMillisecond);
    timer();
}

function timer() {
    gTimeout = setTimeout(updateTime, 10);
}

function resetTimer() {
    clearTimeout(gTimeout);
    gElTimer.textContent = "00:00:00";
    gMillisecond = 0;
    gSeconds = 0;
    gMinutes = 0;
}

function onClickHint(num) {
    if (gGame.shownCount === 0) return;
    // to made the spasific button to desappear
    document.querySelectorAll(`.hint-btn`)[num - 1].style.display = "none";
    if (gHintCount > 0) {
        gGame.isHint = true;
    }
    gHintCount--;
}

function onClickSafeClick() {
    if (gGame.safeClicks === 0 && gGame.shownCount === 0) return;
    gGame.safeClicks--;
    var elSafeClicks = document.querySelector('.safe-click-btn');
    elSafeClicks.innerText = `you have ${gGame.safeClicks} more safe clicks`;
    var foundCell = findRandomCell();
    var cellI = foundCell.i;
    var cellJ = foundCell.j;

    setTimeout(function() {
        gBoard[cellI][cellJ].isShown = false;
        renderBoard();
    }, 1000);
    gBoard[cellI][cellJ].isShown = true;
    renderBoard();
}

function findRandomCell() {
    var stillSearch = true;
    var foundLocation = {};
    while (stillSearch) {
        var randomI = Math.floor(Math.random() * gLevel.size);
        var randomJ = Math.floor(Math.random() * gLevel.size);
        if (!gBoard[randomI][randomJ].isShown && !gBoard[randomI][randomJ].isMine) {
            stillSearch = false;
            foundLocation.i = randomI;
            foundLocation.j = randomJ;
        }
    }
    return foundLocation;
}

function resetBoard() {
    gBoard = [];
    buildBoard();
    renderBoard();
}