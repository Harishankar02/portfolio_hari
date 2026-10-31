import * as THREE from 'three'
import { buildShapes, geoVec } from './shapes.js'
import { shots, portrait } from './shots.js'
import { person, scenes, places } from '../data/film.js'
import { store } from '../store.js'

const HOLD = 0.7 // Portion of a scene's scroll that stays on its shape before morphing to the next.
const TEX_WIDTH = 512
const DUST_ROW = 8

const ease = (t) => t * t * (3 - 2 * t)
const lerp = (a, b, t) => a + (b - a) * t
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
const lerpShot = (a, b, t) => ({
  pos: lerp3(a.pos, b.pos, t),
  rot: lerp3(a.rot, b.rot, t),
  cam: lerp(a.cam, b.cam, t),
  back: lerp(a.back, b.back, t),
})

const vertexShader = /* glsl */ `
  uniform highp sampler2D uShapes;
  uniform float uFrom, uTo, uMix, uTime, uSize, uScale, uBlock, uCenter, uBack;
  attribute float aId;
  attribute vec4 aSeed;
  varying float vW;
  varying float vSeed;
  varying float vFade;

  vec4 shape(float row) {
    int id = int(aId);
    return texelFetch(uShapes, ivec2(id % ${TEX_WIDTH}, id / ${TEX_WIDTH} + int(row) * int(uBlock)), 0);
  }

  void main() {
    vec4 a = shape(uFrom);
    vec4 b = shape(uTo);
    float delay = aSeed.x * 0.5;
    float t = clamp((uMix - delay) / 0.5, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(a.xyz, b.xyz, t);

    float flight = sin(t * 3.14159);
    float ang = aSeed.y * 6.2832 + t * 4.0;
    p += flight * (0.5 + aSeed.z * 1.7) * vec3(cos(ang), sin(ang * 1.3), sin(ang) * 0.8);
    p += 0.01 * vec3(
      sin(uTime * (0.5 + aSeed.w) + aSeed.y * 40.0),
      cos(uTime * (0.4 + aSeed.z) + aSeed.x * 40.0),
      sin(uTime * (0.3 + aSeed.x) + aSeed.z * 40.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float w = mix(a.w, b.w, t);
    vW = w + flight * 0.25;
    vSeed = aSeed.w;
    vFade = 1.0 - uBack * smoothstep(-0.25, 0.55, -mv.z - uCenter);
    gl_PointSize = max(1.0, uSize * (0.62 + aSeed.w * 0.6) * (0.75 + min(w, 1.6) * 0.42) * uScale / -mv.z);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA, uColorB;
  varying float vW;
  varying float vSeed;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float soft = smoothstep(1.0, 0.15, d);
    if (soft <= 0.0) discard;
    vec3 color = mix(uColorA, uColorB, vSeed);
    color = mix(color, vec3(1.0, 0.97, 0.9), clamp((vW - 1.2) * 0.6, 0.0, 0.85));
    gl_FragColor = vec4(color * soft * min(vW, 1.5) * vFade * 0.62, 1.0);
  }
`

