// Global variables
const gridContainer = document.querySelector('.grid-container')

let numColumns = 8
let numRows = 8

let score = 0

// Direction variable. Value can be 0, 1, -1
let direction = {
  column: 1, // moving Down the column
  row: 0 // not moving R or L
}

// Create a grid of squares with class for column and row
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numColumns; j++) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.classList.add(`r${i}c${j}`) // Class name that contains row and column location information
    square.innerText = `r${i}c${j}` // Display class as inner text for check
    gridContainer.append(square)
  }
}

// Create Snake class
// snake object needs:
// array of current locations
// 0th index is snake head, so where we move from
// current direction
class Snake {
  constructor(initialPosition, directionCurrent) {
    this.position = initialPosition
    this.direction = directionCurrent
  }
  // Change direction based on arrow key presses
  changeDirection(e) {
    if (e.key === 'ArrowDown') {
      direction = { row: 1, column: 0 }
    } else if (e.key === 'ArrowUp') {
      direction = { row: -1, column: 0 }
    } else if (e.key === 'ArrowLeft') {
      direction = { row: 0, column: -1 }
    } else if (e.key === 'ArrowRight') {
      direction = { row: 0, column: 1 }
    }
    // this.move() // allows movement on arrow key presses
  }
  // snake move() method needs:
  // argument of direction
  // snake head location
  // adds another index to snake location, in direction that is passed through
  move() {
    let head = barry.position[0]
    // Update snake position based on direction (currently no time component)
    let newPosition = {
      row: head.row + direction.row,
      column: head.column + direction.column
    }
    // If barry head hits himself,
    // Run gameOver function
    if (
      barry.position.some(
        (element) =>
          element.row === newPosition.row &&
          element.column === newPosition.column
      )
    ) {
      console.log(barry.position)
      console.log(head)
      this.gameOver()
    }
    barry.position.unshift(newPosition) // Add new position
    if (
      // if head intersects target, do not remove end of snake
      barry.position[0].row === target.row &&
      barry.position[0].column === target.column
    ) {
      this.intersectTarget()
    } else {
      // otherwise, remove end of snake
      let shorten = barry.position.pop()
      document
        .querySelector(`.r${shorten.row}c${shorten.column}`)
        .classList.remove('snake-current')
    }
    if (
      // If barry is inside the edge of gameboard
      barry.position[0].row >= 0 &&
      barry.position[0].row < numRows &&
      barry.position[0].column >= 0 &&
      barry.position[0].column < numColumns
    ) {
      // Flip CSS style of new head position
      document
        .querySelector(`.r${barry.position[0].row}c${barry.position[0].column}`)
        .classList.add('snake-current')
    } else {
      // If barry is outside the gameboard, run gameOver function
      this.gameOver()
    }
  }
  intersectTarget() {
    score += 10
    document.querySelector('.target-current').classList.remove('target-current')
    target = targetLocate()
  }
  gameOver() {
    console.log('uh oh GAME OVERRRRR')
    document.removeEventListener('keydown', logKey)
    clearInterval(interval)
  }
}

// Instance of Snake
const barry = new Snake(
  [
    { row: 1, column: 3 },
    { row: 1, column: 2 },
    { row: 1, column: 1 }
  ],
  direction
)
// Test: placing initial barry on the page
for (let i = 0; i < barry.position.length; i++) {
  let snakey = document.querySelector(
    `.r${barry.position[i].row}c${barry.position[i].column}`
  )
  snakey.classList.add('snake-current')
}

// Random targets that are not on the snake's current locations
const targetLocate = () => {
  let randColumn = Math.floor(Math.random() * numColumns)
  let randRow = Math.floor(Math.random() * numRows)
  if (
    barry.position.some(
      (element) => element.row === randRow && element.column === randColumn
    )
  ) {
    console.log(barry.position)
    console.log({ row: randRow, column: randColumn })
    console.log('retry')
    return targetLocate()
  } else {
    document
      .querySelector(`.r${randRow}c${randColumn}`)
      .classList.add('target-current')
    return { row: randRow, column: randColumn }
  }
}
let target = targetLocate()

// Time delay loop
let interval = setInterval(() => barry.move(), 1000)
// console.log(interval)

// Event listeners
// if currently direction.column is 0, motion is along the row
// Turn on event listeners to up/down arrow keys
// Up sets direction = {column: -1, row: 0}
// Down sets direction = {column: 1, row: 0}
// if currently direction.row is 0, motion is along the column
// Turn on event listeners to right/left arrow keys
// Right sets direction = {column: 0, row: 1}
// Left sets direction = {column: 0, row: -1}

// Test: logging key presses
const logKey = (e) => {
  barry.changeDirection(e)
}
document.addEventListener('keydown', logKey)
