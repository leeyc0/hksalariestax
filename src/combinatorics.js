"use strict";

function* distinglishableBallInBoxes(balls, numberOfBoxes) {
  var counter=0;
  var numberOfBalls = balls.length;
  var maxCounter = numberOfBoxes**numberOfBalls;
  
  while (counter < maxCounter) {
    let box = new Array(numberOfBoxes);
    for (let i=0; i<numberOfBoxes; i++) {
      box[i] = [];
    }
    for (let i=0; i<numberOfBalls; i++) {
      let ballInBox;
      ballInBox = (Math.floor(counter / (numberOfBoxes**i))) % numberOfBoxes;
      box[ballInBox].unshift(balls[numberOfBalls-1-i]);
    }
    counter++;
    yield box;
  }
}

function* indistinglishableBallInBoxes(numberOfBalls, numberOfBoxes) {
  let i=0;
  let j=0;
  let box = new Array(numberOfBoxes);
  box[0] = numberOfBalls;
  for (let i=1; i<numberOfBoxes; i++) {
    box[i] = 0;
  }
  
  i=0;
  j=0;
  while (true) {
    yield box;
    if (box[numberOfBoxes-1] === numberOfBalls) {
      break;
    }
    if (j === numberOfBoxes-1) {
      do {
        j--;
      } while (box[j] === 0);
      if (i === j) {
        box[i]--;
        i++;
        j=i;
        box[i] = box[numberOfBoxes-1] + 1;
        if (i !== numberOfBoxes-1) {
          box[numberOfBoxes-1] = 0;
        }
      } else {
        box[j]--;
        j++;
        box[j] = box[numberOfBoxes-1] + 1;
        if (j !== numberOfBoxes-1) {
          box[numberOfBoxes-1] = 0;
        }
      }
    } else {
      box[j]--;
      j++;
      box[j]++;
    }
  }
}

var a = [1,2,3];
var numberOfBoxes = 3;



for (var i of distinglishableBallInBoxes(a, numberOfBoxes)) {
  for (var j of indistinglishableBallInBoxes(1, numberOfBoxes)) {
    for (var k of indistinglishableBallInBoxes(1, numberOfBoxes)) {
      console.log(i,j,k);
    }
  }
}

/*for (let i of indistinglishableBallInBoxes(4, 4)) {
  console.log(i);
}*/