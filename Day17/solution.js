const fs = require('fs');
const INPUT_FILE_NAME = 'input.txt';

let rawInput;

rawInput = fs.readFileSync(`./${INPUT_FILE_NAME}`, 'utf8');

// Simple parsing options
// data = rawInput.split('\n'); //One file row = one string array element
// data = rawInput.split('\n').map(row => parseInt(row)); //One file row = one int array element
// data = rawInput.split('\n').map((row) => row.split(',')); //File = 2d array (string)
// data = rawInput.split('\n').map(row => row.split(',').map(ele => parseInt(ele))); //File = 2d array (int)
data = rawInput //No simple parsing

// console.log(data);

const parseData = (data) => {
  const arr = [];
  for(const char of data) {
    if(char == '<') {
      arr.push(-1);
    } else {
      arr.push(1);
    }
  }

  return arr;
}

const rocks = [
  {shape: "####", width: 4, height: 1},
  {shape: ".#.\n###\n.#.", width: 3, height: 3},
  {shape: "###\n..#\n..#", width: 3, height: 3},
  {shape: "#\n#\n#\n#", width: 1, height: 4},
  {shape: "##\n##", width: 2, height: 2}
]

for(const rock of rocks) {
  rock.arr = rock.shape.split("\n").map(row => {
    const newRow = [".", ".", ...row.split("")]
    while(newRow.length < 7) newRow.push(".")
    return newRow
  })
}

const printCave = (cave) => {
  for(let i = cave.length-1; i >= 0; i--) {
    console.log(...cave[i]);
  }

  console.log()
}

const canRockShift = (cave, shift, rockY, rockHeight) => {
  // for(let j = rockY; j > rockY-rockHeight; j--) {
  for(let j = 0; j < cave.length; j++) {
    const row = cave[j];
    for(let i = 0; i < 7; i++) {
      if(row[i] == '.' || row[i] == '@') continue;

      if(row[i] == '#' && (i+shift >= 0 && i+shift < 7) && (row[i+shift] == '.' || row[i+shift] == '#'))
        continue;
      // console.log(i, j)
      return false;
    }
  }

  return true;
}

const canRockFall = (cave, shift, rockY, rockHeight) => {
  // console.log("before")
  // printCave(cave)

  if(rockY-rockHeight < 0) return false
  // console.log("height", rockY, rockHeight)

  // for(let j = rockY-rockHeight; j <= rockY; j++) {
  for(let j = 0; j < cave.length; j++) {
    // const row = cave[j];
    // if(j == 0) return false
    for(let i = 0; i < 7; i++) {
      // console.log(j, i)
      if(cave[j][i] == '.' || cave[j][i] == '@') continue;
      // if(j-shift >= 0 && cave[j-shift][i] == '@') return false
      if(cave[j][i] == '#' && (j-shift >= 0) && (cave[j-shift][i] == '.' || cave[j-shift][i] == '#')) 
        continue;
      // console.log(i, j)
      // console.log("yaaa", j)
      // console.log("cant fall cause", j, i, cave[j][i])
      // printCave(cave)
      // console.log(";;;")
      return false;
    }
  }

  return true;
}

const shiftRock = (cave, shift, rockY, rockHeight) => {
  for(let j = rockY; j > rockY-rockHeight; j--) {
    const row = cave[j];

    if(shift > 0) {
      // Shifting to the right
      // Scan right to left
      for(let i = 6; i >= 0; i--) {
        if(cave[j][i] == '#') {
          [cave[j][i], cave[j][i+shift]] = [cave[j][i+shift], cave[j][i]];
        }
      }
    } else {
      // Shifting to the left
      // Scan left to right
      for(let i = 0; i < 7; i++) {
        if(cave[j][i] == '#') {
          [cave[j][i], cave[j][i+shift]] = [cave[j][i+shift], cave[j][i]];
        }
      }
    }


  }
}

const dropRock = (cave, shift, rockY, rockHeight) => {
  
  // for(let j = rockY; j > rockY-rockHeight; j--) {
    // for(let j = rockY-rockHeight; j <= rockY; j++) {
    for(let j = 0; j < cave.length; j++) {
      // const row = cave[j];
      for(let i = 0; i < 7; i++) {
        if(cave[j][i] == '#') {
          [cave[j][i], cave[j-shift][i]] = [cave[j-shift][i], cave[j][i]];
        }
      }
    }
    
    // console.log("after")
    // printCave(cave)
}

const solidifyRock = (cave, rockY, rockHeight) => {
  for(let j = rockY; j > rockY-rockHeight; j--) {
    // const row = cave[j];
      for(let i = 0; i < 7; i++) {
        if(cave[j][i] == '#') cave[j][i] = '@'
      }
  }
}

const copyArr = (arr) => {
  const newArr = [];
  for(let i = 0; i < arr.length; i++) {
    const row = [];
    for(let j = 0; j < arr[i].length; j++) {
      row.push(arr[i][j]);
    }
    newArr.push(row);
  }

  return newArr;
}

const trimCave = (cave) => {
  for(let i = cave.length-1; i >= 0; i--) {
    if(cave[i].find(ele => ele != '.')) {
      continue;
    }

    cave.pop();
  }
}

const runSimulation = (jetPattern, numRocks) => {
  let jetIndex = 0, rockIndex = 0;
  let maxHeight = 0;

  const cave = new Array(3).fill().map(() => new Array(7).fill("."));
  

  for(let rockCount = 0; rockCount < numRocks; rockCount++) {
    console.log("Rack #", rockCount)
    // Spawn rock
    const rock = rocks[rockIndex];
    rockIndex = (rockIndex+1)%rocks.length;

    const rockShape = copyArr(rock.arr);
    // console.log("adding", ...rockShape)
    cave.push(...rockShape)
    // printCave(cave)

    let rockX = 2, rockY = cave.length-1;
    // console.log(rockX, rockY)

    // let test = 1;
    // console.log(canRockShift(cave, test, rockY, rock.height));
    // console.log(canRockFall(cave, 1, rockY, rock.height))
    // shiftRock(cave, test, rockY, rock.height)
    // dropRock(cave, test, rockY, rock.height)
    // printCave(cave)
    // Fall Rocks
    while(true) {
      // Push by jets first
      if(canRockShift(cave, jetPattern[jetIndex], rockY, rock.height)) {
        shiftRock(cave, jetPattern[jetIndex], rockY, rock.height);
        rockX += jetPattern[jetIndex];
      }
      jetIndex = (jetIndex+1)%jetPattern.length;
      
      // console.log(rockCount, rockY, rock.height)

      if(canRockFall(cave, 1, rockY, rock.height)) {
        // console.log("yesy")
        dropRock(cave, 1, rockY, rock.height)
        rockY--;
      } else {
        // console.log("done")
        solidifyRock(cave, rockY, rock.height)
        // printCave(cave)
        // console.log("------------------")
        trimCave(cave) // need to trim cave
        cave.push(...new Array(3).fill().map(() => new Array(7).fill('.')))
        break;
      }

      // printCave(cave)
    }
    
    // printCave(cave)
    // console.log()

    // break
  }

  // printCave(cave)
  return cave;
}

const solve = (data) => {
  // Solution here
  const info = parseData(data);
  // const cave = runSimulation(info, 2022);
  // const cave = runSimulation(info, 1000000000000);
  const cave = runSimulation(info, info.length*5);
  
  trimCave(cave)
  // printCave(cave);
  // return cave.length*(2022/(info.length*5));
  return cave.length
  // might have to add 1 to height (0 index)
  // console.log(rocks[1])
}

const result = solve(data);
console.log(result)