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

data = rawInput.split('\n').map(row => row.split(" -> ").map(pair => {
  const [x, y] = pair.split(",");
  return [parseInt(x), parseInt(y)];
}))

// console.log(data);

let highestY = -Infinity;

const drawLine = (grid, point1, point2) => {
  let [x, y] = [...point1];

  while(x < point2[0]) {
    grid[x][y] = "#";
    x++;
  }

  while(x > point2[0]) {
    grid[x][y] = "#";
    x--;
  }

  while(y < point2[1]) {
    grid[x][y] = "#";
    y++;
  }

  while(y > point2[1]) {
    grid[x][y] = "#";
    y--;
  }

  grid[x][y] = "#";
}

const generateGrid = (data, width, height) => {
  const grid = new Array(width).fill().map(() => new Array(height).fill("."));
  
  for(const row of data) {
    for(let i = 0; i < row.length-1; i++) {
      let currPoint = row[i];
      let destinationPoint = row[i+1];
      
      highestY = Math.max(highestY, currPoint[1], destinationPoint[1]);

      drawLine(grid, currPoint, destinationPoint);
    }
  } 

  return grid;
}

const addFloor = (grid) => {
  for(let i = 0; i < grid.length; i++) {
    grid[i][highestY+2] = "#";
  }
}

const sandFreeFall = (grid, sand) => {
  while(grid[sand.x][sand.y+1] == '.') {
    grid[sand.x][sand.y] = '.';
    grid[sand.x][sand.y+1] = "+";
    sand.y++;

    // console.log(sand.x, sand.y)
    if(sand.y >= grid[0].length-1) return false;
  }

  return true;
}

// return true if sand settled, return false is not
const spawnAndSettleSand = (grid, sandX, sandY) => {
  const sand = {x : sandX, y : sandY}

  if(grid[sand.x][sand.y] == '+') return false;
  grid[sand.x][sand.y] = "+";

  // Fall until collision

  while(true) {
    const fallRes = sandFreeFall(grid, sand);
    if(!fallRes) return false;

    try {
      // Try down-left
      if(grid[sand.x-1][sand.y+1] == '.') {
        grid[sand.x][sand.y] = '.';
        grid[sand.x-1][sand.y+1] = "+";
        sand.x--;
        sand.y++;
        continue;
      }

      // Try down-right
      if(grid[sand.x+1][sand.y+1] == '.') {
        grid[sand.x][sand.y] = '.';
        grid[sand.x+1][sand.y+1] = "+";
        sand.x++;
        sand.y++;
        continue;
      }
    } catch(e) {
      console.log(sand)
      return false;
    }
    break;
  }

  return true;
}

const runSimulation = (grid, sandX, sandY) => {
  let sandCount = 0;

  while(spawnAndSettleSand(grid, sandX, sandY)) {
    sandCount++;
    // printGrid(grid, 490, 1)
  } 
  
  return sandCount;
}

const printGrid = (grid, xOffset = 0, yOffset = 0) => {
  // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
  output = grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));

  for(let i = yOffset; i < output.length; i++) {
    const row = [];
    for(let j = xOffset; j < output[0].length; j++) {
      row.push(output[i][j]);
    }
    console.log(...row)
  }
}

const solve = (data) => {
  // Solution here
  const grid = generateGrid(data, 1000, 500);
  addFloor(grid);
  const numSand = runSimulation(grid, 500, 0);
  // printGrid(grid, 490)
  return numSand;
}

const result = solve(data);
console.log(result)

// Part 1 
/*
const solve = (data) => {
  // Solution here
  const grid = generateGrid(data, 1000, 500);
  const numSand = runSimulation(grid, 500, 0);
  return numSand;
}
*/