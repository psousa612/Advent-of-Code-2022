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

const parseData = (data) => {
  const packets = [];

  for(let i = 0; i < data.length; i+=3) {
    let row = [];
    row.push(eval(data[i]));
    row.push(eval(data[i+1]));

    packets.push(row);
  }

  return packets;
} 

const parsePackets = (data) => {
  const packets = [];

  for(let i = 0; i < data.length; i++) {
    if(data[i].length == 0) continue;
    packets.push(eval(data[i]));
  }

  return packets;
}

const compareLists = (leftOg, rightOg) => {
  const left = [...leftOg];
  const right = [...rightOg]
  while(left.length > 0 && right.length > 0) {
    const leftVal = left.shift();
    const rightVal = right.shift();

    let results = isPacketInOrder(leftVal, rightVal);
    if(results == undefined) continue;

    return results;
  }

  if(left.length === right.length) return undefined;

  return left.length === right.length || right.length > 0;
}

const compareNums = (left, right) => {
  if(left === right) return undefined;

  return left <= right;
}

const convertToLists = (left, right) => {
  let newLeft = left, newRight = right;

  if(typeof left === 'number') newLeft = [left];
  if(typeof right === 'number') newRight = [right];

  return [newLeft, newRight];
}

const isPacketInOrder = (left, right) => {
  if(typeof left === typeof right) {
    if(typeof left === 'object') {
      return compareLists(left, right);
    } else if(typeof left === 'number') {
      return compareNums(left, right);
    }
  } else {
    const news = convertToLists(left, right);
    return compareLists(...news);
  }
}

const getCorrectOrderPackets = (packets) => {
  let correctIndexes = [];

  let i = 1;
  for(const [left, right] of packets) {
    let result = isPacketInOrder(left, right);
    if(result === true) {
      correctIndexes.push(i);
    } 
    i++;
  }

  return correctIndexes;
}

const packetComp = (a, b) => {
  const res = isPacketInOrder(a, b);
  if(res == undefined) return 0;
  return res ? -1 : 1;
}

const calculateDecoderKey = (packets) => {
  let res = 1;
  for(let i = 0; i < packets.length; i++) {
    if(packets[i].toString() == '2' || packets[i].toString() == '6') {
      
      res *= i+1;
    }
  }

  return res;
}

const solve = (data) => {
  // Solution here
  data.push("[[2]]");
  data.push("[[6]]");

  const packets = parsePackets(data);
  packets.sort(packetComp);
  return calculateDecoderKey(packets);
}

const result = solve(data);
console.log(result)

// Part 1 
/*
const solve = (data) => {
  // Solution here
  const packets = parseData(data);
  const correctIndexes = getCorrectOrderPackets(packets);
  return correctIndexes.reduce((prev,curr) => prev+curr);
}
*/