"use strict";

var gBoard = [];
var gCurrNum = 1;
var gClickCount = 0;
var gGameInterval;
var gTimer,
    gMillisecond = 0,
    gSeconds = 0,
    gMinutes = 0,
    gTimeout;

function onInit() {
    gTimer = document.querySelector(".timer");
    createBoard();
    renderBoard();
}

function resetGame(isPlayAgain = false) {
    if (isPlayAgain) {
        createBoard();
        var elGameOver = document.querySelector('.game-over-container');
        elGameOver.removeChild(elGameOver.firstChild);
        elGameOver.removeChild(elGameOver.firstChild);
    }
    renderBoard();
    resetTimer();
    gCurrNum = 1;
    gClickCount = 0;
}

function onClickEasy() {
    createBoard();
    resetGame();
}

function onClickMedium() {
    createBoard(5);
    resetGame();
}

function onClickHard() {
    createBoard(6);
    resetGame();
}

function onClickCell(el, i, j) {
    if (+el.innerText === gCurrNum) {
        gCurrNum++;
        gBoard[i][j].isClicked = true;
        gClickCount++;
        if (gClickCount === 1) {
            timer();
        }
        if (gClickCount === gBoard.length * gBoard.length) {
            gameOver();
        }
    }
    renderBoard();
}

function createBoard(length = 4) {
    gBoard = [];

    // making an optional numbers array
    var optionalNumbers = [];
    for (var i = 1; i <= length * length; i++) {
        optionalNumbers.push(i);
    }

    var currRow = [];
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            var idxCalc = Math.floor(Math.random() * optionalNumbers.length);
            var currValue = optionalNumbers[idxCalc];
            var currCell = {
                value: currValue,
                isClicked: false
            }
            currRow.push(currCell);
            optionalNumbers.splice(idxCalc, 1);
        }
        gBoard.push(currRow);
        currRow = [];
    }
}

function renderBoard() {
    var strHTML = `<table><tbody>`;
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>`;
        for (var j = 0; j < gBoard.length; j++) {
            var currValue = gBoard[i][j].value;
            var isCellClicked = gBoard[i][j].isClicked;
            var className = `cell-${i}-${j} ${isCellClicked ? 'clicked' : ''}`;
            strHTML += `<td onclick="onClickCell(this, ${i}, ${j})" class="cell ${className}">${currValue}</td>`;
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`;
    var elTableContainer = document.querySelector('.table-container');
    elTableContainer.innerHTML = strHTML;

}

function gameOver() {
    var elGameOver = document.querySelector('.game-over-container');
    var elP = document.createElement('p');
    elP.innerText = 'You won! Maybe you want to play again? ;)';
    elGameOver.appendChild(elP);

    var elButton = document.createElement('button');
    elButton.innerText = 'Play Again';
    elButton.setAttribute('onclick', 'resetGame(true)');
    elGameOver.appendChild(elButton);
    gClickCount = 0;
    resetTimer();
}

//timer

function add() {
    gMillisecond++;
    if (gMillisecond >= 100) {
        gMillisecond = 0;
        gSeconds++;
        if (gSeconds >= 60) {
            gSeconds = 0;
            gMinutes++;
        }
    }
    gTimer.textContent = (gMinutes ? (gMinutes > 9 ? gMinutes : "0" + gMinutes) : "00") +
        ":" + (gSeconds ? (gSeconds > 9 ? gSeconds : "0" + gSeconds) : "00") +
        ":" + (gMillisecond > 9 ? gMillisecond : "0" + gMillisecond);
    timer();
}

function timer() {
    gTimeout = setTimeout(add, 10);
}

function resetTimer() {
    clearTimeout(gTimeout);
    gTimer.textContent = "00:00:00";
    gMillisecond = 0;
    gSeconds = 0;
    gMinutes = 0;
}