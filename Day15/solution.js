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

let minX = Infinity, minY = Infinity;
let maxX = -Infinity, maxY = -Infinity;

const parseData = (data) => {
  const info = [];

  for(const row of data) {
    const [sensor, beacon] = row.split(":");

    let [sensorX, sensorY] = sensor.split(",");
    let [beaconX, beaconY] = beacon.split(",");

    sensorX = parseInt(sensorX.substring(sensorX.indexOf("x=") + 2));
    sensorY = parseInt(sensorY.substring(sensorY.indexOf("y=") + 2));

    beaconX = parseInt(beaconX.substring(beaconX.indexOf("x=") + 2));
    beaconY = parseInt(beaconY.substring(beaconY.indexOf("y=") + 2));
    
    minX = Math.min(minX, sensorX, beaconX);
    minY = Math.min(minY, sensorY, beaconY);
    
    maxX = Math.max(maxX, sensorX, beaconX);
    maxY = Math.max(maxY, sensorY, beaconY);

    info.push([[sensorX, sensorY], [beaconX, beaconY]]);
  }

  return info;
}

const generateSensorMap = (info) => {
  const map = new Map();

  for(const [sensor, beacon] of info) {

    const sensorExcludedRange = calculateManhattanDistance(...sensor, ...beacon);
    map.set(sensor, sensorExcludedRange);
  }
  
  return map;
}

const generateBeaconMap = (info) => {
  const map = new Map();

  for(const [sensor, beacon] of info) {
    const [beaconX, beaconY] = beacon;

    if(map.has(beaconX)) {
      const row = map.get(beaconX);

      if(row.includes(beaconY)) continue;

      row.push(beaconY);
      map.set(beaconX, row);
    } else {
      map.set(beaconX, [beaconY]);
    }
  }

  return map;
}

const calculateManhattanDistance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const isCoveredBySensor = (x1, y1, sensor, beacon) => {
  const sensorExcludedRange = calculateManhattanDistance(...sensor, ...beacon);
  const sensorToPoint = calculateManhattanDistance(...sensor, x1, y1);
  return sensorToPoint <= sensorExcludedRange;
}

const canBeaconExist = (info, x, y) => {
  for(const [sensor, beacon] of info) {
    const [sensorX, sensorY] = sensor;    
    const [beaconX, beaconY] = beacon;

    if(x == sensorX && y == sensorY) return false;
    if(x == beaconX && y == beaconY) return false;

    if(isCoveredBySensor(x, y, sensor, beacon)) return false;
  }

  return true;
}

const countNoBeaconSpots = (info, y = 10, padding = 10) => {
  let count = 0;

  for(let i = minX-padding; i < maxX+padding; i++) {
    if(!canBeaconExist(info, i, y)) count++;
  }

  return count;
}

const isCoveredBySensorMap = (sensorMap, x, y) => {
  for(const [sensor, coverageRange] of sensorMap.entries()) {
    const toPointDistance = calculateManhattanDistance(...sensor, x, y);

    if(toPointDistance <= coverageRange) return true;
  }

  return false;
}

const isBeacon = (beaconMap, x, y) => {
  return beaconMap.has(x) && beaconMap.get(x).includes(y);
}

const findBeaconFrequencyInRadius = (sensorMap, beaconMap, radius) => {
  let beaconX, beaconY;
  for(let i = 0; i <= radius; i++) {
    for(let j = 0; j <= radius; j++) {

      if(!isCoveredBySensorMap(sensorMap, i, j) && !isBeacon(beaconMap, i, j)) {
        beaconX = i;
        beaconY = j;
        console.log(beaconX, beaconY)
        return (i * 4000000) + j;
      }
    }
  }

  return -1;
}

const addCoord = (map, x, y) => {
  if(map.has(x)) {
    const row = map.get(x);
    row.add(y);
    map.set(x, row);
  } else {
    const row = new Set();
    row.add(y);
    map.set(x, row);
  }
}

