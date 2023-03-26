const fs = require('fs');
const { exit } = require('process');
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
  const info = [];

  for(const row of data) {
    const node = {};

    node.id = row.substring(row.indexOf(" ")+1, row.indexOf(" ") + 3);
    node.flowRate = parseInt(row.substring(row.indexOf("=")+1, row.indexOf(";")));
    node.neighborIds = row.substring(row.indexOf(" ", row.lastIndexOf("valve")) + 1).split(", ");

    info.push(node);
  }

  return info;
}

const generateNetwork = (info) => {
  const map = new Map();

  // First pass - creating proper node objects into map
  for(const nodeInfo of info) {
    const node = {};

    node.id = nodeInfo.id;
    node.flowRate = nodeInfo.flowRate == 0 ? -Infinity : nodeInfo.flowRate;
    node.isOpen = false;

    map.set(node.id, node);
  }

  // Second pass - build the connected objects
  for(const nodeInfo of info) {
    const neighbors = [];
    // const neighorIds = [];

    for(const neighborId of nodeInfo.neighborIds) {
      neighbors.push(map.get(neighborId));
      // neighborIds.push(neighborId);
    }

    map.get(nodeInfo.id).neighbors = neighbors;
    // map.get(nodeInfo.id).neighborIds = neighorIds;
  }

  return map;
}

const findShortestDistance = (node1, node2) => {
  // BFS
  const queue = [];
  queue.push(node1);

  let distance = 0, levelSize = 1;
  while(queue.length > 0) {
    const currNode = queue.shift();
    if(currNode.id == node2.id) return distance;

    for(const neighborNode of currNode.neighbors) {
      queue.push(neighborNode);
    }

    levelSize--;
    if(levelSize == 0) {
      levelSize = queue.length;
      distance++;
    }
  }

}

const generateDistances = (network) => {
  // Add distance to each node from current node
  // Distance = number of hops

  for(const node of network.values()) {
    const distanceMap = new Map();
    for(const otherNode of network.values()) {
      if(node.id == otherNode.id) {
        distanceMap.set(otherNode.id, -Infinity);
        continue;
      }
      
      const distance = findShortestDistance(node, otherNode);
      distanceMap.set(otherNode.id, distance);
    }

    node.distances = distanceMap;
  }
}

const sortFlowRateRanking = (valves) => {
  const map = new Map();
  
  valves.sort((a,b) => b[1] - a[1]);
  // console.log(valves)

  let ranking = 1, prevFlow = -1;
  for(const [nodeId, currFlow, currDistance] of valves) {
    if(prevFlow == currFlow) {
      map.set(nodeId, ranking-1);
      continue;
    }

    prevFlow = currFlow;
    map.set(nodeId, ranking);
    ranking++;
  }

  return map;
}

const sortDistanceRanking = (valves) => {

  const map = new Map();
  
  valves.sort((a,b) => a[2] - b[2]);
  // console.log(valves)

  let ranking = 1, prevDistance = -1;
  for(const [nodeId, currFlow, currDistance] of valves) {
    if(prevDistance == currDistance) {
      map.set(nodeId, ranking-1);
      continue;
    }
    
    prevDistance = currDistance
    map.set(nodeId, ranking);
    ranking++;
  }

  return map;
}

const calculateScores = (flowMap, distanceMap) => {
  const scores = [];
  
  // for(let i = 1; i <= flowArray.length; i++) {
  //   const flowRow = flowArray[i-1];
  //   const flowRanking = i;

  //   const nodeId = flowRow[0];
  //   const distanceRanking = distanceArray.findIndex(row => row[0] == nodeId) + 1;

  //   const avg = ((flowRanking) + (distanceRanking)) / 2;
  //   scores.push([nodeId, avg]);
  // }
  for(const [nodeId, flowRank] of flowMap.entries()) {
    const distanceRank = distanceMap.get(nodeId);

    const score = ((flowRank) + (2*distanceRank)) / 2;
    scores.push([nodeId, score]);
  }


  scores.sort((a,b) => a[1] - b[1]);
  return scores;
}

