'use strict'

function * distinglishableBallInBoxes (balls, boxes) {
  let counter = 0
  const numberOfBalls = balls.length
  const numberOfBoxes = boxes.length
  const maxCounter = numberOfBoxes ** numberOfBalls
  while (counter < maxCounter) {
    const boxOutput = new Map()
    for (const box of boxes) {
      boxOutput.set(box, [])
    }
    for (let i = 0; i < numberOfBalls; i++) {
      const digit = (Math.floor(counter / (numberOfBoxes ** i))) % numberOfBoxes
      const ballInBox = boxes[digit]
      boxOutput.get(ballInBox).unshift(balls[numberOfBalls - 1 - i])
    }
    counter++
    yield boxOutput
  }
}

function * indistinglishableBallInBoxes (numberOfBalls, boxes) {
  let i = 0
  let j = 0
  const numberOfBoxes = boxes.length
  const boxOutput = new Map()

  for (const box of boxes) {
    boxOutput.set(box, 0)
  }
  boxOutput.set(boxes[0], numberOfBalls)

  while (true) {
    yield boxOutput
    if (boxOutput.get(boxes[numberOfBoxes - 1]) === numberOfBalls) {
      break
    }
    if (j === numberOfBoxes - 1) {
      do {
        j--
      } while (boxOutput.get(boxes[j]) === 0)
      if (i === j) {
        boxOutput.set(boxes[i], boxOutput.get(boxes[i]) - 1)
        i++
        j = i
        boxOutput.set(boxes[i], boxOutput.get(boxes[numberOfBoxes - 1]) + 1)
        if (i !== numberOfBoxes - 1) {
          boxOutput.set(boxes[numberOfBoxes - 1], 0)
        }
      } else {
        boxOutput.set(boxes[j], boxOutput.get(boxes[j]) - 1)
        j++
        boxOutput.set(boxes[j], boxOutput.get(boxes[numberOfBoxes - 1]) + 1)
        if (j !== numberOfBoxes - 1) {
          boxOutput.set(boxes[numberOfBoxes - 1], 0)
        }
      }
    } else {
      boxOutput.set(boxes[j], boxOutput.get(boxes[j]) - 1)
      j++
      boxOutput.set(boxes[j], boxOutput.get(boxes[j]) + 1)
    }
  }
}

export default {
  distinglishableBallInBoxes,
  indistinglishableBallInBoxes
}
