const fs = require('fs');
const { parse } = require('path');
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

const initStack = [];
const instructions = [];
let isInstructionLine = false;
for(const row of data) {
  if(row === '') {
    isInstructionLine = true;
    continue;
  }

  if(isInstructionLine) {
    instructions.push(row);
  } else {
    initStack.push(row);
  }
}

// starting at 2, step by 4

const parseInitStack = (initStack) => {
  const arrLength = parseInt(initStack[initStack.length-1][initStack[initStack.length-1].length-2]);
  const stackArr = [...Array(arrLength)].map(() => new Array());
  
  for(let k = 0; k < initStack.length-1; k++) {
    for(let i = 1, j = 0; i < initStack[0].length; i += 4, j++) {
      const curr = initStack[k][i];

      if(curr === ' ')
        continue;

      stackArr[j].push(curr);
    }
  }

  return stackArr;
}

// Convert instructions to an array form
const parseInstructions = (instructions) => {
  const instructs = [];

  for(const row of instructions) {
    const line = row.replace('move ', '').replace('from ', '').replace('to ', '');
    instructs.push(line.split(' ').map(ele => parseInt(ele)));
  }

  return instructs;
}

const runInstructions = (stack, instructions) => {
  console.log(instructions)
  for(const [num, sourceUnshifted, destinationUnshifted] of instructions) {
    source = sourceUnshifted - 1;
    destination = destinationUnshifted - 1;

    const toMove = [];
    for(let i = 0; i < num; i++) {
      toMove.push(stack[source].shift());
    }
    
    while(toMove.length > 0) {
      stack[destination].unshift(toMove.shift());
    }
  }
}

const runInstructions9001 = (stack, instructions) => {
  console.log(instructions)
  for(const [num, sourceUnshifted, destinationUnshifted] of instructions) {
    source = sourceUnshifted - 1;
    destination = destinationUnshifted - 1;

    const toMove = [];
    for(let i = 0; i < num; i++) {
      toMove.unshift(stack[source].shift());
    }
    
    while(toMove.length > 0) {
      stack[destination].unshift(toMove.shift());
    }
  }
}

const getTopOfStacksString = (stack) => {
  let toReturn = "";

  for(const s of stack) {
    toReturn += s.shift();
  }

  return toReturn;
}

const solve = (initStack, instructions) => {
  // Solution here
  const stacks = parseInitStack(initStack);
  const instruct = parseInstructions(instructions);

  runInstructions9001(stacks, instruct)
  return getTopOfStacksString(stacks)
}

const result = solve(initStack, instructions);
console.log(result)

// Part 1 Solution
/*
const solve = (initStack, instructions) => {
  // Solution here
  const stacks = parseInitStack(initStack);
  const instruct = parseInstructions(instructions);

  runInstructions(stacks, instruct)
  return getTopOfStacksString(stacks)
}
*/