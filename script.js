class WordSearch {
    constructor() {
      // Grid de letras exacto de la imagen
      this.grid = [
        ["A", "D", "C", "U", "L", "U", "M", "Y", "V", "J", "I", "D", "C", "L", "M", "A", "O", "N", "V", "R"],
        ["D", "E", "F", "C", "A", "S", "W", "V", "I", "A", "U", "Y", "J", "D", "D", "O", "Y", "G", "J", "E"],
        ["G", "H", "I", "E", "U", "X", "Q", "L", "R", "L", "E", "J", "S", "U", "Q", "Y", "C", "S", "O", "S"],
        ["V", "I", "G", "U", "P", "X", "R", "P", "I", "I", "W", "T", "Q", "Z", "I", "W", "A", "A", "V", "P"],
        ["L", "P", "F", "U", "H", "O", "N", "E", "S", "I", "I", "D", "A", "D", "Z", "V", "V", "G", "X", "O"],
        ["R", "N", "N", "C", "L", "X", "S", "M", "W", "X", "T", "W", "V", "C", "K", "O", "W", "D", "N", "N"],
        ["E", "L", "G", "O", "R", "P", "N", "I", "I", "B", "S", "X", "Z", "Q", "K", "S", "E", "G", "W", "S"],
        ["S", "G", "X", "Q", "Y", "J", "C", "K", "N", "Z", "Z", "W", "H", "V", "Y", "U", "J", "R", "F", "A"],
        ["P", "Y", "Y", "E", "E", "U", "V", "V", "N", "L", "Y", "V", "N", "Q", "E", "S", "N", "A", "K", "B"],
        ["E", "U", "W", "I", "L", "G", "E", "M", "S", "G", "I", "D", "E", "R", "R", "J", "F", "S", "C", "I"],
        ["T", "F", "G", "U", "J", "Q", "L", "H", "L", "X", "P", "T", "K", "K", "K", "G", "Q", "N", "O", "L"],
        ["O", "W", "H", "U", "M", "F", "X", "R", "S", "D", "Z", "P", "B", "W", "L", "Q", "V", "Y", "P", "I"],
        ["U", "Q", "W", "J", "W", "B", "Q", "F", "J", "Q", "I", "C", "Y", "M", "U", "K", "G", "E", "O", "D"],
        ["T", "C", "S", "O", "L", "I", "D", "A", "R", "I", "D", "A", "D", "H", "L", "I", "L", "Z", "C", "A"],
        ["P", "X", "Q", "G", "C", "M", "Q", "H", "S", "X", "B", "E", "G", "E", "X", "B", "Y", "Y", "Y", "D"],
        ["C", "Z", "Y", "T", "P", "A", "B", "C", "S", "Q", "B", "U", "V", "W", "Z", "N", "Y", "R", "X", "R"],
        ["V", "Y", "Z", "W", "T", "N", "E", "M", "P", "A", "T", "I", "A", "B", "J", "W", "D", "V", "J", "W"],
        ["D", "Y", "D", "U", "D", "A", "E", "M", "X", "A", "U", "V", "E", "L", "W", "M", "O", "O", "Q", "U"],
      ]
  
      // Palabras a encontrar (incluyendo las nuevas)
      this.words = [
        "RESPETO",
        "RESPONSABILIDAD",
        "TOLERANCIA",
        "SOLIDARIDAD",
        "EMPATIA",
        "HONESTIDAD",
        "JUSTICIA",
        "LEALTAD",
        "HUMILDAD",
        "GENEROSIDAD",
        "PACIENCIA",
        "GRATITUD",
        "BONDAD",
        "COMPASION",
        "DIGNIDAD",
      ]
  
      this.foundWords = new Set()
      this.selectedCells = []
      this.isSelecting = false
      this.startCell = null
  
      this.init()
    }
  
    init() {
      this.createGrid()
      this.createWordsList()
      this.updateScore()
      this.addEventListeners()
    }
  
    createGrid() {
      const gridElement = document.getElementById("letter-grid")
      gridElement.innerHTML = ""
  
      for (let row = 0; row < this.grid.length; row++) {
        for (let col = 0; col < this.grid[row].length; col++) {
          const cell = document.createElement("div")
          cell.className = "letter-cell"
          cell.textContent = this.grid[row][col]
          cell.dataset.row = row
          cell.dataset.col = col
          gridElement.appendChild(cell)
        }
      }
    }
  
    createWordsList() {
      const wordsListElement = document.getElementById("words-list")
      const totalCountElement = document.getElementById("total-count")
  
      wordsListElement.innerHTML = ""
      totalCountElement.textContent = this.words.length
  
      this.words.forEach((word) => {
        const wordElement = document.createElement("div")
        wordElement.className = "word-item"
        wordElement.textContent = word
        wordElement.dataset.word = word
        wordsListElement.appendChild(wordElement)
      })
    }
  
    addEventListeners() {
      const cells = document.querySelectorAll(".letter-cell")
  
      cells.forEach((cell) => {
        cell.addEventListener("mousedown", (e) => this.startSelection(e))
        cell.addEventListener("mouseenter", (e) => this.continueSelection(e))
        cell.addEventListener("mouseup", (e) => this.endSelection(e))
      })
  
      document.addEventListener("mouseup", () => this.endSelection())
    }
  
    startSelection(e) {
      e.preventDefault()
      this.isSelecting = true
      this.startCell = e.target
      this.selectedCells = [e.target]
      this.highlightSelection()
    }
  
    continueSelection(e) {
      if (!this.isSelecting || !this.startCell) return
  
      const currentCell = e.target
      const startRow = Number.parseInt(this.startCell.dataset.row)
      const startCol = Number.parseInt(this.startCell.dataset.col)
      const currentRow = Number.parseInt(currentCell.dataset.row)
      const currentCol = Number.parseInt(currentCell.dataset.col)
  
      // Calcular la dirección de selección
      const rowDiff = currentRow - startRow
      const colDiff = currentCol - startCol
  
      // Determinar si es una línea válida (horizontal, vertical o diagonal)
      if (this.isValidDirection(rowDiff, colDiff)) {
        this.selectedCells = this.getCellsInLine(startRow, startCol, currentRow, currentCol)
        this.highlightSelection()
      }
    }
  
    isValidDirection(rowDiff, colDiff) {
      // Permitir líneas horizontales, verticales y diagonales
      return rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)
    }
  
    getCellsInLine(startRow, startCol, endRow, endCol) {
      const cells = []
      const rowStep = endRow === startRow ? 0 : endRow > startRow ? 1 : -1
      const colStep = endCol === startCol ? 0 : endCol > startCol ? 1 : -1
  
      let currentRow = startRow
      let currentCol = startCol
  
      while (true) {
        const cell = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`)
        if (cell) cells.push(cell)
  
        if (currentRow === endRow && currentCol === endCol) break
  
        currentRow += rowStep
        currentCol += colStep
      }
  
      return cells
    }
  
    highlightSelection() {
      // Limpiar selección anterior
      document.querySelectorAll(".letter-cell.selected").forEach((cell) => {
        if (!cell.classList.contains("found")) {
          cell.classList.remove("selected")
        }
      })
  
      // Resaltar selección actual
      this.selectedCells.forEach((cell) => {
        if (!cell.classList.contains("found")) {
          cell.classList.add("selected")
        }
      })
    }
  
    endSelection() {
      if (!this.isSelecting) return
  
      this.isSelecting = false
      const selectedWord = this.selectedCells.map((cell) => cell.textContent).join("")
      const reversedWord = selectedWord.split("").reverse().join("")
  
      // Verificar si la palabra seleccionada está en la lista
      const foundWord = this.words.find((word) => word === selectedWord || word === reversedWord)
  
      if (foundWord && !this.foundWords.has(foundWord)) {
        this.foundWords.add(foundWord)
        this.markWordAsFound(foundWord)
        this.markCellsAsFound()
        this.updateScore()
  
        if (this.foundWords.size === this.words.length) {
          setTimeout(() => {
            alert("¡Felicidades! Has encontrado todas las palabras.")
          }, 100)
        }
      } else {
        // Limpiar selección si no es una palabra válida
        this.selectedCells.forEach((cell) => {
          if (!cell.classList.contains("found")) {
            cell.classList.remove("selected")
          }
        })
      }
  
      this.selectedCells = []
      this.startCell = null
    }
  
    markWordAsFound(word) {
      const wordElement = document.querySelector(`[data-word="${word}"]`)
      if (wordElement) {
        wordElement.classList.add("found")
      }
    }
  
    markCellsAsFound() {
      this.selectedCells.forEach((cell) => {
        cell.classList.remove("selected")
        cell.classList.add("found")
      })
    }
  
    updateScore() {
      const foundCountElement = document.getElementById("found-count")
      foundCountElement.textContent = this.foundWords.size
    }
  }
  
  // Inicializar el juego cuando se carga la página
  document.addEventListener("DOMContentLoaded", () => {
    new WordSearch()
  })
  