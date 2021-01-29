const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

// ToDo: canvas.width & canvas.height to constant

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 10,
  height: 10,
  speed: 150,
  // angle: Math.PI / 4
  angle: Math.PI/4 + Math.random() * Math.PI/2
  // PI = 180
}

const platforma = {
  x: 10,
  y: 480,
  width: 200,
  height: 15,
  speed: 100,
}

const blocks = [
  { x: 50, y: 50, width: 50, height: 20 },
  { x: 100, y: 50, width: 50, height: 20 },
  { x: 150, y: 50, width: 50, height: 20 },
  { x: 200, y: 50, width: 50, height: 20 }
]

const limits = 

// Body

requestAnimationFrame(loop)

let prevTimestamp = 0
function loop(timestamp) {
  requestAnimationFrame(loop)

  const deltaTimestamp = (timestamp - prevTimestamp) / 1000 // Time in seconds between screen refresh
  prevTimestamp = timestamp

  clearCanvas()
  drawRect(ball)
  ball.x += deltaTimestamp * ball.speed * Math.cos(ball.angle)
  ball.y -= deltaTimestamp * ball.speed * Math.sin(ball.angle)
}

// drawRect(ball)
// drawRect(platforma)
// blocks.map((block) => drawRect(block))

// Functions

function drawRect(param) {
  context.beginPath()
  context.rect(param.x, param.y, param.width, param.height)
  context.strokeStyle = 'red'
  context.stroke()
}

function clearCanvas() {
  // canvas.width = canvas.width
  canvas.width |= 0
}

function touch(RectA, RectB) {
  
}