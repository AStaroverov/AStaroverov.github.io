import { PIXEL_RATIO } from '../constants/layout'
import { Task, taskQueue } from '../lib/Scheduler'

export class Layers {
  public $canvas: HTMLCanvasElement
  public $root: HTMLElement

  private attached: boolean = false
  private rootSize: { width: number, height: number } = { width: 0, height: 0 }

  public appendTo (root) {
    this.$root = root

    this.detach()
    this.create()
    this.attach()
    this.setStyle()
    this.updateSize()

    taskQueue.add(new Task(this.performUpdate, this))
  }

  public performUpdate () {
    const size = this.getRootSize()

    if (this.rootSize.width !== size.width || this.rootSize.height !== size.height) {
      this.updateSize()
    }
  }

  public updateSize () {
    const { width, height } = this.rootSize = this.getRootSize()

    this.$canvas.width = width * PIXEL_RATIO
    this.$canvas.height = height * PIXEL_RATIO
  }

  public getRootSize (): { width: number, height: number } {
    return {
      width: this.$canvas.clientWidth,
      height: this.$canvas.clientHeight
    }
  }

  private create () {
    this.$canvas = document.createElement('canvas')
  }

  private attach () {
    if (this.attached) return

    this.$root.appendChild(this.$canvas)

    this.attached = true
  }

  private detach () {
    if (!this.attached) return

    this.$root.removeChild(this.$canvas)

    this.attached = false
  }

  public destroy () {
    this.detach()
  }

  private setStyle () {
    this.$canvas.style.position = 'absolute'
    this.$canvas.style.top = '0px'
    this.$canvas.style.left = '0px'
    this.$canvas.style.bottom = '0px'
    this.$canvas.style.right = '0px'
    this.$canvas.style.zIndex = '2'
    this.$canvas.style.width = '100%'
    this.$canvas.style.height = '100%';

    ['userSelect', 'msUserSelect', 'mozUserSelect', 'webkitUserSelect'].forEach(prop => {
      this.$canvas.style[prop] = 'none'
    })
  }
}

export const layers = new Layers()
