const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';
const Heap = require('collections/heap')

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
// data = rawInput.split('\n'); //One file row = one string array element
data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
// data = rawInput.split('\n').map((row) => row.split(',')); //File = 2d array (string)
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
// data = rawInput //No simple parsing

// console.log(data);

const solve = (data) => {
  let currCals = 0;
  const calHeap = new Heap();

  for(const row of data) {
    if(isNaN(row)) {
      calHeap.push(currCals);
      currCals = 0;
      continue;
    }

    currCals += row;
  }

  let totalCals = 0;
  totalCals += calHeap.pop();
  totalCals += calHeap.pop();
  totalCals += calHeap.pop();

  return totalCals;
}

const result = solve(data);
console.log(result)


// Part 1 Solution
// Note : Need to insert an extra empty line at the end of input
// const solve = (data) => {
//   let maxCals = 0;
//   let currCals = 0;

//   for(const row of data) {
//     if(isNaN(row)) {
//       maxCals = Math.max(maxCals, currCals);
//       currCals = 0;
//       continue;
//     }

//     currCals += row;
//   }

//   return maxCals;
// }