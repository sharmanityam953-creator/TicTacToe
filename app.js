let sizeSelect = document.getElementById("size");
let game = document.getElementById("game");
let resetBtn = document.getElementById("reset-btn");
let newBtn = document.getElementById("new-btn");
let msg = document.getElementById("msg");
let msgContainer = document.querySelector(".msg-container");
let tree = document.getElementById("tree");

let size = 3;
let board = [];
let human = "O";
let ai = "X";

init();

sizeSelect.onchange = () => {
  size = parseInt(sizeSelect.value);
  init();
};

resetBtn.onclick = init;
newBtn.onclick = init;

function init() {
  board = Array(size * size).fill("");
  game.innerHTML = "";
  tree.innerHTML = "";
  msgContainer.classList.add("hide");

  game.style.gridTemplateColumns = `repeat(${size}, 80px)`;
  game.style.gridTemplateRows = `repeat(${size}, 80px)`;

  for (let i = 0; i < size * size; i++) {
    let btn = document.createElement("button");
    btn.classList.add("box");
    btn.onclick = () => move(i);
    game.appendChild(btn);
  }
}

function move(i) {
  if (board[i] !== "") return;

  board[i] = human;
  render();

  if (checkWin(board, human)) return showWinner(human);
  if (!board.includes("")) return draw();

  setTimeout(() => {
    let best = minimax(board, 0, true, -Infinity, Infinity).index;
    if (best !== undefined) {
      board[best] = ai;
      render();
    }

    if (checkWin(board, ai)) showWinner(ai);
    else if (!board.includes("")) draw();
  }, 200);
}

function render() {
  let boxes = document.querySelectorAll(".box");
  boxes.forEach((b, i) => (b.innerText = board[i]));
}

function checkWin(b, player) {
  for (let i = 0; i < size; i++) {
    let row = true;
    let col = true;

    for (let j = 0; j < size; j++) {
      if (b[i * size + j] !== player) row = false;
      if (b[j * size + i] !== player) col = false;
    }

    if (row || col) return true;
  }

  let diag1 = true;
  let diag2 = true;

  for (let i = 0; i < size; i++) {
    if (b[i * size + i] !== player) diag1 = false;
    if (b[i * size + (size - i - 1)] !== player) diag2 = false;
  }

  return diag1 || diag2;
}

function draw() {
  msg.innerText = "Draw";
  msgContainer.classList.remove("hide");
}

function showWinner(w) {
  msg.innerText = `Winner: ${w}`;
  msgContainer.classList.remove("hide");
}

function minimax(b, depth, isMax, alpha, beta) {
  if (checkWin(b, ai)) return { score: 10 - depth };
  if (checkWin(b, human)) return { score: depth - 10 };
  if (!b.includes("")) return { score: 0 };

  let bestMove = { index: undefined, score: isMax ? -Infinity : Infinity };

  for (let i = 0; i < b.length; i++) {
    if (b[i] === "") {
      b[i] = isMax ? ai : human;

      let result = minimax(b, depth + 1, !isMax, alpha, beta);

      b[i] = "";

      if (isMax) {
        if (result.score > bestMove.score) {
          bestMove = { index: i, score: result.score };
        }
        alpha = Math.max(alpha, result.score);
      } else {
        if (result.score < bestMove.score) {
          bestMove = { index: i, score: result.score };
        }
        beta = Math.min(beta, result.score);
      }

      if (beta <= alpha) break;
    }
  }

  return bestMove;
}