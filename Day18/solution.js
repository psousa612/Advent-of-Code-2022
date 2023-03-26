const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
// data = rawInput.split('\n'); //One file row = one string array element
// data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
data = rawInput.split('\n').map((row) => row.split(',').map(ele => parseInt(ele)));
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
// data = rawInput //No simple parsing

// console.log(data);

const formKey = (x, y, z) => {
  // console.log(x, y, z)
  return x + "," + y + "," + z;
}


// const countFreeSides = (grid, x, y, z) => {
//   let res = [];
//   // console.log(typeof z)
//   res.push(grid.has(formKey(x+1, y, z)));
//   res.push(grid.has(formKey(x-1, y, z)));
//   res.push(grid.has(formKey(x, y+1, z)));
//   res.push(grid.has(formKey(x, y-1, z)));
//   res.push(grid.has(formKey(x, y, z+1)));
//   res.push(grid.has(formKey(x, y, z-1)));
//   console.log(res)
//   return res.reduce((prev, curr) => prev + (curr ? 0 : 1), 0);
// }



// const countFreeSideInGrid = (grid) => {
  //   let count = 0;
  
  //   for(const row of grid.values()) {
    //     const [x, y, z] = row.split(",").map(ele => parseInt(ele))
    //     console.log(x,y,z)
    //     count += countFreeSides(grid, x, y, z);  
    //     // console.log("count", countFreeSides(grid, x,y,z))
    //   }
    
    //   return count;
    // }

const parseData = (data, size = 10) => {
  const arr = new Array(size).fill().map(() => new Array(size).fill().map(() => new Array(size).fill(false)));
  for(const [x, y, z] of data) {
    arr[x][y][z] = true;
  }
  
  return arr;
}

const countFreeSidesDFS = (grid, x, y, z, size = 10, visited) => {
  if(x < 0 || x >= size || y < 0 || y >= size || z < 0 || z >= size) {
    return 0;
  } else if(grid[x][y][z] == false) {
    // we are in a air block
    return 1;
  } else if(visited.has(formKey(x,y,z))) {
    return 0;
  }

  visited.add(formKey(x,y,z));
  let sum = 0;

  sum += countFreeSidesDFS(grid, x+1, y, z, size, visited);
  sum += countFreeSidesDFS(grid, x-1, y, z, size, visited);
  sum += countFreeSidesDFS(grid, x, y+1, z, size, visited);
  sum += countFreeSidesDFS(grid, x, y-1, z, size, visited);
  sum += countFreeSidesDFS(grid, x, y, z+1, size, visited);
  sum += countFreeSidesDFS(grid, x, y, z-1, size, visited);

  return sum;
}

const solve = (data) => {
  // Solution here
  const cube = parseData(data, 100);
  const [x,y,z] = data[0];
  const count = countFreeSidesDFS(cube, x, y, z, 100, new Set());
  return count;
}

const result = solve(data);
console.log(result)