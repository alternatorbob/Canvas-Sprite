import { setupWebcam, delay, map } from './utils.js'

export default class HandPose {
  constructor() {}
  async init() {
    this.capture = await setupWebcam()
    this.capture.classList.add('absolute-cover')
    document.body.appendChild(this.capture)
    this.handpose = await handpose.load()
    console.log('handpose is setup')
    this.startDetect()
  }

  startDetect() {
    this.detect()
  }
  //! externally overwritten
  onDetection(pose) {}

  fillPose(pose, width, height) {
    if (!pose) return pose

    const { videoWidth, videoHeight } = this.capture
    const landmarks = pose.landmarks.map((landmark) => {
      const [x, y, z] = landmark
      return [
        map(x, 0, videoWidth, 0, width),
        map(y, 0, videoHeight, 0, height),
        z,
      ]
    })

    // console.log(pose, landmarks)
    return { landmarks }
  }

  async detect() {
    const pose = await this.handpose.estimateHands(this.capture)
    this.onDetection(pose)
    await delay(10)
    this.detect()
  }
}
