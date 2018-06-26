/* eslint-env node, browser */
// Heavily adapted from https://www.shadertoy.com/view/lscczl
const path = require('path')
const regl = require('regl')({
  extensions: ['OES_texture_float'],
  optionalExtensions: ['EXT_disjoint_timer_query']
})
const glslify = require('glslify')
const shader = require('shader-reload')({
  vertex: glslify(path.resolve(__dirname, 'index.vert')),
  fragment: glslify(path.resolve(__dirname, 'index.frag'))
})

const drawParticles = regl({
  depth: {enable: false},
  stencil: {enable: false},
  frag: shader.fragment,
  vert: shader.vertex,
  attributes: {
    position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, 1], [1, -1]]
  },

  uniforms: {
    resolution: ctx => {
      return [ctx.viewportWidth, ctx.viewportHeight]
    },
    viewportWidth: regl.context('viewportWidth'),
    viewportHeight: regl.context('viewportHeight'),
    runtime: regl.context('time')
  },
  count: 6
})

const loop = regl.frame(ctx => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  drawParticles()

  if (ctx.tick < 3) console.log(ctx)

  // if (ctx.time > 1.0) {
  //   loop.cancel()
  // }
})
