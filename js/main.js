'use strict'

const init = () => {
  const html = document.getElementsByTagName('html').item(0),
    canvas = document.getElementsByTagName('canvas').item(0),
    ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = w = window.innerWidth
    canvas.height = h = window.innerHeight
    ctx.font = `${h * 0.157894737}px monospace`
    ctx.textBaseline = 'hanging'
    ctx.textAlign = 'center'
  }

  const images = [
    'src/img/Leapfrog_Side/img-001.jpg',
    'src/img/Leapfrog_Side/img-002.jpg',
    'src/img/Leapfrog_Side/img-003.jpg',
    'src/img/Leapfrog_Side/img-004.jpg',
    'src/img/Leapfrog_Side/img-005.jpg',
    'src/img/Leapfrog_Side/img-006.jpg',
    'src/img/Leapfrog_Side/img-007.jpg',
    'src/img/Leapfrog_Side/img-008.jpg',
    'src/img/Leapfrog_Side/img-009.jpg',
    'src/img/Leapfrog_Side/img-010.jpg',
    'src/img/Leapfrog_Side/img-011.jpg',
    'src/img/Leapfrog_Side/img-012.jpg',
  ]

  let pointerX,
    pointerY,
    pointerStartX,
    pointerStartY,
    imageStartX,
    imageStartY = -1

  let myImage

  let focusState = false

  let pointerPos = []

  const loop = (t) => {
    myImage = new Image()

    // Clear the canvas

    console.log(focusState)

    ctx.fillStyle = '#000000'
    ctx.globalAlpha = 0.2
    ctx.fillRect(0, 0, w, h)
    ctx.globalAlpha = 1.0
    myImage.src = images[i]
    imageStartX = pointerX - myImage.width / 2
    imageStartY = pointerY - myImage.width / 2

    // Rotate 1 degree
    // ctx.rotate(Math.PI / 180)

    if (!focusState) {
      //Save the canvas
      ctx.save()
      ctx.drawImage(
        myImage,
        Math.floor((pointerX - myImage.width / 2) / 140) * 140,
        pointerY - myImage.height / 2
      )
      ctx.restore()

      i++
      if (i == images.length) i = 0
      last = t
      pointerControl()
      // console.log(pointerPos)
    } else {
      // ctx.save()
      // ctx.drawImage(
      //   myImage,
      //  Math.floor( (pointerX - myImage.width / 2)/140)*140,
      //   pointerY - myImage.height / 2,
      //   myImage.width * 2,
      //   myImage.height * 2
      // )
      // ctx.restore()
    }
  }

  document.addEventListener('keydown', focusOn)
  document.addEventListener('keyup', focusOff)

  function focusOn(e) {
    if (e.code === 'Space') {
      focusState = true
    }
  }
  function focusOff(e) {
    if (e.code === 'Space') {
      focusState = false
    }
  }

  function pointerControl() {
    window.addEventListener('mousemove', (e) => {
      pointerPos.push({ x: e.clientX, y: e.clientY })
      if (pointerPos.length > 2) pointerPos.shift()

      pointerX = e.clientX
      pointerY = e.clientY

      /*
      if (
        e.clientX > pointerPos[0].x + myImage.width / 8 ||
        e.clientX < pointerPos[0].x - myImage.width / 8
      ) {
        pointerX = pointerPos[0].x
        pointerY = pointerPos[0].y
        // console.log(pointerPos[0].x, 'it works')
      }
      */
    })
  }

  setInterval(loop, 100)

  let w,
    h,
    last,
    i = 0,
    start = 0

  window.removeEventListener('load', init)
  window.addEventListener('resize', resize)
  resize()
  html.classList.remove('no-js')
  html.classList.add('js')
}

window.addEventListener('load', init)
