const Heap = require('collections/heap');
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

const parseMonkey = (rows) => {
  let monkey = {};
  let line;
  // MAKE AN OBJECT INSTEAD?
  // Monkey Id
  line = rows[0];
  const id = parseInt(line.slice(line.indexOf(" "), line.indexOf(":")));
  monkey.id = id;

  // Starting Items
  line = rows[1];
  const items = line.slice(line.indexOf(":") + 1).split(",").map(ele => parseInt((ele)));
  monkey.items = items;

  // Operation
  line = rows[2];
  const op = line.slice(line.indexOf("old ")+4).split(" ");
  if(op[1] !== "old") op[1] = parseInt((op[1]));
  monkey.operation = op;

  // Test
  line = rows[3];
  const test = parseInt((line.slice(line.lastIndexOf(" ")+1)));
  monkey.testCondition = test;

  // True
  line = rows[4];
  const trueDestination = parseInt(line.slice(line.lastIndexOf(" ")+1));
  monkey.trueDestination = trueDestination;
  
  // False
  line = rows[5];
  const falseDestination = parseInt(line.slice(line.lastIndexOf(" ")+1));
  monkey.falseDestination = falseDestination;

  monkey.itemsInspected = 0;

  return monkey;
}

const generateGroupedData = (data) => {
  const grouped = [];

  for(let i = 0; i < data.length; i+=7) {    
    const monkeyInfo = data.slice(i, i+7);
    const monkeyObj = parseMonkey(monkeyInfo);
    grouped.push(monkeyObj);
  }

  return grouped;
}

const generateMonkeyMap = (data) => {
  const monkeyMap = new Map();
  const monkeys = generateGroupedData(data);
  
  for(const monkey of monkeys) {
    monkeyMap.set(monkey.id, monkey);
  }

  return monkeyMap;
}

const calculateNewItem = (item, op, lcm) => {
  let [symbol, operand] = op;
  if(operand === "old") operand = item;

  let result = 0;

  if(symbol === "*") {
    result = item * operand;
  } else if(symbol === "+") {
    result = item + operand;
  } else if(symbol === "-") {
    result = item - operand;
  } else if(symbol === "/") {
    result = item / operand;
  }

  while(result > lcm*10000) result -= lcm*10000;
  while(result > lcm) result -= lcm;

  return result;
}

const processConditional = (test, val) => {
  // console.log(test, val)
  return val % test == 0;
}

const calculateLCM = map => {
  let lcm = 1;

  for(const [id, monkey] of map.entries()) {
    lcm *= monkey.testCondition;
  }

  return lcm;
}

const playGame = (monkeyMap, rounds = 1) => {
  const lcm = calculateLCM(monkeyMap);

  for(let i = 0; i < rounds; i++) {
    for(let monkeyId = 0; monkeyId < monkeyMap.size; monkeyId++) {
      const monkey = monkeyMap.get(monkeyId);
      while(monkey.items.length > 0) {
        const item = monkey.items.shift();
        // console.log(monkey.id, "Looking at ", item)
        
        monkey.itemsInspected++;
        let newItem = calculateNewItem(item, monkey.operation, lcm);
        // newItem = Math.floor(newItem/3); 

        if(processConditional(monkey.testCondition, newItem)) {
          monkeyMap.get(monkey.trueDestination).items.push(newItem);
        } else {
          monkeyMap.get(monkey.falseDestination).items.push(newItem);
        }
      }
    }
  }  
}

const determineMonkeyBusinessLevel = monkeyMap => {
  const heap = new Heap();

  for(const [id, monkey] of monkeyMap.entries()) {
    heap.push(monkey.itemsInspected);
  }

  return heap.pop() * heap.pop();
}

const solve = (data) => {
  // Solution here
  const monkeyMap = generateMonkeyMap(data);
  playGame(monkeyMap, 10000)

  const monkeyBusinessLevel = determineMonkeyBusinessLevel(monkeyMap);
  return monkeyBusinessLevel;
}

const result = solve(data);
console.log(result) 

// Part 1
/*
const solve = (data) => {
  // Solution here
  const monkeyMap = generateMonkeyMap(data);
  playGame(monkeyMap, 20)

  const monkeyBusinessLevel = determineMonkeyBusinessLevel(monkeyMap);
  return monkeyBusinessLevel;
}
*/