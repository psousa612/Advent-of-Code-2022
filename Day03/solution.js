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

const generatePocketHash = (pocket) => {
  const hash = new Map();

  for(const item of pocket) {
    if(hash.has(item)) {
      hash.set(item, hash.get(item) + 1);
    } else {
      hash.set(item, 1);
    }
  }

  return hash;
}

const findCommonHashElement = (hash1, hash2) => {
  for(const [key, value] of hash1.entries()) {
    if(hash2.has(key)) {
      return key;
    }
  }
}

const findCommonHashElementTriple = (arr) => {
  const [hash1, hash2, hash3] = arr;

  for(const [key, value] of hash1.entries()) {
    if(hash2.has(key) && hash3.has(key)) {
      return key;
    }
  }
}

const getPointValue = (item) => {
  let code = item.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

  if(code > 26) {
    code -= 32;
  } else {
    code += 26;
  }

  return code;
}

const getGroupedArray = (data) => {
  return data.reduce((res, aggr, i, array) => {
    if(i % 3 === 0) 
      res.push(array.slice(i, i+3));
    
    return res;
  }, []);
}

const solve = (data) => {
  // Solution here
  let total = 0;

  const groups = getGroupedArray(data);

  for(const group of groups) {
    const hashArray = group.map(items => generatePocketHash(items));
    
    let badgeType = findCommonHashElementTriple(hashArray);
    total += getPointValue(badgeType);
  }

  return total;
}

const result = solve(data);
console.log(result)


// Part 1 Solution
/*
const solve = (data) => {
  // Solution here
  let total = 0;

  for(const bag of data) {
    const mid = bag.length / 2;
    const pocket1 = bag.slice(0, mid);
    const pocket2 = bag.slice(mid);

    const pocketHash1 = generatePocketHash(pocket1);
    const pocketHash2 = generatePocketHash(pocket2);

    let currPriority = getPointValue(findCommonHashElement(pocketHash1, pocketHash2));
    total += currPriority;
  }

  return total;
}
*/