const isCoveredBySensorDistance = (x, y, sensX, sensY, distance) => {
  const pointDistance = calculateManhattanDistance(x, y, sensX, sensY);

  return pointDistance <= distance;
}

const generateBlockedMap = (sensorMap, beaconMap) => {
  const map = new Map();

  for(const [x, row] of beaconMap.entries()) {
    for(const y of row) {
      addCoord(map, x, y);
    }
  }

  for(const [[x, y], radius] of sensorMap.entries()) {
    for(let i = x-radius; i < x+radius; i++) {
      for(let j = y-radius; j < y+radius; j++) {
        if(isCoveredBySensorDistance(i, j, x, y, radius)) {
          addCoord(map, i, j);
        }
      }
    }
  }

  return map;

}

const canBeaconExistMap = (x, y, sensorMap, beaconMap) => {
  if(beaconMap.has(x) && beaconMap.get(x).includes(y)) return false;

  for(const [sensor, range] of sensorMap.entries()) {
    const pointDistance = calculateManhattanDistance(...sensor, x, y);

    if(sensor[0] == x && sensor[1] == y) return false;
    if(pointDistance <= range) return false;
  }

  return true;
}

const isWithinRadius = (val, radius) => {
  return val >= 0 && val <= radius;
}

const findBeaconAlongLine = (startX, startY, xMod, yMod, xCond, yCond, sensorMap, beaconMap, radius) => {
  let x = startX, y = startY;
  while(x !== xCond && y !== yCond) {

    if(isWithinRadius(x, radius) && isWithinRadius(y, radius) && canBeaconExistMap(x, y, sensorMap, beaconMap)) return [x, y];
    if(isWithinRadius(x+1, radius) && isWithinRadius(y, radius) && canBeaconExistMap(x+1, y, sensorMap, beaconMap)) return [x+1, y];
    if(isWithinRadius(x-1, radius) && isWithinRadius(y, radius) && canBeaconExistMap(x-1, y, sensorMap, beaconMap)) return [x-1, y];
    if(isWithinRadius(x, radius) && isWithinRadius(y+1, radius) && canBeaconExistMap(x, y+1, sensorMap, beaconMap)) return [x, y+1];
    if(isWithinRadius(x, radius) && isWithinRadius(y-1, radius) && canBeaconExistMap(x, y-1, sensorMap, beaconMap)) return [x, y-1];

    x += xMod;
    y += yMod;
  }

  return undefined;
}

const findValidBeaconSpaceOnPerimeter = (sensorMap, beaconMap, radius) => {
  for(const [[x, y], range] of sensorMap.entries()) {
    let res = [];
    
    res.push(findBeaconAlongLine(x, y-range, -1, 1, x-range, y, sensorMap, beaconMap, radius));
    res.push(findBeaconAlongLine(x-range, y, 1, 1, x, y+range, sensorMap, beaconMap, radius));
    res.push(findBeaconAlongLine(x, y+range, 1, -1, x+range, y, sensorMap, beaconMap, radius));
    res.push(findBeaconAlongLine(x+range, y, -1, -1, x, y-range, sensorMap, beaconMap, radius));
    
    const beacon = res.find(ele => ele != undefined);
    if(beacon != undefined) return beacon;
  }

  return undefined;
}

const calculateTuningFrequency = (beacon) => {
  return (beacon[0] * 4000000) + beacon[1];
}

const solve = (data) => {
  // Solution here
  const info = parseData(data);
  const sensorMap = generateSensorMap(info);
  const beaconMap = generateBeaconMap(info);
  
  const beacon = findValidBeaconSpaceOnPerimeter(sensorMap, beaconMap, 4000000);
  console.log("Beacon:", beacon);

  const tuningFrequency = calculateTuningFrequency(beacon);
  return tuningFrequency;
}

const result = solve(data);
console.log(result)

// Part 1
/*
const solve = (data) => {
  // Solution here
  const info = parseData(data);
  const count = countNoBeaconSpots(info, 2000000, 6000000);
  return count;
}
*/