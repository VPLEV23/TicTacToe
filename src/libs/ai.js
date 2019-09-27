import { GAME_DIFFICULTIES } from "../contexts/gameState";

function checkImminentWin(board) {
  function isImminentWin(xCellname, yCellname, zCellname) {
    const x = board[xCellname];
    const y = board[yCellname];
    const z = board[zCellname];

    let nOfX = 0;
    let nOfNull = 0;

    if (x === "x") nOfX++;
    if (y === "x") nOfX++;
    if (z === "x") nOfX++;
    if (x === null) nOfNull++;
    if (y === null) nOfNull++;
    if (z === null) nOfNull++;

    if (nOfX === 2 && nOfNull === 1) {
      return [
        { name: xCellname, value: x },
        { name: yCellname, value: y },
        { name: zCellname, value: z }
      ].find(c => c.value === null).name;
    }

    return false;
  }

  const possibilities = [
    // lines
    isImminentWin("a1", "b1", "c1"),
    isImminentWin("a2", "b2", "c2"),
    isImminentWin("a3", "b3", "c3"),

    // columns
    isImminentWin("a1", "a2", "a3"),
    isImminentWin("b1", "b2", "b3"),
    isImminentWin("c1", "c2", "c3"),

    // transversal
    isImminentWin("a1", "b2", "c3"),
    isImminentWin("a3", "b2", "c1")
  ].filter(p => p !== false);

  if (possibilities.length > 0) {
    return possibilities[Math.floor(Math.random() * possibilities.length)];
  }

  return false;
}

function preventImminentDanger(board) {
  function isImminentDanger(xCellname, yCellname, zCellname) {
    const x = board[xCellname];
    const y = board[yCellname];
    const z = board[zCellname];

    let nOfO = 0;
    let nOfNull = 0;

    if (x === "o") nOfO++;
    if (y === "o") nOfO++;
    if (z === "o") nOfO++;
    if (x === null) nOfNull++;
    if (y === null) nOfNull++;
    if (z === null) nOfNull++;

    if (nOfO === 2 && nOfNull === 1) {
      return [
        { name: xCellname, value: x },
        { name: yCellname, value: y },
        { name: zCellname, value: z }
      ].find(c => c.value === null).name;
    }

    return false;
  }

  const possibilities = [
    // лінії
    isImminentDanger("a1", "b1", "c1"),
    isImminentDanger("a2", "b2", "c2"),
    isImminentDanger("a3", "b3", "c3"),

    // колонка
    isImminentDanger("a1", "a2", "a3"),
    isImminentDanger("b1", "b2", "b3"),
    isImminentDanger("c1", "c2", "c3"),

    // діагональ
    isImminentDanger("a1", "b2", "c3"),
    isImminentDanger("a3", "b2", "c1")
  ].filter(p => p !== false);

  if (possibilities.length > 0) {
    return possibilities[Math.floor(Math.random() * possibilities.length)];
  }

  return false;
}

function checkPossibleWin(board) {
  function isPossibleWin(xCellname, yCellname, zCellname) {
    const x = board[xCellname];
    const y = board[yCellname];
    const z = board[zCellname];

    let nOfX = 0;
    let nOfNull = 0;

    if (x === "x") nOfX++;
    if (y === "x") nOfX++;
    if (z === "x") nOfX++;
    if (x === null) nOfNull++;
    if (y === null) nOfNull++;
    if (z === null) nOfNull++;

    if (nOfX === 1 && nOfNull === 2) {
      return [
        { name: xCellname, value: x },
        { name: yCellname, value: y },
        { name: zCellname, value: z }
      ].find(c => c.value === null).name;
    }

    return false;
  }

  const possibilities = [
    // лінії
    isPossibleWin("a1", "b1", "c1"),
    isPossibleWin("a2", "b2", "c2"),
    isPossibleWin("a3", "b3", "c3"),

    // колонки
    isPossibleWin("a1", "a2", "a3"),
    isPossibleWin("b1", "b2", "b3"),
    isPossibleWin("c1", "c2", "c3"),

    // діагоналі
    isPossibleWin("a1", "b2", "c3"),
    isPossibleWin("a3", "b2", "c1")
  ].filter(p => p !== false);

  if (possibilities.length > 0) {
    return possibilities[Math.floor(Math.random() * possibilities.length)];
  }

  return false;
}

function checkTheMiddle(board) {
  return board.b2 === null ? "b2" : false;
}

function getRandomCell(board) {
  const emptyCells = Object.keys(board)
    .map(key => ({ key, value: board[key] }))
    .filter(o => o.value === null)
    .map(o => o.key);
  const randomIndex = Math.floor(emptyCells.length * Math.random());
  return emptyCells[randomIndex];
}

export default function(board, difficulty) {
  const chance = Math.random() * 100;
  let willUseAI = false;

  // HARD
  // Нема рандомних ходів
  if (difficulty === GAME_DIFFICULTIES.HARD) willUseAI = true;

  // MEDIUM
  // 25% випадкових рухів
  if (difficulty === GAME_DIFFICULTIES.MEDIUM) willUseAI = chance >= 25;

  // EASY
  // 50% випадкових рухів
  if (difficulty === GAME_DIFFICULTIES.EASY) willUseAI = chance >= 50;

  // AI
  //
  // 1. Перевірте на швидкий виграш
  //    Коли заповнено 2 комірки рядка
  //    з позначкою супротивників, і одна
  //    пусто
  //
  // 2. Перевірте наявність неминучої небезпеки
  //    Коли заповнено 2 комірки рядка
  //    з вашою позначкою, і одна порожня
  //
  // 3. Перевірте можливий виграш
  //    Коли заповнена одна комірка рядка
  //    з вашою позначкою, а дві порожні
  //
  // 4. Перевірте середину
  //    Перевірте клітку В2, якщо її не встановлено
  //    Для запобігання найвідоміших ходів
  //
  // 5. Random
  //   Виберіть будь-яку клітинку порожню

  if (willUseAI) {
    const imminentWin = checkImminentWin(board);
    if (imminentWin) return imminentWin;

    const imminentDanger = preventImminentDanger(board);
    if (imminentDanger) return imminentDanger;

    const possibleWin = checkPossibleWin(board);
    if (possibleWin) return possibleWin;

    const middle = checkTheMiddle(board);
    if (middle) return middle;
  }

  return getRandomCell(board);
}
