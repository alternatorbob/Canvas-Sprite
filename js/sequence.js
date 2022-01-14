import { loadImage, modulo } from './utils.js'

export default class Sequence {
  constructor(frames) {
    this.frames = frames
    this.frameIndex = 0
  }

  nextFrame() {
    return this.moveToFrame(this.frameIndex + 1)
  }

  moveToFrame(index) {
    this.frameIndex = modulo(index, this.frames.length)
    return this.getFrame()
  }

  previousFrame() {
    return this.moveToFrame(this.frameIndex - 1)
  }

  getFrame() {
    return this.frames[this.frameIndex]
  }

  draw(ctx, { x, y }) {
    const img = this.getFrame()
    const { width, height } = img

    ctx.save()
    ctx.drawImage(img, x - width / 2, y - height / 2)
    ctx.restore()
  }

  static async preload(urls) {
    const loadings = urls.map((url) => loadImage(url))
    const images = await Promise.all(loadings)

    return new Sequence(images)
  }
}
