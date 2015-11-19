# camera-spin

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Mouse/touch-draggable first-person camera. Useful for out-of-the-box [Google Street View-style](https://www.google.com.au/maps/place/Sydney+Opera+House/@-33.8578533,151.2142117,3a,75y,25.75h,89.62t/data=!3m8!1e1!3m6!1s-9qb8-AmcX4U%2FVVdEHv_9DMI%2FAAAAAAABE_c%2F5XZUl2igKlM!2e4!3e11!6s%2F%2Flh4.googleusercontent.com%2F-9qb8-AmcX4U%2FVVdEHv_9DMI%2FAAAAAAABE_c%2F5XZUl2igKlM%2Fw218-h100-n-k-no%2F!7i7867!8i3600!4m2!3m1!1s0x6b12ae665e892fdd:0x3133f8d75a1ac251!6m1!1e1?hl=en) camera controls.

## Usage

[![NPM](https://nodei.co/npm/camera-spin.png)](https://www.npmjs.com/package/camera-spin)

### `camera = Camera(element, origin, up)`

Creates a new camera instance. All arguments are optional:

* `element` is the DOM element to attach to and make interactive.
* `origin` is a `[x, y, z]` array specifying the position of the camera. Defaults to `[0, 0, 0]`.
* `up` is a `[x, y, z]` array specifying the "up" vector to use. Defaults to `[0, 1, 0]`.

### `view = camera.tick()`

This function should be run once per frame in your requestAnimationFrame loop:

``` javascript
const raf = require('raf')

render()
function render () {
  camera.tick()
  raf(render)
}
```

It's responsible for updating the camera parameters in response to user input. Returns `view`, your 4x4 `Float32Array` view matrix to give your shaders.

### `view = camera.view()`

Calculates and returns the 4x4 `view` matrix provided by `camera.tick()` *without* performing any of the user input handling.

### `camera.direction`

A normalized `[x, y, z]` array specifying the direction the camera is currently looking as a vector. You can use this, for example, to move the camera forward in the direction it's looking:

``` javascript
camera.origin[0] += camera.direction[0] * distance
camera.origin[1] += camera.direction[1] * distance
camera.origin[2] += camera.direction[2] * distance
```

The value is read-only: it'll be updated each time you call `camera.tick()`.

### `camera.rotation`

An `[x, y]` array containing the horizontal and vertical rotation in radians. You can use this to manually point the camera in a specific direction.

### `camera.lookSpeed`

Change this value to set the speed at which the camera moves around, i.e. its mouse sensitivity. Should be between 0 and 1. Defaults to `0.003`.

### `camera.dragRate`

Change this value to set the rate of interpolation between rotation values. Should be between 0 and 1 — lower values will result in smoother motion, higher values will increase responsiveness. Defaults to `0.2`.

### `camera.dispose()`

Tear everything down once you're no longer using the camera. Required if you need to clean up after yourself :)

## License

MIT, see [LICENSE.md](http://github.com/Jam3/camera-spin/blob/master/LICENSE.md) for details.
