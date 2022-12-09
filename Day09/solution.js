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
data = rawInput.split("\n").map(row => {
  const [direction, numString] = row.split(" ");  
  return [direction, parseInt(numString)];
});

// console.log(data);

const isNearby = (coord1, coord2) => {
  return (Math.abs(coord1.x - coord2.x) <= 1 && Math.abs(coord1.y - coord2.y) <= 1);
}

class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const printGrid = (arr, size, xOffset=0, yOffset=0) => {
  const grid = new Array(size).fill().map(() => new Array(size).fill('.'));
  
  for(let num = 0; num < arr.length; num++) {
    const coord = arr[num];

    if(grid[coord.y+yOffset][coord.x+xOffset] !== '.') continue;

    grid[coord.y+yOffset][coord.x+xOffset] = num === 0 ? "H" : num; 
  }

  if(grid[xOffset][yOffset] === '.') {
    grid[xOffset][yOffset] = 's';
  }

  for(const row of grid) {
    console.log(row.join(" "))
  }
}

const updateMap = (map, coord) => {
  const [i, j] = [coord.x, coord.y];

  if(!map.has(i)) {
    const rowMap = new Map();
    rowMap.set(j, true);
    map.set(i, rowMap);
  } else {
    const rowMap = map.get(i);
    rowMap.set(j, true);
    map.set(i, rowMap);
  }
}

const updatePosArray = (arr, oldPos) => {
  // Update elements 1 and beyond based on the element before it
  for(let i = 1; i < arr.length; i++) {
    let currCoord = arr[i];
    let prevCoord = arr[i-1];

    if(!isNearby(currCoord, prevCoord)) {
      // Only move on one axis if the coords share an axis
      if(currCoord.x == prevCoord.x) {
        currCoord.y += prevCoord.y > currCoord.y ? 1 : -1;
      } else if(currCoord.y == prevCoord.y) {
        currCoord.x += prevCoord.x > currCoord.x ? 1 : -1;
      } else {
        // Move diagonal to keep up
        currCoord.x += prevCoord.x > currCoord.x ? 1 : -1;
        currCoord.y += prevCoord.y > currCoord.y ? 1 : -1;
      }
    } else {
      // Since this knot didn't change, the following knots won't either
      break;
    }
  }
}

const replayDirections = (instructions) => {
  const tailMap = new Map();
  const headCoords = new Coord(0, 0);
  const tailCoords = new Coord(0, 0);
  
  for(const [dir, val] of instructions) {
    for(let i = 0; i < val; i++) {
      const oldHeadPos = new Coord(headCoords.x, headCoords.y);

      if(dir === 'U') {
        headCoords.y++;
      } else if(dir === 'D') {
        headCoords.y--;
      } else if(dir === 'L') {
        headCoords.x--;
      } else if(dir === 'R') {
        headCoords.x++;
      }
  
      if(!isNearby(headCoords, tailCoords)) {
        // update tail to old head
        tailCoords.x = oldHeadPos.x;
        tailCoords.y = oldHeadPos.y;
      }

      updateMap(tailMap, tailCoords)
    }
  }
  
  return tailMap;
}

const replayDirectionsMultiKnot = (instructions) => {
  const tailMap = new Map();
  const coordArr = new Array(10).fill().map(() => new Coord(0, 0));
  
  const headCoords = coordArr[0];
  const tailCoords = coordArr[coordArr.length - 1];
  
  for(const [dir, val] of instructions) {
    for(let i = 0; i < val; i++) {
      const oldHeadPos = new Coord(headCoords.x, headCoords.y);

      if(dir === 'U') {
        headCoords.y++;
      } else if(dir === 'D') {
        headCoords.y--;
      } else if(dir === 'L') {
        headCoords.x--;
      } else if(dir === 'R') {
        headCoords.x++;
      }
      
      updatePosArray(coordArr, oldHeadPos);
      updateMap(tailMap, tailCoords);
    }
  }
  
  return tailMap;
}

const countPositions = (map) => {
  let count = 0;

  for(const innerMap of map.values()) {
    count += innerMap.size;
  }

  return count;
}

const solve = (data) => {
  // Solution here
  // const tailMap = replayDirections(data); // part 1
  const tailMap = replayDirectionsMultiKnot(data);
  const posCount = countPositions(tailMap);
  return posCount;
}

const result = solve(data);
console.log(result)