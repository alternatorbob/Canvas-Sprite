export async function setupWebcam() {
  const capture = document.createElement('video')

  capture.playsinline = 'playsinline'
  capture.autoplay = 'autoplay'

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  })

  await new Promise((resolve) => {
    capture.onloadeddata = resolve
    capture.srcObject = stream
  })

  return capture
}

export function delay(millis = 0) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, millis)
  })
}

export function map(num, start1, stop1, start2, stop2) {
  return ((num - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

export function lerp(start, stop, amt) {
  return amt * (stop - start) + start
}

export class SmoothPos {
  constructor({ x, y, smooth = 0.1 }) {
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.smooth = smooth
  }

  follow(targetX, targetY) {
    this.targetX = targetX || 0
    this.targetY = targetY || 0
  }

  update() {
    this.x = lerp(this.x, this.targetX, this.smooth)
    this.y = lerp(this.y, this.targetY, this.smooth)

    return [this.x, this.y]
  }
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export function modulo(num, mod) {
  return ((num % mod) + mod) % mod //modulo operator, same as js remainder. but works with negative numbers.
}

export function dist(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2)
}