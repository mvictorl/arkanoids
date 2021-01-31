const img = new Image()
img.src = './pics.png'

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
canvas.width = 500
canvas.height = 500

const limits = [
  { x: 0, y: -30, width: canvas.width, height: 30 },
  { x: canvas.width, y: 0, width: 30, height: canvas.height },
  { x: 0, y: canvas.height, width: canvas.width, height: 30 },
  { x: -30, y: 0, width: 30, height: canvas.height }
]

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 10,
  height: 10,
  speed: 200,
  // angle: Math.PI / 4
  angle: Math.PI / 4 + Math.random() * Math.PI / 2
  // PI = 180
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')
    platform.left = true
  if (e.key === 'ArrowRight')
    platform.right = true
})

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft')
    platform.left = false
  if (e.key === 'ArrowRight')
    platform.right = false
})

//********  Body  ********
requestAnimationFrame(loop)
let prevTimestamp = 0

function loop(timestamp) {
  requestAnimationFrame(loop)

  // Max 16.7 for stops in focus off (other tab)
  const deltaTimestamp = Math.min(16.7, timestamp - prevTimestamp) / 1000 // Time in seconds between screen refresh
  prevTimestamp = timestamp

  clearCanvas()

  ball.x += deltaTimestamp * ball.speed * Math.cos(ball.angle)
  ball.y -= deltaTimestamp * ball.speed * Math.sin(ball.angle)

  if (platform.left) platform.x = Math.max(0, platform.x - deltaTimestamp * platform.speed)
  if (platform.right) platform.x = Math.min(canvas.width - platform.width, platform.x + deltaTimestamp * platform.speed)

  for (const block of blocks) {
    if (isTouching(block, ball)) {
      const up = {
        x: block.x,
        y: block.y - 20,
        width: block.width,
        height: 20
      }
      const down = {
        x: block.x,
        y: block.y + block.height,
        width: block.width,
        height: 20
      }
      const right = {
        x: block.x + block.width,
        y: block.y,
        width: 20,
        height: block.height
      }
      const left = {
        x: block.x - 20,
        y: block.y,
        width: 20,
        height: block.height
      }

      if (isTouching(up, ball) || isTouching(down, ball))
        ball.angle = Math.PI * 2 - ball.angle
      else if (isTouching(left, ball) || isTouching(right, ball))
        ball.angle = Math.PI - ball.angle

      if (block.kind !== 'indestructible') {
        toggleItem(blocks, block)
      } else {
        let timer = setInterval(() => {
          if (block.index === 0 || block.index < 9) {
            block.index++
            drawElement(block,
              atlas[block.kind][block.index].x,
              atlas[block.kind][block.index].y,
              atlas[block.kind][block.index].w,
              atlas[block.kind][block.index].h
            )
          } else {
            block.index = 0
            drawElement(block,
              atlas[block.kind][block.index].x,
              atlas[block.kind][block.index].y,
              atlas[block.kind][block.index].w,
              atlas[block.kind][block.index].h
            )
            clearInterval(timer)
          }
        }, 20)
      }
    }
  }

  if (isTouching(limits[0], ball) || isTouching(limits[2], ball)) {
    ball.angle = Math.PI * 2 - ball.angle
  }
  if (isTouching(limits[1], ball) || isTouching(limits[3], ball)) {
    ball.angle = Math.PI - ball.angle
  }

  if (isTouching(platform, ball)) {
    // ball.angle = Math.PI * 2 - ball.angle
    const x = ball.x + ball.width / 2
    const percent = (x - platform.x) / platform.width
    ball.angle = Math.PI - Math.PI * 0.9 * (percent + 0.05)
  }

// drawBall(ball)
  drawElement(ball, atlas.ball.x, atlas.ball.y, atlas.ball.w, atlas.ball.h)
  drawElement(platform, atlas.platform.x, atlas.platform.y, atlas.platform.w, atlas.platform.h)
  blocks.map((block) => drawElement(
    block,
    atlas[block.kind][block.index].x,
    atlas[block.kind][block.index].y,
    atlas[block.kind][block.index].w,
    atlas[block.kind][block.index].h))
}

//********  Functions  ********
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

function isTouching(rectA, rectB) {
  // ToDo: use map()
  for (const pA of rectToPoints(rectA)) {
    if (pointWithinRect(pA, rectB)) return true
  }
  // ToDo: use map()
  for (const pB of rectToPoints(rectB)) {
    if (pointWithinRect(pB, rectA)) return true
  }
  return false
}

function pointWithinRect(point, rect) {
  return (point.x >= rect.x && point.x <= rect.x + rect.width) &&
    (point.y >= rect.y && point.y <= rect.y + rect.height)
}

function rectToPoints(rect) {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x, y: rect.y + rect.height },
    { x: rect.x + rect.width, y: rect.y + rect.height }
  ]
}

function toggleItem(array, item) {
  if (array.includes(item))
    array.splice(array.indexOf(item), 1)
  else
    array.push(item)
}

function drawElement(rect, x, y, w, h) {
  context.beginPath()
  context.drawImage(
    img, x, y, w, h,
    rect.x, rect.y,
    rect.width, rect.height
  )
}