const findOptimalNextValve = (network, node) => {
  const valveRanking = [];
  for(const [otherNodeId, distance] of node.distances.entries()) {
    const otherNode = network.get(otherNodeId);
    // console.log(otherNode, distance)
    if(otherNode.isOpen || otherNodeId == node.id || otherNode.flowRate == -Infinity) {
      valveRanking.push([otherNode.id, -Infinity, Infinity]);
      continue;
    }

    // const valveValue = ((otherNode.flowRate) / (distance)) + (distance)
    // const valveValue = (otherNode.flowRate) / (distance*5)
    // const valveValue = (otherNode.flowRate + distance)  / (otherNode.flowRate * distance)
    // const valveValue = (Math.log(otherNode.flowRate)) + 2*(1 / distance)
    // const valveValue = Math.sqrt(Math.abs(otherNode.flowRate)) - distance
    // const valveValue = distance * 5
    valveRanking.push([otherNodeId, otherNode.flowRate, distance]);
  }
  // console.log(valveRanking)
  // valveRanking.sort((a,b) => b[1] - a[1]);

  const flowRanking = sortFlowRateRanking([...valveRanking]);
  const distanceRanking = sortDistanceRanking([...valveRanking]);
  const scores = calculateScores(flowRanking, distanceRanking);
  // console.log(flowRanking)
  // console.log(distanceRanking)
  console.log(scores)


  // return scores[0];
}

const copyMapDeep = (map) => {
  const newMap = new Map();
  for(const [key, val] of map.entries()) {
    const newVal = {...val};
    newMap.set(key, newVal);
  }

  return newMap;
}

const findMostPressureReleasedDP = (currNode, network, flowTotal, timeRemaining, memo) => {
  if(timeRemaining == 0) return flowTotal;

  const memoKey = currNode.id + timeRemaining + "," + flowTotal;
  if(memoKey in memo) return memo[memoKey];
  
  
  timeRemaining--;
  if(currNode.flowRate != -Infinity) {
    flowTotal += currNode.flowRate*timeRemaining
  }
  
  currNode.isOpen = true;
  network.set(currNode.id, currNode);
  
  const res = [];
  for(const [nextNodeId, distance] of currNode.distances.entries()) {
    const nextNode = network.get(nextNodeId);
    if(distance == -Infinity || nextNode.isOpen || nextNode.flowRate == -Infinity) continue;
    if(timeRemaining-distance <= 0) continue;
    res.push(findMostPressureReleasedDP({...network.get(nextNodeId)}, copyMapDeep(network), flowTotal, timeRemaining-distance, memo));
  }
  
  if(res.length == 0) return flowTotal;
  const maxFlow = Math.max(...res);
  memo[memoKey] = maxFlow;
  return maxFlow
}

const findMostPressureReleased = (network, duration, startingNodeId) => {
  let memo = {}
  const res = [];

  let currNode = network.get(startingNodeId);

  for(const [nextNodeId, distance] of currNode.distances.entries()) {
    const nextNode = network.get(nextNodeId);
    if(distance == -Infinity || nextNode.isOpen || nextNode.flowRate == -Infinity) continue;
    res.push(findMostPressureReleasedDP({...network.get(nextNodeId)}, copyMapDeep(network), 0, duration-distance, memo));
  }
  
  return Math.max(...res)
}

