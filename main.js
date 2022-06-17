//#region GAME LOGIC AND DATA

//DATA
let clickCount = 0
let defaultHeight = 100
let defaultWidth = 100
let height = defaultHeight
let width = defaultWidth
let inflationRate = 20
let maxSize = 300
let currentPopCount = 0
let highestPopCount = 0
let gameLength = 10000 //in milliseconds
let clockId = 0
let timeRemaining = 0 //in 
let currentPlayer = {}
let currentColor = "red"
let possibleColors = ["red", "blue", "green", "purple", "pink"]

function startGame() {
  //@ts-ignore
  document.getElementById("game-controls").classList.remove("hidden")
  //@ts-ignore
  document.getElementById("main-controls").classList.add("hidden")
  //@ts-ignore
  document.getElementById("scoreboard").classList.add("hidden")
  startClock()
  setTimeout(stopGame, gameLength)
}

function startClock() {
  timeRemaining = gameLength
  drawClock()
  clockId = setInterval(drawClock, 1000)
}

function stopClock() {
  clearInterval(clockId)
  clockId = 0;
}

function drawClock() {
  let countdownElem = document.getElementById("countdown")

  //@ts-ignore
  countdownElem.innerText = (timeRemaining / 1000).toString()
  timeRemaining -= 1000
}

function inflate() {
  clickCount++
  height += inflationRate
  width += inflationRate
  checkBalloonPop()
  draw()
}

function checkBalloonPop() {
   if (height >= maxSize) {
    console.log("pop the balloon")
    let balloonElem = document.getElementById("balloon")
    //@ts-ignore
    balloonElem.classList.remove(currentColor)
    getRandomColor()
    //@ts-ignore
    balloonElem.classList.add(currentColor)

    //@ts-ignore
    document.getElementById("pop-sound").play()

    currentPopCount++
    height = defaultHeight
    width = defaultWidth
  }
}

function getRandomColor() {
  let i = Math.floor(Math.random() * possibleColors.length)
  currentColor = possibleColors[i]
}


function draw() {
  let balloonElem = document.getElementById("balloon")
  let clickCountElem = document.getElementById("click-count")
  let popCountElem = document.getElementById("pop-count")
  let topScoreElem = document.getElementById("top-score")
  let playerNameElem = document.getElementById("player-name")

  //@ts-ignore
  balloonElem.style.height = height + "px"
  //@ts-ignore
  balloonElem.style.width = width + "px"
  //@ts-ignore
  clickCountElem.innerText = clickCount.toString()
  //@ts-ignore
  popCountElem.innerText = currentPopCount.toString()
  //@ts-ignore
  topScoreElem.innerText = currentPlayer.topScore.toString()
  //@ts-ignore
  playerNameElem.innerText = currentPlayer.name
}

function stopGame() {
  console.log("the game is over")
  //@ts-ignore
  document.getElementById("game-controls").classList.add("hidden")
  //@ts-ignore
  document.getElementById("main-controls").classList.remove("hidden")
  //@ts-ignore
  document.getElementById("scoreboard").classList.remove("hidden")

  clickCount = 0
  height = defaultHeight
  width = defaultWidth

  if(currentPopCount > currentPlayer.topScore) {
    currentPlayer.topScore = currentPopCount
    savePlayers()
  }
  currentPopCount = 0

  stopClock()
  draw()
  drawScoreboard()
}

//#endregion

//#region PLAYERS
let players = []
loadPlayers()

function setPlayers(event) {
  event.preventDefault()
  let form = event.target
  let playerName = form.playerName.value

  currentPlayer = players.find(player => player.name == playerName)

  if(!currentPlayer) {
    currentPlayer = {name: playerName, topScore: 0}
    players.push(currentPlayer)
    savePlayers()
  }

  form.reset()
  //@ts-ignore
  document.getElementById("game").classList.remove("hidden")
  form.classList.add("hidden")
  draw()
  drawScoreboard()
}

function changePlayer() {
  //@ts-ignore
  document.getElementById("player-form").classList.remove("hidden")
  //@ts-ignore
  document.getElementById("game").classList.add("hidden")
}

function savePlayers() {
  window.localStorage.setItem("players", JSON.stringify(players))
}

function loadPlayers() {
  //@ts-ignore
  let playersData = JSON.parse(window.localStorage.getItem("players"))
  if(!playersData) {
    players = []
  } else {
    players = playersData
  }
}

function drawScoreboard() {
  let template = ""

  players.sort((p1, p2) => p2.topScore - p1.topScore)

  players.forEach(player => {
    template += `
    <div class="d-flex space-between">
      <span>
        <i class="fa fa-user"></i>
        ${player.name}
      </span>
      <span>Score: ${player.topScore}</span>
    </div>
    `
  })

  //@ts-ignore
  document.getElementById("players").innerHTML = template
}

//#endregion

drawScoreboard()