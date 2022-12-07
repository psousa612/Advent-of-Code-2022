const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
// data = rawInput.split('\n'); //One file row = one string array element
// data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
// data = rawInput.split('\n').map((row) => row.split(',')); //File = 2d array (string)
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
data = rawInput //No simple parsing

// console.log(data);
const addOrIncrementMap = (map, key) => {
  if(map.has(key)) {
    map.set(key, map.get(key) + 1);
  } else {
    map.set(key, 1);
  }
}

const decrementOrDeleteMap = (map, key) => {
  if(map.get(key) === 1) {
    map.delete(key);
  } else {
    map.set(key, map.get(key) - 1);
  }
}

const findUniqueWindow = (line, windowSize) => {
  const window = [];
  const map = new Map();

  for(const index in line) { 
    const char = line[index];

    if(window.length < windowSize) {
      window.push(char);
      addOrIncrementMap(map, char);
      // console.log(window)
      continue;
    }

    const toRemove = window.shift();
    decrementOrDeleteMap(map, toRemove);

    addOrIncrementMap(map, char);
    window.push(char);

    // console.log(window)
    // console.log(map.size)
    // console.log(map)
    if(map.size === windowSize) {
      return parseInt(index) + 1;
    }
  }

  return '';
}

const solve = (data) => {
  // Solution here
  // return findUniqueWindow(data, 4); // Part 1
  return findUniqueWindow(data, 14);
}

const result = solve(data);
console.log(result)