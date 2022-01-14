'use strict'
import { setupWebcam, SmoothPos, map } from './utils.js'
import HandPose from './handPose.js'
import Sequence from './sequence.js'
import Hand from './hand.js'

const mirrored = true

const init = async () => {
  const canvas = document.querySelector('#main-canvas')
  if (mirrored) document.body.classList.add('--mirrored')

  const ctx = canvas.getContext('2d')

  const sequence = await Sequence.preload([
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
  ])

  let handposeModel = null // this will be loaded with the handpose model
  let videoDataLoaded = false // is webcam capture ready?
  const myHands = [] // hands detected by mediapipe
  let capture // webcam capture, managed by p5.js

  const smoother = new SmoothPos({ x: 0, y: 0, smooth: 0.1 })
  let pointerX,
    pointerY,
    pointerStartX,
    pointerStartY,
    imageStartX,
    imageStartY = -1

  let rotation = 0
  let myImage
  let focusState = false

  const pointerPos = []
  const handDetection = new HandPose()
  await handDetection.init()
  const hand = new Hand()

  const oldSnap = [0, 0]

  handDetection.onDetection = (hands) => {
    const [firstHand] = hands
    const { width, height } = ctx.canvas
    hand.update(handDetection.fillPose(firstHand, width, height))
  }

  loop()

  function resize() {
    canvas.width = w = window.innerWidth
    canvas.height = h = window.innerHeight
    ctx.font = `${h * 0.157894737}px monospace`
    ctx.textBaseline = 'hanging'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  // function drawHands(hands, noKeypoints) {
  //   // Each hand object contains a `landmarks` property,
  //   // which is an array of 21 3-D landmarks.
  //   for (let i = 0; i < hands.length; i++) {
  //     let landmarks = hands[i].landmarks

  //     let palms = [0, 1, 2, 5, 9, 13, 17] //landmark indices that represent the palm
  //     console.log(landmarks)
  //   }
  // }

  function loop(t) {
    const { width, height } = ctx.canvas

    if (hand.isShown) {
      smoother.follow(...hand.getCenter(ctx, false))
    }

    const [centerX, centerY] = smoother.update()
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI)
    ctx.fill()

    // myImage.width = window.innerWidth

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)

    const frame = sequence.getFrame()
    const columnWidth = frame.width
    const snapX =
      Math.floor(map(centerX, 0, width, 0, width / columnWidth)) * columnWidth

    if (snapX > oldSnap[0]) {
      sequence.nextFrame()
    } else if (snapX < oldSnap[0]) {
      sequence.previousFrame()
    }

    oldSnap[0] = snapX

    sequence.draw(ctx, { x: snapX, y: centerY })

    requestAnimationFrame(loop)
    // if (!focusState) {
    //   //Save the canvas
    //   ctx.save()
    //   ctx.rotate((rotation * Math.PI) / 180)
    //   ctx.drawImage(
    //     myImage,
    //     Math.floor((pointerX - myImage.width / 2) / myImage.width) *
    //       myImage.width,
    //     pointerY - myImage.height / 2
    //   )
    //   ctx.restore()

    //   i++
    //   if (i == images.length) i = 0
    //   last = t
    //   pointerControl()
    //   // console.log(pointerPos)
    // } else {
    //   ctx.save()
    //   ctx.drawImage(
    //     myImage,
    //     Math.floor((pointerX - myImage.width / 2) / myImage.width) *
    //       myImage.width,
    //     pointerY - myImage.height / 2,
    //     myImage.width * 2,
    //     myImage.height * 2
    //   )
    //   ctx.restore()
    // }
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
}

// function getLandmarkProperty(i) {
//   let palms = [0, 1, 2, 5, 9, 13, 17] //landmark indices that represent the palm

//   let idx = palms.indexOf(i)
//   let isPalm = idx != -1
//   let next // who to connect with?
//   if (!isPalm) {
//     // connect with previous finger landmark if it's a finger landmark
//     next = i - 1
//   } else {
//     // connect with next palm landmark if it's a palm landmark
//     next = palms[(idx + 1) % palms.length]
//   }
//   return { isPalm, next }
// }

window.addEventListener('load', init)
