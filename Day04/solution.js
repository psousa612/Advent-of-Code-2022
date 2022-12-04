const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
// data = rawInput.split('\n'); //One file row = one string array element
// data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
// data = rawInput.split('\n').map((row) => row.split(',')); //File = 2d array (string)
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
// data = rawInput //No simple parsing

data = rawInput.split('\n').map(row => row.split(',').map(range => range.split('-').map(num => parseInt(num))));

// console.log(data);

const doesRangesFullyOverlap = (range1, range2) => {
  const [start1, end1] = range1;
  const [start2, end2] = range2;

  if(start1 <= start2 && end1 >= end2) return true;
  if(start2 <= start1 && end2 >= end1) return true;

  return false;
}

const doesRangesPartiallyOverlap = (range1, range2) => {
  const [start1, end1] = range1;
  const [start2, end2] = range2;
  
  if(start1 >= start2 && start1 <= end2) return true;
  if(start2 >= start1 && start2 <= end1) return true;

  return false;
}

const solve = (data) => {
  // Solution here
  let numOverlaps = 0;

  for(const [range1, range2] of data) {
    if(doesRangesPartiallyOverlap(range1, range2)) 
      numOverlaps++;
  }

  return numOverlaps;
}

const result = solve(data);
console.log(result)

// Part 1 Solution
/*
const solve = (data) => {
  // Solution here
  let numOverlaps = 0;

  for(const [range1, range2] of data) {
    if(doesRangesFullyOverlap(range1, range2)) 
      numOverlaps++;
  }

  return numOverlaps;
}
*/