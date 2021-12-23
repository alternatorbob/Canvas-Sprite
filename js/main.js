'use strict'

const init = () => {
  const html = document.getElementsByTagName('html').item(0),
    canvas = document.getElementsByTagName('canvas').item(0),
    ctx = canvas.getContext('2d')

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

  var handposeModel = null // this will be loaded with the handpose model
  var videoDataLoaded = false // is webcam capture ready?
  var statusText = 'Loading handpose model...'
  var myHands = [] // hands detected by mediapipe
  var capture // webcam capture, managed by p5.js

  let pointerX,
    pointerY,
    pointerStartX,
    pointerStartY,
    imageStartX,
    imageStartY = -1

  let rotation = 0
  let myImage
  let focusState = false
  let pointerPos = []

  handpose.load().then(function (_model) {
    console.log('model initialized.')
    statusText = 'Model loaded.'
    handposeModel = _model
    setInterval(loop, 100)
  })

  var capture = document.createElement('video')
  capture.playsinline = 'playsinline'
  capture.autoplay = 'autoplay'
  navigator.mediaDevices
    .getUserMedia({ audio: false, video: true })
    .then(function (stream) {
      window.stream = stream
      capture.srcObject = stream
    })

  // hide the video element
  capture.style.position = 'absolute'
  capture.style.opacity = 0
  capture.style.zIndex = -100 // "send to back"

  // signal when capture is ready and set size for debug canvas
  capture.onloadeddata = function () {
    console.log('video initialized')
    videoDataLoaded = true
  }

  const resize = () => {
    canvas.width = w = window.innerWidth
    canvas.height = h = window.innerHeight
    ctx.font = `${h * 0.157894737}px monospace`
    ctx.textBaseline = 'hanging'
    ctx.textAlign = 'center'
  }

  function getLandmarkProperty(i) {
    var palms = [0, 1, 2, 5, 9, 13, 17] //landmark indices that represent the palm

    var idx = palms.indexOf(i)
    var isPalm = idx != -1
    var next // who to connect with?
    if (!isPalm) {
      // connect with previous finger landmark if it's a finger landmark
      next = i - 1
    } else {
      // connect with next palm landmark if it's a palm landmark
      next = palms[(idx + 1) % palms.length]
    }
    return { isPalm, next }
  }

  const loop = (t) => {
    myImage = new Image()
    // myImage.width = window.innerWidth

    ctx.fillStyle = '#000000'
    ctx.globalAlpha = 0.2
    ctx.fillRect(0, 0, w, h)
    ctx.globalAlpha = 1.0
    myImage.src = images[i]
    imageStartX = pointerX - myImage.width / 2
    imageStartY = pointerY - myImage.width / 2

    if (!focusState) {
      //Save the canvas
      ctx.save()
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.drawImage(
        myImage,
        Math.floor((pointerX - myImage.width / 2) / myImage.width) *
          myImage.width,
        pointerY - myImage.height / 2
      )
      ctx.restore()

      i++
      if (i == images.length) i = 0
      last = t
      pointerControl()
      // console.log(pointerPos)
    } else {
      ctx.save()
      ctx.drawImage(
        myImage,
        Math.floor((pointerX - myImage.width / 2) / myImage.width) *
          myImage.width,
        pointerY - myImage.height / 2,
        myImage.width * 2,
        myImage.height * 2
      )
      ctx.restore()
    }

    if (handposeModel && videoDataLoaded) {
      // model and video both loaded,

      handposeModel.estimateHands(capture.elt).then(function (_hands) {
        // we're handling an async promise
        // best to avoid drawing something here! it might produce weird results due to racing

        myHands = _hands // update the global myHands object with the detected hands
        if (!myHands.length) {
          // haven't found any hands
          statusText = 'Show some hands!'
        } else {
          // display the confidence, to 3 decimal places
          statusText =
            'Confidence: ' +
            Math.round(myHands[0].handInViewConfidence * 1000) / 1000
        }
      })
      drawHands(myHands)
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

      if (e.clientY > pointerPos[0].y + myImage.height / 8) {
        console.log('true')
        rotation++
        // console.log(pointerPos[0].x, 'it works')
      } else if (e.clientY < pointerPos[0].y - myImage.height / 8) {
        // console.log('true')
        // rotation--
      } else if (e.clientY === pointerPos[0].y) {
        rotation = 0
      }
    })
  }

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

function drawHands(hands, noKeypoints) {
  // Each hand object contains a `landmarks` property,
  // which is an array of 21 3-D landmarks.
  for (var i = 0; i < hands.length; i++) {
    var landmarks = hands[i].landmarks

    var palms = [0, 1, 2, 5, 9, 13, 17] //landmark indices that represent the palm
    console.log(landmarks)
    for (var j = 0; j < landmarks.length; j++) {
      var [x, y, z] = landmarks[j] // coordinate in 3D space

      // draw the keypoint and number
      if (!noKeypoints) {
        // rect(x - 2, y - 2, 4, 4)
        // text(j, x, y)
      }

      // draw the skeleton
      var isPalm = palms.indexOf(j) // is it a palm landmark or finger landmark?
      var next // who to connect with?
      if (isPalm == -1) {
        // connect with previous finger landmark if it's a finger landmark
        next = landmarks[j - 1]
      } else {
        // connect with next palm landmark if it's a palm landmark
        next = landmarks[palms[(isPalm + 1) % palms.length]]
      }
      line(x, y, ...next)
    }
  }
}

window.addEventListener('load', init)
