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

data = rawInput.split('\n').map(row => row.split('').map(ele => parseInt(ele)));

// console.log(data);

const isTreeVisible = (grid, i, j) => {
  const currHeight = grid[i][j];
  let isVisible = true;

  if(i === 0 || i === grid.length-1 || j === 0 || j === grid[i].length-1) return true;

  isVisible = true;
  for(let k = 0; k < i; k++) {
    if(grid[k][j] >= currHeight)
      isVisible = false;
  }
  if(isVisible) return true;

  isVisible = true;
  for(let k = i+1; k < grid.length; k++) {
    if(grid[k][j] >= currHeight)
      isVisible = false;
  }
  if(isVisible) return true;

  isVisible = true;
  for(let k = 0; k < j; k++) {
    if(grid[i][k] >= currHeight)
      isVisible = false;
  }
  if(isVisible) return true;

  isVisible = true;
  for(let k = j+1; k < grid[i].length; k++) {
    if(grid[i][k] >= currHeight)
      isVisible = false;
  }
  if(isVisible) return true;

  return false;
}

const getTreeVisibilityGrid = (grid) => {
  const gridWidth = grid.length, gridHeight = grid[0].length;
  const visibiltyGrid = new Array(gridWidth).fill(0).map(() => new Array(gridHeight).fill(0));

  for(let i = 0; i < gridWidth; i++) {
    for(let j = 0; j < gridHeight; j++) {
      visibiltyGrid[i][j] = isTreeVisible(grid, i, j) ? 1 : 0;
    }
  }

  return visibiltyGrid;
}

const countVisibleTreesGrid = (grid) => {
  let count = 0;
  for(const row of grid) {
    for(const ele of row) {
      count += ele;
    }
  }

  return count;
}

const wasOutOfBounds = (gridSize, key) => {
  return key === -1 || key === gridSize;
}

const getScenicScore = (grid, i, j) => {
  const gridSize = grid.length;
  const currHeight = grid[i][j];
  let scores = [];
  
  // Up
  let m = 0;
  for(m = i-1; m >= 0; m--) {
    if(grid[m][j] >= currHeight)
      break;
  }
  if(wasOutOfBounds(gridSize, m)) 
    m++;

  scores.push(Math.abs(i-m));

  // Down
  m = 0;
  for(m = i+1; m < grid.length; m++) {
    if(grid[m][j] >= currHeight)
      break;
  }
  if(wasOutOfBounds(gridSize, m)) 
    m--;

  scores.push(Math.abs(i-m));

  // Left
  let n = 0;
  for(n = j-1; n >= 0; n--) {
    if(grid[i][n] >= currHeight)
      break;
  }
  if(wasOutOfBounds(gridSize, n)) 
    n++;

  scores.push(Math.abs(j-n));

  // Right
  n = 0;
  for(n = j+1; n < grid.length; n++) {
    if(grid[i][n] >= currHeight) 
      break;
  }
  if(wasOutOfBounds(gridSize, n)) 
    n--;

  scores.push(Math.abs(j-n));

  return scores.reduce((prev, curr) => prev*curr);
}

const getScenicScoreGrid = (grid) => {
  const scenicGrid = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(0));

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      scenicGrid[i][j] = getScenicScore(grid, i, j);
    }
  }

  return scenicGrid;
}

const getHighestScenicScore = (grid) => {
  let highest = -Infinity;

  for(const row of grid) {
    for(const ele of row) {
      highest = Math.max(highest, ele);
    }
  }

  return highest;
}

const solve = (data) => {
  // Solution here
  const scenicGrid = getScenicScoreGrid(data);
  const highestScore = getHighestScenicScore(scenicGrid);

  return highestScore;
}

const result = solve(data);
console.log(result)

// Part 
/*
const solve = (data) => {
  // Solution here
  const visibiltyGrid = getTreeVisibilityGrid(data);
  const treeCount = countVisibleTreesGrid(visibiltyGrid);
  
  return treeCount;
}
*/