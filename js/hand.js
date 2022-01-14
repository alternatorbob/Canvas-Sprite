const PALMS = [0, 1, 2, 5, 9, 13, 17] //landmark indices that represent the palm

export default class Hand {
  constructor() {
    this.disable()
  }

  update(handPoseResult) {
    if (handPoseResult && !this.isShown) this.enable()
    if (!handPoseResult && this.isShown) this.disable()

    if (this.isShown) {
      this.hand = handPoseResult
    }
  }

  //add function to check if hand is closed

  disable() {
    // this.hand = null
    this.isShown = false
  }

  enable() {
    this.isShown = true
  }

  getCenter() {
    if (!this.isShown) return
    return this.hand.landmarks[9]
  }

  show(ctx, noKeypoints) {
    if (!this.isShown) return

    const { landmarks } = this.hand

    for (let j = 0; j < landmarks.length; j++) {
      let [x, y, z] = landmarks[j] // coordinate in 3D space

      // draw the keypoint and number
      if (!noKeypoints) {
        ctx.fillRect(x - 2, y - 2, 4, 4)
        ctx.fillText(j, x, y)
      }

      // draw the skeleton
      let isPalm = PALMS.indexOf(j) // is it a palm landmark or finger landmark?
      let next // who to connect with?
      if (isPalm == -1) {
        // connect with previous finger landmark if it's a finger landmark
        next = landmarks[j - 1]
      } else {
        // connect with next palm landmark if it's a palm landmark
        next = landmarks[PALMS[(isPalm + 1) % PALMS.length]]
      }

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(...next)
      ctx.stroke()
    }
  }
}
