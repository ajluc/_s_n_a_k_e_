// Global variables
const gridContainer = document.querySelector('.grid-container')
const containerContainer = document.querySelector('.container-container')
const scoreContainer = document.querySelector('.score')
const highScoreContainer = document.querySelector('.high-score')

let numColumns = 20
let numRows = 15

let score = 0
let highScore = 0

let speed = 90

let interval
let target
let darkSnake = true

let mySound = new Audio('./sounds/mixkit-game-ball-tap-2073.wav')

const logKey = (e) => {
  barry.changeDirection(e)
}

// Direction variable. Value can be 0, 1, -1
let direction = {
  column: 1, // moving Down the column
  row: 0 // not moving R or L
}

// Create a grid of squares with class for column and row, add checkerboard pattern
const createBoard = () => {
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
}

// Create Snake class
// snake object needs:
// array of current locations
// 0th index is snake head, so where we move from
// current direction
class Snake {
  constructor(initialPosition) {
    this.position = initialPosition
    // this.direction = initialDirection
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
  // Change direction based on arrow key presses (could be global function instead of method)
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
    // If barry head hits himself, run gameOver function
    if (
      this.position.some(
        (element) =>
          element.row === newPosition.row &&
          element.column === newPosition.column
      )
    ) {
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
    // could be global function instead of method
    score += 10
    scoreContainer.innerText = score
    document.querySelector('.target-current').classList.remove('target-current')
    target = targetLocate()
    if (score > highScore) {
      highScore = score
      highScoreContainer.innerText = highScore
    }
    mySound.play()
  }
  gameOver() {
    // could be global function instead of method
    // // Create a div for game over message
    const gameOverPopUp = document.createElement('div')
    gameOverPopUp.classList.add('game-over')
    gameOverPopUp.innerHTML = 'game<br>over'
    containerContainer.append(gameOverPopUp)
    // Change grid visibility
    gridContainer.classList.add('transparent')
    // Play again on click or spacebar
    containerContainer.addEventListener('click', () => countDown(), {
      once: true
    })
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.code === 'Space') {
          countDown()
        }
      },
      { once: true }
    )

    document.removeEventListener('keydown', logKey)
    clearInterval(interval)
  }
}

// Instance (barry) of Snake
const barry = new Snake()

const countDown = () => {
  document.querySelector('.game-over').remove()

  // // Create a div for countdown message
  const countDownPopUp = document.createElement('div')
  countDownPopUp.classList.add('countdown')
  gridContainer.classList.add('transparent')
  countDownPopUp.innerHTML = '3'
  let time = 2
  const countDownTimeout = setInterval(() => {
    countDownPopUp.innerHTML = `${time}`
    time--
    if (time === 0) {
      window.clearInterval(countDownTimeout)
    }
  }, 500)
  containerContainer.append(countDownPopUp)
  setTimeout(() => {
    gridContainer.classList.remove('transparent')
    document.querySelector('.countdown').remove()
    playGame()
  }, 1500)
}

// playGame function: will be called on click
const playGame = () => {
  // Reset any existing board
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild)
  }

  gridContainer.classList.remove('transparent')

  // Reset (or set) position and direction
  barry.position = [
    { row: 1, column: 3 },
    { row: 1, column: 2 },
    { row: 1, column: 1 }
  ]
  direction = {
    column: 1,
    row: 0
  }
  // Reset this game's score
  score = 0
  scoreContainer.innerText = score
  // Set game board
  createBoard()
  barry.place()
  target = targetLocate()
  // Add key listener
  document.addEventListener('keydown', logKey)
  // Clear any old, start new movement
  clearInterval(interval)
  interval = setInterval(() => barry.move(), speed)
}

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
    return targetLocate()
  } else {
    let circle = document.createElement('div')
    circle.classList.add('target-current')
    document.querySelector(`.r${randRow}c${randColumn}`).append(circle)
    // document
    //   .querySelector(`.r${randRow}c${randColumn}`)
    //   .classList.add('target-current')
    return { row: randRow, column: randColumn }
  }
}

createBoard()
countDown()

// Event listeners
document
  .querySelector('.play-again')
  .addEventListener('click', () => countDown())

// issue: can still toggle grey color without restarting
document.querySelector('.speed1').addEventListener('click', () => {
  document.querySelector('.current').classList.remove('current')
  document.querySelector('.speed1').classList.add('current')
  speed = 115
  countDown()
})
document.querySelector('.speed2').addEventListener('click', () => {
  document.querySelector('.current').classList.remove('current')
  document.querySelector('.speed2').classList.add('current')
  speed = 90
  countDown()
})
document.querySelector('.speed3').addEventListener('click', () => {
  document.querySelector('.current').classList.remove('current')
  document.querySelector('.speed3').classList.add('current')
  speed = 65
  countDown()
})

// // Dark mode button
document.querySelector('link[rel=stylesheet].dark').disabled = darkSnake

document.querySelector('.color-mode').addEventListener('click', () => {
  darkSnake = !darkSnake
  document.querySelector('.color-mode').classList.toggle('dark-button')
  if (darkSnake) {
    document.querySelector('.color-mode').innerText = 'dark'
  } else {
    document.querySelector('.color-mode').innerText = 'light'
  }
  document.querySelector('link[rel=stylesheet].dark').disabled = darkSnake
})

// Stop keystroke moving the page
window.addEventListener(
  'keydown',
  function (e) {
    if (
      ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(
        e.code
      ) > -1
    ) {
      e.preventDefault()
    }
  },
  false
)
