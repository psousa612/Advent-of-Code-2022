const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
// data = rawInput.split('\n'); //One file row = one string array element
// data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
data = rawInput.split('\n').map((row) => row.split(' ')); //File = 2d array (string)
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
// data = rawInput //No simple parsing

// console.log(data);

const shapesMap = new Map();
shapesMap.set('A', 0);
shapesMap.set('B', 1);
shapesMap.set('C', 2);

shapesMap.set('X', 0);
shapesMap.set('Y', 1);
shapesMap.set('Z', 2);

const pointMap = new Map();
pointMap.set('X', 0);
pointMap.set('Y', 3);
pointMap.set('Z', 6);


const getShapePoints = (opp, resNeeded) => {
  if(resNeeded === 'Y') {
    return shapesMap.get(opp) + 1;
  } else if(resNeeded === 'X') {
    // Need to lose
    let newShapeCode = shapesMap.get(opp) - 1;
    if(newShapeCode < 0) newShapeCode = 2;

    return newShapeCode + 1;
  } else {
    let newShapeCode = (shapesMap.get(opp) + 1) % 3;

    return newShapeCode + 1;
  }
}

const calculatePoints = (opp, resNeeded) => {
  let points = 0;

  points += getShapePoints(opp, resNeeded);
  points += pointMap.get(resNeeded);

  return points;
}

const solve = (data) => {
  // Solution here
  let totalPoints = 0;

  // Shift inputs
  for(const [opp, resNeeded] of data) {
    totalPoints += calculatePoints(opp, resNeeded);
  }

  return totalPoints;
}

const result = solve(data);
console.log(result)



// Part 1 Solution
/*
const pointMap = new Map();
pointMap.set('X', 1);
pointMap.set('Y', 2);
pointMap.set('Z', 3);

const doesUserWin = (opp, user) => {
  // fuck it we ball
  // console.log(user)
  const opCode = shapesMap.get(opp);
  const userCode = shapesMap.get(user);
  
  if(opCode === userCode) return 0;

  if(userCode === (opCode + 1) % 3) return 1;

  return -1;
}

const calculatePoints = (opp, user) => {
  let points = 0;
  
  const userWinFlag = doesUserWin(opp, user);
  switch(userWinFlag) {
    case 0:
      points += 3;
      break;

    case 1:
      points += 6;
      break;

    case -1:
      points += 0;
      break;

    default:
      console.log('wtf');
  }

  points += pointMap.get(user);

  return points;
}

const solve = (data) => {
  // Solution here
  let totalPoints = 0;

  // Shift inputs
  for(const [opp, user] of data) {
    // console.log(opp, user)
    totalPoints += calculatePoints(opp, user);
  }

  return totalPoints;
}


*/