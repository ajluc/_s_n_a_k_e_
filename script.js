// Global variables
const gridContainer = document.querySelector('.grid-container')
let numColumns = 8
let numRows = 8

// Create a grid of squares with class for column and row
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    const square = document.createElement('div')
    square.classList.add(`r${i}c${j}`)
    square.innerText = `r${i}c${j}`
    gridContainer.append(square)
  }
}
