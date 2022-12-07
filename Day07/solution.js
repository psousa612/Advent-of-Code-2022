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

const CD_ROOT = "$ cd /";
const LS = "$ ls";

const buildDirectoryStructure = (relic) => {
  const dir = new Map();
  let pointer = dir, prevPointerStack = [dir];

  for(let i = 0; i < relic.length; i++) {
    const line = relic[i];

    if(line === CD_ROOT) {
      pointer = dir;
    } else if(line === LS) {
      // Grab the curr directory files
      const currDir = [];
      for(let j = i+1; ; j++) {
        if(relic[j][0] == '$' || relic[j] === '') {
          i = j-1;
          break;
        } 

        currDir.push(relic[j]);
      }
      
      // Push them to our map, at our current pointer
      currDir.map(item => {
        if(item.includes('dir')) {
          const dirName = item.split(" ")[1];
          pointer.set(dirName, new Map());
        } else {
          const [size, name] = item.split(" ");
          pointer.set(name, parseInt(size));
        }
      })

    } else if(line.includes("cd")) {
      const dirRequested = line.split(" ")[2];
      
      if(dirRequested === "..") {
        pointer = prevPointerStack.pop();
      } else {
        prevPointerStack.push(pointer);
        pointer = pointer.get(dirRequested);
      }
    }
  }

  return dir;
}

const sumSmallerDirectories = (dir, toSum) => {
  let currDirSize = 0;
  
  for(const [key, value] of dir.entries()) {
    if(typeof value === 'object') {
      currDirSize += sumSmallerDirectories(value, toSum);
    } else {
      currDirSize += value;
    }
  }

  if(currDirSize <= 100000) {
    toSum.push(currDirSize);
  }

  return currDirSize;
}

const updateDirSumMinHeap = (dir, sizeHeap) => {
  let currDirSize = 0;

  for(const [key, value] of dir.entries()) {
    if(typeof value === 'object') {
      currDirSize += updateDirSumMinHeap(value, sizeHeap);
    } else {
      currDirSize += value;
    }
  }

  sizeHeap.push(currDirSize);
  return currDirSize;
}

const MAX_SIZE = 70000000;
const SPACE_NEEDED = 30000000;

const getDirSizeToRemove = (sizeHeap, unusedSpace) => {
  let toRemove = 0;

  while(sizeHeap.length > 0) {
    const size = sizeHeap.pop();
    
    if(unusedSpace + size >= SPACE_NEEDED) {
      toRemove = size;
    }
  }

  return toRemove;
}

const solve = (data) => {
  // Solution here
  const dir = buildDirectoryStructure(data);
  
  const sizeHeap = new Heap();
  updateDirSumMinHeap(dir, sizeHeap);

  const rootSize = sizeHeap.pop();
  const currUnusedSpace = MAX_SIZE - rootSize;
  const dirSizeToRemove = getDirSizeToRemove(sizeHeap, currUnusedSpace);

  return dirSizeToRemove;
}

const result = solve(data);
console.log(result)

// Part 1 Solution
/*
const solve = (data) => {
  // Solution here
  const dir = buildDirectoryStructure(data);

  const sumList = [];
  const sizeSum = sumSmallerDirectories(dir, sumList);
  
  return sumList.reduce((prev, curr) => prev + curr);
}
*/