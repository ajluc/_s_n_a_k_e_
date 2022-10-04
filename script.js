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
// NOT CURRENTLY IN USE

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
class Snake {
  constructor(initialPosition, directionCurrent) {
    this.position = initialPosition
    this.direction = directionCurrent
  }
  // snake move() method needs:
  // argument of direction
  // snake head location
  // adds another index to snake location, in direction that is passed through
  // MAKE THIS MORE DRY: swap out for direction object once time delay comes into play
  move(e) {
    let head = barry.position[0]
    if (e.key === 'ArrowDown') {
      let newPosition = { row: head.row + 1, column: head.column }
      barry.position.unshift(newPosition)
    } else if (e.key === 'ArrowUp') {
      let newPosition = { row: head.row - 1, column: head.column }
      barry.position.unshift(newPosition)
    } else if (e.key === 'ArrowLeft') {
      let newPosition = { row: head.row, column: head.column - 1 }
      barry.position.unshift(newPosition)
    } else if (e.key === 'ArrowRight') {
      let newPosition = { row: head.row, column: head.column + 1 }
      barry.position.unshift(newPosition)
    }
    if (
      barry.position[0].row === target.row &&
      barry.position[0].column === target.column
    ) {
      this.intersectTarget()
    } else {
      let shorten = barry.position.pop()
      document
        .querySelector(`.r${shorten.row}c${shorten.column}`)
        .classList.remove('snake-current')
    }
    document
      .querySelector(`.r${barry.position[0].row}c${barry.position[0].column}`)
      .classList.add('snake-current')
    console.log(barry.position[0])
    console.log(target)
  }
  intersectTarget() {
    score += 10
    document.querySelector('.target-current').classList.remove('target-current')
    target = targetLocate()
  }
}

// Test instance of Snake
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

// snake object needs:
// array of current locations
// 0th index is snake head, so where we move from
// current direction

// Random targets that are not currently on the snake
const targetLocate = () => {
  let randColumn = Math.floor(Math.random() * numColumns)
  let randRow = Math.floor(Math.random() * numRows)
  if (barry.position.includes({ row: randRow, column: randColumn })) {
    targetLocate()
  } else {
    document
      .querySelector(`.r${randRow}c${randColumn}`)
      .classList.add('target-current')
    return { row: randRow, column: randColumn }
  }
}
let target = targetLocate()

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
  barry.move(e)
  console.log(score)
}
document.addEventListener('keydown', logKey)
