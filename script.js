// Global variables
const gridContainer = document.querySelector('.grid-container')
const scoreContainer = document.querySelector('.score')
const highScoreContainer = document.querySelector('.high-score')

let numColumns = 20
let numRows = 15

let score = 0
let highScore = 0

let speed = 100

let interval

// Direction variable. Value can be 0, 1, -1
let direction = {
  column: 1, // moving Down the column
  row: 0 // not moving R or L
}

// Create a grid of squares with class for column and row, add checkerboard pattern
let checker
for (let i = 0; i < numRows; i++) {
  if (i % 2) {
    checker = 0
  } else {
    checker = 1
  }
  for (let j = 0; j < numColumns; j++) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.classList.add(`r${i}c${j}`) // Class name that contains row and column location information
    // square.innerText = `r${i}c${j}` // Display class as inner text for check
    if (checker % 2) {
      square.classList.add('checker')
    }
    gridContainer.append(square)
    checker++
  }
}

// Create Snake class
// snake object needs:
// array of current locations
// 0th index is snake head, so where we move from
// current direction
class Snake {
  constructor(initialPosition, initialDirection) {
    this.position = initialPosition
    this.direction = initialDirection
  }
  // Place snake instance
  place() {
    for (let i = 0; i < this.position.length; i++) {
      let snakey = document.querySelector(
        `.r${this.position[i].row}c${this.position[i].column}`
      )
      snakey.classList.add('snake-current')
    }
  }
  // Change direction based on arrow key presses
  changeDirection(e) {
    if (direction.row) {
      if (e.key === 'ArrowLeft') {
        direction = { row: 0, column: -1 }
      } else if (e.key === 'ArrowRight') {
        direction = { row: 0, column: 1 }
      }
    } else if (direction.column) {
      if (e.key === 'ArrowDown') {
        direction = { row: 1, column: 0 }
      } else if (e.key === 'ArrowUp') {
        direction = { row: -1, column: 0 }
      }
    }
    // this.move() // allows movement on arrow key presses
  }
  // snake move() method needs:
  // argument of direction
  // snake head location
  // adds another index to snake location, in direction that is passed through
  move() {
    let head = this.position[0]
    // Update snake position based on direction (currently no time component)
    let newPosition = {
      row: head.row + direction.row,
      column: head.column + direction.column
    }
    // If barry head hits himself,
    // Run gameOver function
    if (
      this.position.some(
        (element) =>
          element.row === newPosition.row &&
          element.column === newPosition.column
      )
    ) {
      console.log(this.position)
      console.log(head)
      this.gameOver()
    }
    this.position.unshift(newPosition) // Add new position
    if (
      // if head intersects target, do not remove end of snake
      this.position[0].row === target.row &&
      this.position[0].column === target.column
    ) {
      this.intersectTarget()
    } else {
      // otherwise, remove end of snake
      let shorten = this.position.pop()
      document
        .querySelector(`.r${shorten.row}c${shorten.column}`)
        .classList.remove('snake-current')
    }
    if (
      // If barry is inside the edge of gameboard
      this.position[0].row >= 0 &&
      this.position[0].row < numRows &&
      this.position[0].column >= 0 &&
      this.position[0].column < numColumns
    ) {
      // Flip CSS style of new head position
      document
        .querySelector(`.r${this.position[0].row}c${this.position[0].column}`)
        .classList.add('snake-current')
    } else {
      // If barry is outside the gameboard, run gameOver function
      this.gameOver()
    }
  }
  intersectTarget() {
    score += 10
    scoreContainer.innerText = score
    document.querySelector('.target-current').classList.remove('target-current')
    target = targetLocate()
    if (score > highScore) {
      highScore = score
      highScoreContainer.innerText = highScore
    }
  }
  gameOver() {
    console.log('uh oh GAME OVERRRRR')
    document.removeEventListener('keydown', logKey)
    clearInterval(interval)
  }
  playAgain() {
    clearInterval(interval)
    score = 0
    scoreContainer.innerText = score
    let headlessSnake = this.position
    headlessSnake.shift()
    headlessSnake.forEach((element) => {
      console.log(element)
      document
        .querySelector(`.r${element.row}c${element.column}`)
        .classList.remove('snake-current')
    })
    document
      .querySelector(`.r${target.row}c${target.column}`)
      .classList.remove('target-current')
    this.position = [
      { row: 1, column: 3 },
      { row: 1, column: 2 },
      { row: 1, column: 1 }
    ]
    this.direction = {
      column: 1,
      row: 0
    }
    barry.place()
    target = targetLocate()
    interval = setInterval(() => barry.move(), speed) // keeps going endlessly
  }
}
const play = () => {
  interval = setInterval(() => barry.move(), speed)
}

// Instance (barry) of Snake
const barry = new Snake(
  [
    { row: 1, column: 3 },
    { row: 1, column: 2 },
    { row: 1, column: 1 }
  ],
  direction
)
// Placing initial barry on the page
barry.place()

// Random targets that are not on the snake's current locations
// Keep it DRY/not specific - how can I get barry out? do it as a method?
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
// let interval = setInterval(() => barry.move(), speed)
play()

// Event listeners
const logKey = (e) => {
  barry.changeDirection(e)
}
document.addEventListener('keydown', logKey)

document
  .querySelector('button')
  .addEventListener('click', () => barry.playAgain())
