const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
data = rawInput.split('\n'); //One file row = one string array element
// data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
// data = rawInput.split('\n').map((row) => row.split(',')); //File = 2d array (string)
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
// data = rawInput //No simple parsing

// console.log(data);

const parseProgram = (data) => {
  return data.map(row => {
    const parsed = row.split(" ");
    if(parsed.length === 2) parsed[1] = parseInt(parsed[1]);

    return parsed;
  })
}

const getSignalArray = (instructs) => {
  let x = 1;
  const signalArr = [0];

  for(const row of instructs) {
    if(row.length === 2) {
      signalArr.push(x);
      signalArr.push(x);
      x += row[1];
      
    } else {
      signalArr.push(x);
    }
  }

  signalArr.push(x);
  return signalArr;
}

const sumInterestingSignalStrengths = (signals, offset, step, limit) => {
  let sum = 0;
  for(let i = offset, limitCounter = 0; i < signals.length, limitCounter < limit; i += step, limitCounter++) {
    // console.log(i, signals[i], i * signals[i])
    sum += (i * signals[i]);
  }

  return sum;
}

const isSpriteBeingDrawn = (cycle, x) => {
  return cycle === x || cycle === x-1 || cycle === x+1;
}

const renderImage = (signals) => {
  for(let i = 0; i < 6; i++) {
    const rowArr = [];
    for(let j = 0; j < 40; j++) {
      const currCycle = (((i-1) * 40) + j + 40) + 1;
      const horizontalCycle = j; // Cycle independent of vertical pos, aka cycle % 40
      const currX = signals[currCycle];

      if(isSpriteBeingDrawn(horizontalCycle, currX)) {
        rowArr.push("#");
      } else {
        rowArr.push(".");
      }
      
    }
    console.log(...rowArr)
  }
}

const solve = (data) => {
  // Solution here
  const programArr = parseProgram(data);
  const signalArr = getSignalArray(programArr);
  // const signalSum = sumInterestingSignalStrengths(signalArr, 20, 40, 6);
  renderImage(signalArr);
}

const result = solve(data);
console.log(result)

// Part 1
/*
const solve = (data) => {
  // Solution here
  const programArr = parseProgram(data);
  const signalArr = getSignalArray(programArr);
  const signalSum = sumInterestingSignalStrengths(signalArr, 20, 40, 6);
  return signalSum;
}
*/