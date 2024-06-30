const cards = [
    { id: 1, img: 'img/img1.png' },
    { id: 1, img: 'img/img1.png' },
    { id: 2, img: 'img/img2.png' },
    { id: 2, img: 'img/img2.png' },
    { id: 3, img: 'img/img3.png' },
    { id: 3, img: 'img/img3.png' },
    { id: 4, img: 'img/img4.png' },
    { id: 4, img: 'img/img4.png' },
    { id: 5, img: 'img/img5.png' },
    { id: 5, img: 'img/img5.png' },
    { id: 6, img: 'img/img6.png' },
    { id: 6, img: 'img/img6.png' }
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let timer = 0;
let moves = 0;
let intervalId = null;
let isFirstClick = true;

const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const restartButton = document.getElementById('restart');
const gameInfo = document.querySelector('.game-info');
const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-game');
const gameContainer = document.getElementById('game-container');

startButton.addEventListener('click', startGame);

function startGame() {
    gameContainer.removeChild(startButton); // Hapus tombol start setelah dimulai
    createBoard(); // Panggil fungsi createBoard untuk memulai permainan
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    gameBoard.innerHTML = '';  // Hapus papan sebelumnya jika ada
    shuffle(cards);
    moves = 0;
    movesElement.innerText = `Moves: ${moves}`;
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = card.id;

        const imgElement = document.createElement('img');
        imgElement.src = card.img;
        cardElement.appendChild(imgElement);
        cardElement.classList.add('hidden'); // Menyembunyikan gambar di awal

        cardElement.addEventListener('click', onCardClick);
        gameBoard.appendChild(cardElement);
    });
}

function onCardClick(event) {
    if (lockBoard) return;
    const clickedCard = event.target.closest('.card');

    if (clickedCard === firstCard || clickedCard.classList.contains('matched')) return;

    if (isFirstClick) {
        isFirstClick = false;
        intervalId = setInterval(updateTimer, 1000);
    }

    clickedCard.classList.remove('hidden'); // Menampilkan kartu yang diklik

    if (!firstCard) {
        firstCard = clickedCard;
    } else {
        secondCard = clickedCard;
        moves++;
        movesElement.innerText = `Moves: ${moves}`;
        checkMatch();
    }
}

function checkMatch() {
    if (firstCard.dataset.id === secondCard.dataset.id) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        updateScore();
        if (document.querySelectorAll('.card.matched').length === cards.length) {
            gameFinished();
        }
        resetBoard();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.add('hidden');
            secondCard.classList.add('hidden');
            resetBoard();
        }, 1000); // Waktu penundaan sebelum menyembunyikan kartu kembali
    }
}

function updateScore() {
    score++;
    scoreElement.innerText = `Score: ${score}`;
}

function updateTimer() {
    timer++;
    timerElement.innerText = `Time: ${timer}s`;
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function restartGame() {
    clearInterval(intervalId);
    startGame();
}

function gameFinished() {
    clearInterval(intervalId);
    const gameInfoText = `Congratulations! You completed the game in ${timer} seconds with a score of ${score}. Moves: ${moves}`;
    gameInfo.innerHTML = `<div class="game-finished">${gameInfoText}</div>`;
}

restartButton.addEventListener('click', restartGame);

startGame();
