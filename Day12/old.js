const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
// data = rawInput.split('\n'); //One file row = one string array element
// data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
data = rawInput.split('\n').map((row) => row.split('')); //File = 2d array (string)
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
// data = rawInput //No simple parsing

// console.log(data);

const A_VALUE = 0;
const Z_VALUE = 25;
const BAD_VALUE = 1000;

const pathGrid = new Array(data.length).fill().map(() => new Array(data.length).fill("."));

const gridMap = new Map();
gridMap.set(0, "v");
gridMap.set(1, "^");
gridMap.set(2, ">");
gridMap.set(3, "<");
gridMap.set(Infinity, ".");
gridMap.set(BAD_VALUE, "E")

const convertGrid = (data) => {
  const grid = [];
  for(const row of data) {
    const currRow = [];
    for(const ele of row) {
      if(ele != 'S' && ele != 'E') {
        currRow.push(ele.toString().charCodeAt(0) - 'a'.charCodeAt(0));
      } else {
        currRow.push(ele == 'S' ? A_VALUE : Z_VALUE);
      }
    }
    grid.push(currRow);
  }

  return grid;
}

const canTraverse = (grid, i, j, currHeight) => {
  if(i >= grid.length || i < 0 || j >= grid[i].length || j < 0) { 
    console.log("YEET", i, j)
    return false;
  }

  const nextHeight = grid[i][j] == "E" ? Z_VALUE : grid[i][j];
  
  if(currHeight == 'S') {
    return nextHeight === A_VALUE + 1;
  }

  return nextHeight === currHeight - 1 || nextHeight <= currHeight;
}

const getSubPathLength = (grid, i, j, currHeight, visited) => {
  if(i < 0 || i >= grid.length || j < 0 || j >= grid[i].length) {
    return Infinity;
  }

  const nextHeight = grid[i][j];
  if(nextHeight == currHeight+1 || nextHeight <= currHeight) {
    return findShortestPathLengthRecur(grid, i, j, visited);
  } else {
    return Infinity;
  }
  
}

const copyGrid = (grid) => {
  const newArray = [];

  for (var i = 0; i < grid.length; i++)
    newArray[i] = grid[i].slice();

  return newArray;
}

const findShortestPathLengthRecur = (grid, i, j, visited) => {
  if(i < 0 || i >= grid.length || j < 0 || j >= grid[i].length) {
    return Infinity;
  } else if(visited[i][j] !== false) {
    return visited[i][j];
  } else if(data[i][j] == 'E') {
    // console.log(data[i][j], i, j)
    grid[i][j] = 'E';
    return 0;
  }

  // console.log(data[i][j], i, j)

  visited[i][j] = Infinity;
  const currHeight = grid[i][j];

  const gridCopy = copyGrid(grid);
  grid[i][j] = BAD_VALUE;
  
  lengths = [
    getSubPathLength(gridCopy, i+1, j, currHeight, [...visited],),
    getSubPathLength(gridCopy, i-1, j, currHeight, [...visited]),
    getSubPathLength(gridCopy, i, j+1, currHeight, [...visited]),
    getSubPathLength(gridCopy, i, j-1, currHeight, [...visited])
  ];

  // lengths.sort();

  let min = Infinity;
  console.log(lengths)
  for(let k = 0; k < lengths.length; k++) {
    if(lengths[k] < min) {
      min = lengths[k];
      console.log("YOTE", k, grid[i][j], gridMap.get(k))
      pathGrid[i][j] = gridMap.get(k);
    }
  }

  console.log(lengths)
  // if(lengths.length === 0) return Infinity;
  // if(lengths[0] !== Infinity) console.log(data[i][j], i, j)
  visited[i][j] = min;
  return visited[i][j];
}

const findShortestPathLength = (grid) => {
  const visited = new Array(grid.length).fill().map(() => new Array(grid[0].length).fill(false));
  // console.log(visited)
  let length = 0;

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(data[i][j] == 'S') {
        length = findShortestPathLengthRecur(grid, i, j, visited)
      }
    }
  }

  return length;
}

const printPath = () => {
  for(const row of pathGrid) {
    console.log(...row)
  }
}

const solve = (data) => {
  // Solution here
  const grid = convertGrid(data);
  // console.log(grid)
  const shortestPathLength = findShortestPathLength(grid);
  printPath();
  return shortestPathLength;
}

const result = solve(data);
console.log(result)