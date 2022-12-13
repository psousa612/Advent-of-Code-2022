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
let startNode, endNode;

const convertLetterToElevation = (letter) => {
  if(letter == 'S') {
    return A_VALUE;
  } else if(letter == 'E') {
    return Z_VALUE;
  } else {
    return letter.toString().charCodeAt(0) - "a".charCodeAt(0);
  }
}

const getNodeHash = (node) => {
  return node.i + "," + node.j;
}

const coordsToNodeHash = (i, j) => {
  return i + "," + j;
}

const convertGrid = (data) => {
  const nodeHash = new Map();

  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data[i].length; j++) {
      const node = {};
      node.id = data[i][j];
      node.elevation = convertLetterToElevation(data[i][j]);
      node.i = i;
      node.j = j;
      node.destinations = [];
      node.visited = false;
      node.stepsToReach = Infinity;

      nodeHash.set(getNodeHash(node), node);

      if(node.id == 'S') startNode = node;
      if(node.id == 'E') endNode = node;
    }
  }

  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data[i].length; j++) {
      const node = nodeHash.get(coordsToNodeHash(i, j));
      let destinationNodeHash;

      destinationNodeHash = coordsToNodeHash(i+1, j);
      if(nodeHash.has(destinationNodeHash))
        node.destinations.push(nodeHash.get(destinationNodeHash));

      destinationNodeHash = coordsToNodeHash(i-1, j);
      if(nodeHash.has(destinationNodeHash))
        node.destinations.push(nodeHash.get(destinationNodeHash));

      destinationNodeHash = coordsToNodeHash(i, j+1);
      if(nodeHash.has(destinationNodeHash))
        node.destinations.push(nodeHash.get(destinationNodeHash));

      destinationNodeHash = coordsToNodeHash(i, j-1);
      if(nodeHash.has(destinationNodeHash))
        node.destinations.push(nodeHash.get(destinationNodeHash));
    }
  }

  return nodeHash;
}

const canTravel = (fromNode, toNode) => {
  return toNode.elevation <= fromNode.elevation + 1;
}

const bfs = (startingNode = startNode) => {
  const stack = [];
  let level = 0, levelSize = 1;
  let levelArr = [];
  stack.push(startingNode);

  while(stack.length > 0) {
    const currNode = stack.shift();

    while(currNode.destinations.length > 0) {
      const destination = currNode.destinations.pop();
      
      if(canTravel(currNode, destination)) {
        destination.visited = true;
        stack.push(destination);
      }
    }

    levelSize--;
    if(levelSize == 0) {
      levelSize = stack.length;
      level++;
      levelArr = [];
    }

    if(level < currNode.stepsToReach) currNode.stepsToReach = level;
    levelArr.push(currNode.id);
  }
}

const findScenicPath = (data) => {
  const options = [];

  for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data[i].length; j++) {
      if(data[i][j] == 'a' || data[i][j] == 'S') {
        const nodes = convertGrid(data);
        bfs(nodes.get(coordsToNodeHash(i, j)));
        options.push(endNode.stepsToReach);
      }
    }
  }

  options.sort();
  return options[0];
}


const solve = (data) => {
  // Solution here
  const shortestLength = findScenicPath(data);
  return shortestLength;
}

const result = solve(data);
console.log(result)

// Part 1 
/*
const solve = (data) => {
  // Solution here
  const nodes = convertGrid(data);
  bfs(nodes);

  return endNode;
}
*/