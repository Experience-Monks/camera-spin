import Pressed from 'mouse-pressed'
import lookAt from 'gl-mat4/lookAt'
import Cursor from 'touch-position'
import clamp from 'clamp'

const target = new Float32Array(3)

export default (element, origin, up) => new Camera(element, origin, up)

class Camera {
  constructor (element, origin, up) {
    this.origin = origin || new Float32Array([0, 0, 0])
    this.up = up || new Float32Array([0, 1, 0])
    this.matrix = new Float32Array(16)
    this.disposed = false

    this.lpos = new Float32Array(2)
    this.cpos = new Float32Array(2)
    this.element = element || null
    this.grabbing = false
    this.pressed = null
    this.cursor = null

    this.direction = new Float32Array(3)
    this._rotation = new Float32Array(2)
    this.rotation = new Float32Array(2)

    this.lookSpeed = 0.003
    this.dragRate = 0.2

    if (this.element) {
      this.cursor = Cursor.emitter({ element: window })
      this.cpos = this.cursor.position
      this.pressed = Pressed(element)
      this.element.style.cursor = '-webkit-grab'
      this.element.style.cursor = '-moz-grab'
      this.element.style.cursor = 'grab'
    }
  }

  tick () {
    var dx = this.lpos[0] - this.cpos[0]
    var dy = this.lpos[1] - this.cpos[1]

    this.lpos[0] = this.cpos[0]
    this.lpos[1] = this.cpos[1]

    if (this.pressed && this.pressed.left) {
      this.rotation[0] += dx * this.lookSpeed
      this.rotation[1] = clamp(this.rotation[1] - dy * this.lookSpeed, -Math.PI * 0.49, Math.PI * 0.49)
    }

    this._rotation[0] += (this.rotation[0] - this._rotation[0]) * this.dragRate
    this._rotation[1] += (this.rotation[1] - this._rotation[1]) * this.dragRate

    this.direction[0] = Math.cos(this._rotation[0]) * Math.cos(this._rotation[1])
    this.direction[1] = Math.sin(this._rotation[1])
    this.direction[2] = Math.sin(this._rotation[0]) * Math.cos(this._rotation[1])

    if (this.element) {
      if (this.grabbing && !this.pressed.left) {
        this.grabbing = false
        this.element.style.cursor = '-webkit-grab'
        this.element.style.cursor = '-moz-grab'
        this.element.style.cursor = 'grab'
      } else
      if (this.pressed.left && !this.grabbing) {
        this.grabbing = true
        this.element.style.cursor = '-webkit-grabbing'
        this.element.style.cursor = '-moz-grabbing'
        this.element.style.cursor = 'grabbing'
      }
    }

    return this.view()
  }

  view () {
    target[0] = this.origin[0] + this.direction[0]
    target[1] = this.origin[1] + this.direction[1]
    target[2] = this.origin[2] + this.direction[2]

    return lookAt(this.matrix, this.origin, target, this.up)
  }

  dispose () {
    this.disposed = true
    this.canvas = null
    this.cursor.dispose()
    this.pressed.dispose()
  }
}
