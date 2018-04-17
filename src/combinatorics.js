"use strict";

function* distinglishableBallInBoxes(balls, boxes) {
  let counter=0;
  let numberOfBalls = balls.length;
  let numberOfBoxes = boxes.length;
  let maxCounter = numberOfBoxes**numberOfBalls;
  while (counter < maxCounter) {
    let boxOutput = {};
    for (let box of boxes) {
      boxOutput[box] = [];
    }
    for (let i=0; i<numberOfBalls; i++) {
      let digit = (Math.floor(counter / (numberOfBoxes**i))) % numberOfBoxes;
      let ballInBox = boxes[digit];
      boxOutput[ballInBox].unshift(balls[numberOfBalls-1-i]);
    }
    counter++;
    yield boxOutput;
  }
}

function* indistinglishableBallInBoxes(numberOfBalls, boxes) {
  let i=0;
  let j=0;
  let numberOfBoxes = boxes.length;
  let boxOutput = {};
  for (let box of boxes) {
    boxOutput[box] = 0;
  }
  boxOutput[boxes[0]] = numberOfBalls;

  while (true) {
    yield boxOutput;
    if (boxOutput[boxes[numberOfBoxes-1]] === numberOfBalls) {
      break;
    }
    if (j === numberOfBoxes-1) {
      do {
        j--;
      } while (boxOutput[boxes[j]] === 0);
      if (i === j) {
        boxOutput[boxes[i]]--;
        i++;
        j=i;
        boxOutput[boxes[i]] = boxOutput[boxes[numberOfBoxes-1]] + 1;
        if (i !== numberOfBoxes-1) {
          boxOutput[boxes[numberOfBoxes-1]] = 0;
        }
      } else {
        boxOutput[boxes[j]]--;
        j++;
        boxOutput[boxes[j]] = boxOutput[boxes[numberOfBoxes-1]] + 1;
        if (j !== numberOfBoxes-1) {
          boxOutput[boxes[numberOfBoxes-1]] = 0;
        }
      }
    } else {
      boxOutput[boxes[j]]--;
      j++;
      boxOutput[boxes[j]]++;
    }
  }
}

export default {
  distinglishableBallInBoxes,
  indistinglishableBallInBoxes,
};