const findMostPressureReleasedWithElephantDP = (personNode, elephantNode, network, flowTotal, personTimeRemaining, elephantTimeRemaining, memo) => {
  if(personTimeRemaining == 0 && elephantTimeRemaining == 0) return flowTotal

  if(personTimeRemaining < 0 || elephantTimeRemaining < 0) return 0;

  const memoKeyPrefix = personNode.id < elephantNode.id ? personNode.id + elephantNode.id : elephantNode.id + personNode.id;
  const memoKeySuffix = personTimeRemaining < elephantTimeRemaining ? personTimeRemaining + "|" + elephantTimeRemaining : elephantTimeRemaining + "|" + personTimeRemaining;
  const memoKey = memoKeyPrefix + "|" + memoKeySuffix + "|" + flowTotal;
  if(memoKey in memo) return memo[memoKey];
  
  // console.log(memoKey)
  
  personTimeRemaining--;
  // if(personNode.flowRate != -Infinity) {
  flowTotal += personNode.flowRate*personTimeRemaining
  
  
  personNode.isOpen = true;
  network.set(personNode.id, personNode);
  
  elephantTimeRemaining--;
  flowTotal += elephantNode.flowRate*elephantTimeRemaining
  
  elephantNode.isOpen = true;
  network.set(elephantNode.id, elephantNode);
  
  const res = [];
  for(const [nextPersonNodeId, distance1] of personNode.distances.entries()) {
    const nextPersonNode = network.get(nextPersonNodeId);
    if(distance1 == -Infinity || nextPersonNode.isOpen || nextPersonNode.flowRate == -Infinity) continue;
    // res.push(findMostPressureReleasedWithElephantDP({...network.get(nextNodeId)}, copyMapDeep(network), 0, duration-distance, memo));
    for(const [nextElephantNodeId, distance2] of elephantNode.distances.entries()) {
      
      const nextElephantNode = network.get(nextElephantNodeId);
      if(nextElephantNodeId == nextPersonNodeId || distance2 == -Infinity || nextElephantNode.isOpen || nextElephantNode.flowRate == -Infinity) continue;
      res.push(findMostPressureReleasedWithElephantDP({...network.get(personNode.id)}, {...network.get(nextElephantNodeId)}, copyMapDeep(network), flowTotal, personTimeRemaining-distance1, elephantTimeRemaining, memo));
      res.push(findMostPressureReleasedWithElephantDP({...network.get(nextPersonNodeId)}, {...network.get(elephantNode.id)}, copyMapDeep(network), flowTotal, personTimeRemaining, elephantTimeRemaining-distance2, memo));
    }
  }
  
  if(res.length == 0) {
    // console.log("YEAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")  
    // throw 'YEAAA'
    return flowTotal
  };
  const maxFlow = Math.max(...res);
  memo[memoKey] = maxFlow;
  return maxFlow
}

const findMostPressureReleasedWithElephant = (network, duration, startingNodeId) => {
  duration -= 4; // Teach the elephant time
  
  let memo = {}
  let topLevelMemo = {};
  const res = [];
  
  let personNode = {...network.get(startingNodeId)};
  let elephantNode = {...network.get(startingNodeId)};
  
  // res.push(findMostPressureReleasedWithElephantDP({...network}))
  for(const [nextPersonNodeId, distance1] of personNode.distances.entries()) {
    const nextPersonNode = network.get(nextPersonNodeId);
    if(distance1 == -Infinity || nextPersonNode.isOpen || nextPersonNode.flowRate == -Infinity) continue;
    // res.push(findMostPressureReleasedWithElephantDP({...network.get(nextNodeId)}, copyMapDeep(network), 0, duration-distance, memo));
    for(const [nextElephantNodeId, distance2] of elephantNode.distances.entries()) {
      const nextElephantNode = network.get(nextElephantNodeId);
      if(nextElephantNodeId == nextPersonNodeId || distance2 == -Infinity || nextElephantNode.isOpen || nextElephantNode.flowRate == -Infinity) continue;

      // const topLevelMemoKey = nextPersonNodeId < nextElephantNodeId ? nextPersonNodeId + nextElephantNodeId : nextElephantNodeId + nextPersonNodeId;
      // if(topLevelMemoKey in topLevelMemo) continue;
      
      // topLevelMemo[topLevelMemoKey] = true;
      console.log(nextPersonNodeId, nextElephantNodeId)
      res.push(findMostPressureReleasedWithElephantDP({...network.get(personNode.id)}, {...network.get(nextElephantNodeId)}, copyMapDeep(network), 0, duration, duration-distance2, memo));
      res.push(findMostPressureReleasedWithElephantDP({...network.get(nextPersonNodeId)}, {...network.get(elephantNode.id)}, copyMapDeep(network), 0, duration-distance1, duration, memo));
    }
  }
  console.log(res)
  return Math.max(...res)
}


const solve = (data) => {
  // Solution here
  const info = parseData(data);
  const network = generateNetwork(info);
  generateDistances(network);

  const mostRelease = findMostPressureReleasedWithElephant(network, 30, 'AA');
  return mostRelease;
}

const result = solve(data);
console.log(result)


//2557 - too low :()

// Part 1 
/*
const solve = (data) => {
  // Solution here
  const info = parseData(data);
  const network = generateNetwork(info);
  generateDistances(network);

  const mostRelease = findMostPressureReleased(network, 30, 'AA');
  return mostRelease;
}
*/