export function createEngine(canvas, { labels, onFrame }) {
  const small = window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4
  const count = small ? 28000 : 72000
  const pixelRatio = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(pixelRatio)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60)
  const cloud = new THREE.Group()
  scene.add(cloud)

  const rows = buildShapes(count, person.hindi)
  const block = Math.ceil(count / TEX_WIDTH)
  const pixels = new Float32Array(TEX_WIDTH * block * rows.length * 4)
  rows.forEach((row, i) => pixels.set(row, TEX_WIDTH * block * i * 4))
  const shapes = new THREE.DataTexture(pixels, TEX_WIDTH, block * rows.length, THREE.RGBAFormat, THREE.FloatType)
  shapes.minFilter = shapes.magFilter = THREE.NearestFilter
  shapes.needsUpdate = true

  const ids = new Float32Array(count)
  const seeds = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    ids[i] = i
    for (let k = 0; k < 4; k++) seeds[i * 4 + k] = Math.random()
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geometry.setAttribute('aId', new THREE.BufferAttribute(ids, 1))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))

  const uniforms = {
    uShapes: { value: shapes },
    uFrom: { value: DUST_ROW },
    uTo: { value: 0 },
    uMix: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: small ? 0.036 : 0.03 },
    uScale: { value: 1 },
    uBlock: { value: block },
    uCenter: { value: 7 },
    uBack: { value: 0 },
    uColorA: { value: new THREE.Color() },
    uColorB: { value: new THREE.Color() },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  cloud.add(points)

  const grades = scenes.map(({ grade }) => ({
    a: new THREE.Color(grade.a),
    b: new THREE.Color(grade.b),
    bg: new THREE.Color(grade.bg),
  }))
  const clear = new THREE.Color()

  let frames = shots
  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    uniforms.uScale.value = (h * pixelRatio) / (2 * Math.tan((camera.fov * Math.PI) / 360))
    // Narrow landscape windows pull the camera back so wide shapes still clear the text column.
    const pull = Math.max(1, 1.7 / camera.aspect)
    frames = w / h < 1
      ? shots.map(({ a, b }, i) => ({ a: portrait(a, i, camera.aspect), b: portrait(b, i, camera.aspect) }))
      : shots.map(({ a, b }) => ({ a: { ...a, cam: a.cam * pull }, b: { ...b, cam: b.cam * pull } }))
  }
  resize()
  window.addEventListener('resize', resize)

  const anchors = places.map((p) => new THREE.Vector3(...geoVec(p.lat, p.lon, 2.02)))
  const v = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const toCam = new THREE.Vector3()
  const rotation = new THREE.Matrix3()

  const placeLabels = (index, f) => {
    const w = window.innerWidth
    const h = window.innerHeight
    const on = f > 0.1 && f < 0.64
    rotation.setFromMatrix4(cloud.matrixWorld)
    labels.forEach((el, i) => {
      if (!el) return
      if (places[i].scene !== index || !on) {
        el.style.opacity = 0
        return
      }
      v.copy(anchors[i]).applyMatrix4(cloud.matrixWorld)
      normal.copy(anchors[i]).applyMatrix3(rotation).normalize()
      toCam.copy(camera.position).sub(v).normalize()
      const facing = normal.dot(toCam)
      v.project(camera)
      el.style.transform = `translate3d(${(v.x * 0.5 + 0.5) * w}px, ${(0.5 - v.y * 0.5) * h}px, 0)`
      el.style.opacity = facing > 0.2 ? Math.min(1, (f - 0.1) * 9) * Math.min(1, (0.64 - f) * 9) : 0
    })
  }

  let intro = 0
  let introStart = 0
  let cue = 0
  let raf = 0
  let last = performance.now()
  const end = shots.length - 1

  const frame = (now) => {
    raf = requestAnimationFrame(frame)
    // rAF timestamps can land just before performance.now(), so the first delta may be negative.
    const dt = Math.max(0, Math.min((now - last) / 1000, 0.1))
    last = now
    cue += (store.cue - cue) * (1 - Math.exp(-dt * 9))

    if (introStart) intro = Math.min(1, (now - introStart) / 2600)

    const index = Math.min(Math.floor(cue), end)
    const f = cue - index
    let shot
    let from = index
    let to = index
    let mix = 0
    let morph = 0
    const grade = grades[index]
    let next = grade

    if (index < end && f >= HOLD) {
      morph = (f - HOLD) / (1 - HOLD)
      to = index + 1
      mix = morph
      next = grades[to]
      shot = lerpShot(frames[index].b, frames[to].a, ease(morph))
    } else {
      shot = lerpShot(frames[index].a, frames[index].b, ease(Math.min(f / HOLD, 1)))
      if (index === 0 && intro < 1) {
        from = DUST_ROW
        to = 0
        mix = ease(intro)
      }
    }

    const blend = ease(morph)
    uniforms.uColorA.value.copy(grade.a).lerp(next.a, blend)
    uniforms.uColorB.value.copy(grade.b).lerp(next.b, blend)
    clear.copy(grade.bg).lerp(next.bg, blend)
    renderer.setClearColor(clear, 1)

    uniforms.uFrom.value = from
    uniforms.uTo.value = to
    uniforms.uMix.value = mix
    uniforms.uTime.value = now / 1000
    uniforms.uBack.value = shot.back
    uniforms.uCenter.value = shot.cam

    cloud.position.set(...shot.pos)
    cloud.rotation.set(shot.rot[0] + Math.sin(now / 5200) * 0.012, shot.rot[1] + Math.sin(now / 4100) * 0.018, shot.rot[2])
    camera.position.set(0, 0, shot.cam)
    camera.rotation.z = Math.sin(cue * 2.1) * 0.012
    camera.updateMatrixWorld()
    cloud.updateMatrixWorld(true)

    placeLabels(index, f)
    renderer.render(scene, camera)
    onFrame?.({ index, morph, color: uniforms.uColorA.value })
  }
  raf = requestAnimationFrame(frame)

  return {
    intro() {
      if (!introStart) introStart = performance.now()
    },
    destroy() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      geometry.dispose()
      material.dispose()
      shapes.dispose()
      renderer.dispose()
    },
  }
}
