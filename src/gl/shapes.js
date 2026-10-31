import { geoEquirectangular, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import landTopo from 'world-atlas/land-110m.json'
import { places } from '../data/film.js'

// Every shape is N points of (x, y, z, emphasis). Points are shuffled so a morph reads as dust, not a wipe.

const RADIUS = 2
const TAU = Math.PI * 2

let seed = 1337
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(TAU * rnd())

function shuffled(points) {
  const count = points.length / 4
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    for (let k = 0; k < 4; k++) {
      const t = points[i * 4 + k]
      points[i * 4 + k] = points[j * 4 + k]
      points[j * 4 + k] = t
    }
  }
  return points
}

function writer(n) {
  const data = new Float32Array(n * 4)
  let i = 0
  return {
    data,
    get left() { return n - i },
    put(x, y, z, w) {
      if (i >= n) return
      data[i * 4] = x
      data[i * 4 + 1] = y
      data[i * 4 + 2] = z
      data[i * 4 + 3] = w
      i++
    },
  }
}

export function geoVec(lat, lon, r = RADIUS) {
  const a = (lat * Math.PI) / 180
  const b = (lon * Math.PI) / 180
  return [r * Math.cos(a) * Math.sin(b), r * Math.sin(a), r * Math.cos(a) * Math.cos(b)]
}

function landMask() {
  const w = 1440
  const h = 720
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const projection = geoEquirectangular().scale(w / TAU).translate([w / 2, h / 2])
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  geoPath(projection, ctx)(feature(landTopo, landTopo.objects.land))
  ctx.fill()
  const pixels = ctx.getImageData(0, 0, w, h).data
  return (lat, lon) => {
    const x = Math.min(w - 1, Math.max(0, Math.floor(((lon + 180) / 360) * w)))
    const y = Math.min(h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * h)))
    return pixels[(y * w + x) * 4 + 3] > 127
  }
}

function arc(out, a, b, count) {
  const from = geoVec(a.lat, a.lon, 1)
  const to = geoVec(b.lat, b.lon, 1)
  const omega = Math.acos(from[0] * to[0] + from[1] * to[1] + from[2] * to[2])
  for (let i = 0; i < count; i++) {
    const t = rnd()
    const s1 = Math.sin((1 - t) * omega) / Math.sin(omega)
    const s2 = Math.sin(t * omega) / Math.sin(omega)
    const r = RADIUS * (1 + Math.min(0.32, omega * 0.2) * Math.sin(Math.PI * t))
    const j = 0.0035
    out.put(
      (from[0] * s1 + to[0] * s2) * r + gauss() * j,
      (from[1] * s1 + to[1] * s2) * r + gauss() * j,
      (from[2] * s1 + to[2] * s2) * r + gauss() * j,
      1.15,
    )
  }
}

// A third of the dots crowd around the focus so the close-up keeps its detail.
function globe(n, isLand, focus, routes, cities) {
  const out = writer(n)
  const arcN = Math.floor(n * 0.035)
  routes.forEach(([a, b]) => arc(out, a, b, Math.floor(arcN / routes.length)))
  const cityN = Math.floor((n * 0.006) / cities.length)
  cities.forEach((c) => {
    const [x, y, z] = geoVec(c.lat, c.lon, RADIUS * 1.003)
    for (let i = 0; i < cityN; i++) out.put(x + gauss() * 0.01, y + gauss() * 0.01, z + gauss() * 0.01, 1.8)
  })

  const focusN = Math.floor(n * 0.3)
  for (let i = 0, guard = 0; i < focusN && guard < focusN * 200; guard++) {
    const lat = focus.lat + gauss() * focus.span
    const lon = focus.lon + (gauss() * focus.span) / Math.cos((focus.lat * Math.PI) / 180)
    if (!isLand(lat, lon)) continue
    const [x, y, z] = geoVec(lat, lon)
    out.put(x, y, z, 0.26 + rnd() * 0.2)
    i++
  }

  const oceanN = Math.floor(n * 0.05)
  const landN = out.left - oceanN
  const golden = Math.PI * (3 - Math.sqrt(5))
  const lattice = Math.floor(landN / 0.27)
  let placed = 0
  for (let i = 0; i < lattice && placed < landN; i++) {
    const y = 1 - (i / (lattice - 1)) * 2
    const lat = (Math.asin(y) * 180) / Math.PI
    const lon = (((i * golden) % TAU) * 180) / Math.PI - 180
    if (!isLand(lat, lon)) continue
    const [px, py, pz] = geoVec(lat, lon)
    out.put(px, py, pz, 0.34 + rnd() * 0.3)
    placed++
  }
  while (out.left > 0) {
    const [x, y, z] = geoVec((Math.asin(rnd() * 2 - 1) * 180) / Math.PI, rnd() * 360 - 180)
    out.put(x, y, z, 0.1)
  }
  return shuffled(out.data)
}

function nameShape(n, text) {
  const w = 1000
  const h = 620
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.font = '430px "Rozha One"'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.fillText(text, w / 2, h / 2)
  const px = ctx.getImageData(0, 0, w, h).data
  const hits = []
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (px[(y * w + x) * 4 + 3] > 128) hits.push(x, y)
    }
  }
  const out = writer(n)
  const dust = Math.floor(n * 0.1)
  const scale = 4.6 / h
  while (out.left > dust) {
    const i = Math.floor(rnd() * (hits.length / 2)) * 2
    out.put((hits[i] - w / 2 + rnd() * 2) * scale, (h / 2 - hits[i + 1] + rnd() * 2) * scale, gauss() * 0.05, rnd() < 0.07 ? 1.5 : 0.3 + rnd() * 0.3)
  }
  while (out.left > 0) out.put(gauss() * 3.4, gauss() * 1.8, gauss() * 1.4, 0.16)
  return shuffled(out.data)
}

// Two film reels joined by a perforated strip: one for online, one for offline.
function twinReels(n) {
  const out = writer(n)
  const r = 1.22
  const centers = [[-1.42, 0.02], [1.42, 0.02]]
  const holeR = 0.31
  const holeAt = 0.68

  const inHole = (x, y) => {
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * TAU + Math.PI / 2
      if (Math.hypot(x - Math.cos(a) * holeAt, y - Math.sin(a) * holeAt) < holeR) return true
    }
    return false
  }
  const discN = Math.floor(n * 0.72)
  for (let i = 0; i < discN; i++) {
    const [cx, cy] = centers[i % 2]
    let x, y, d
    do {
      const ang = rnd() * TAU
      d = Math.sqrt(rnd()) * r
      x = Math.cos(ang) * d
      y = Math.sin(ang) * d
    } while (inHole(x, y) || d < 0.1)
    const rim = d > r * 0.93 || d < 0.2
    out.put(cx + x, cy + y, (rnd() - 0.5) * 0.16, rim ? 1.25 : 0.55 + rnd() * 0.2)
  }

  const band = 0.17
  const strip = (x, y, s) => {
    const v = (rnd() - 0.5) * 2
    const edge = Math.abs(v) > 0.68
    if (edge && (s * 33) % 1 < 0.5) return
    out.put(x, y + v * band, (rnd() - 0.5) * 0.04, edge ? 1 : 0.62)
  }
  while (out.left > 0) {
    const s = rnd()
    if (rnd() < 0.5) {
      strip(-2.9 + s * 5.8, r + band + 0.03, s)
    } else {
      strip(-2.64 + s * 5.28, -r - 0.05 - Math.cos((s - 0.5) * Math.PI) * 0.72, s)
    }
  }
  return shuffled(out.data)
}

function chainTree(n) {
  const out = writer(n)
  const counts = [1, 2, 3, 5, 8, 13]
  const levels = counts.map((c, l) =>
    Array.from({ length: c }, (_, i) => {
      const spread = 0.5 + l * 0.46
      return [c === 1 ? 0 : (i / (c - 1) - 0.5) * spread * 2, 2.25 - l * 0.9, (rnd() - 0.5) * 0.8]
    }),
  )
  const nodeN = Math.floor((n * 0.42) / counts.reduce((a, b) => a + b, 0))
  levels.forEach((level, l) =>
    level.forEach(([x, y, z]) => {
      const size = 0.13 - l * 0.012
      const count = l === 0 ? nodeN * 4 : nodeN
      for (let i = 0; i < count; i++) {
        const ang = rnd() * TAU
        const d = Math.sqrt(rnd())
        const ring = d > 0.86
        out.put(x + Math.cos(ang) * d * size, y + Math.sin(ang) * d * size, z + gauss() * 0.012, ring ? 1.4 : 0.7)
      }
    }),
  )
  const edges = []
  levels.forEach((level, l) => {
    if (l === 0) return
    level.forEach((node, i) => {
      edges.push([levels[l - 1][Math.floor((i / level.length) * levels[l - 1].length)], node])
    })
  })
  while (out.left > 0) {
    const [a, b] = edges[Math.floor(rnd() * edges.length)]
    const t = rnd()
    const e = t * t * (3 - 2 * t)
    out.put(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, 0.46)
  }
  return shuffled(out.data)
}

// An n8n-style canvas: node cards joined by bezier wires, with the model steps in the middle.
function workflow(n) {
  const out = writer(n)
  const columns = [[0], [-1, 1], [-1.45, 0, 1.45], [-0.8, 0.8], [0]]
  const nodes = columns.flatMap((col, c) =>
    col.map((y) => ({ x: -2.6 + c * 1.3, y: y * 1.05, z: (rnd() - 0.5) * 1, c })),
  )
  const w = 0.42
  const h = 0.25
  const cardN = Math.floor((n * 0.5) / nodes.length)
  nodes.forEach((node) => {
    const model = node.c === 2
    for (let i = 0; i < cardN; i++) {
      const u = (rnd() - 0.5) * 2
      const v = (rnd() - 0.5) * 2
      const edge = Math.abs(u) > 0.9 || Math.abs(v) > 0.84
      out.put(node.x + u * w, node.y + v * h, node.z, edge ? 1.8 : model ? 0.92 : 0.5)
    }
  })
  const links = []
  nodes.forEach((a) => nodes.forEach((b) => {
    if (b.c === a.c + 1) links.push([a, b])
  }))
  while (out.left > 0) {
    const [a, b] = links[Math.floor(rnd() * links.length)]
    const t = rnd()
    const x0 = a.x + w
    const x1 = b.x - w
    const e = t * t * (3 - 2 * t)
    out.put(x0 + (x1 - x0) * t, a.y + (b.y - a.y) * e, a.z + (b.z - a.z) * t, 0.62)
  }
  return shuffled(out.data)
}

function atom(n) {
  const out = writer(n)
  const a = 2.7
  const b = 1.03
  const tilts = [0, Math.PI / 3, -Math.PI / 3]
  const onOrbit = (tilt, t, off) => {
    const x = Math.cos(t) * a
    const y = Math.sin(t) * b
    return [
      x * Math.cos(tilt) - y * Math.sin(tilt) + off[0],
      x * Math.sin(tilt) + y * Math.cos(tilt) + off[1],
      off[2],
    ]
  }
  const nucleusN = Math.floor(n * 0.14)
  for (let i = 0; i < nucleusN; i++) {
    const d = Math.cbrt(rnd()) * 0.46
    const u = rnd() * 2 - 1
    const ang = rnd() * TAU
    const s = Math.sqrt(1 - u * u)
    out.put(d * s * Math.cos(ang), d * s * Math.sin(ang), d * u, 1.15)
  }
  const electronN = Math.floor(n * 0.04)
  for (let i = 0; i < electronN; i++) {
    const k = i % 3
    const [x, y, z] = onOrbit(tilts[k], 0.9 + k * 2.1, [gauss() * 0.06, gauss() * 0.06, gauss() * 0.06])
    out.put(x, y, z, 2)
  }
  while (out.left > 0) {
    const off = [gauss() * 0.032, gauss() * 0.032, gauss() * 0.032]
    const [x, y, z] = onOrbit(tilts[Math.floor(rnd() * 3)], rnd() * TAU, off)
    out.put(x, y, z, 0.95)
  }
  return shuffled(out.data)
}

function dust(n) {
  const out = writer(n)
  while (out.left > 0) out.put((rnd() - 0.5) * 20, (rnd() - 0.5) * 12, (rnd() - 0.5) * 11 - 2, 0.16 + rnd() * rnd() * 0.75)
  return shuffled(out.data)
}

// The iris-out that closes the film: a ring of light around the contact card.
function iris(n) {
  const out = writer(n)
  const ringN = Math.floor(n * 0.88)
  for (let i = 0; i < ringN; i++) {
    const ang = rnd() * TAU
    const r = 3.1 + Math.abs(gauss()) * (rnd() < 0.72 ? 0.05 : 0.5)
    out.put(Math.cos(ang) * r, Math.sin(ang) * r, gauss() * 0.06, r < 3.2 ? 1.5 : 0.45)
  }
  while (out.left > 0) out.put((rnd() - 0.5) * 18, (rnd() - 0.5) * 10, (rnd() - 0.5) * 5 - 1, 0.12)
  return shuffled(out.data)
}

export function buildShapes(n, hindiName) {
  seed = 1337
  const isLand = landMask()
  const at = (name) => places.find((p) => p.name === name)
  const gopalpur = at('Gopalpur')
  const jalandhar = at('Jalandhar')
  const mohali = at('Mohali')
  const noida = at('Noida')
  const uk = at('United Kingdom')
  const jamaica = at('Jamaica')

  return [
    nameShape(n, hindiName),
    globe(n, isLand, { lat: 24, lon: 80, span: 11 }, [[gopalpur, jalandhar], [mohali, noida]], [gopalpur, jalandhar, mohali, noida]),
    twinReels(n),
    chainTree(n),
    globe(n, isLand, { lat: 50, lon: 5, span: 11 }, [[mohali, uk]], [mohali, uk]),
    workflow(n),
    globe(n, isLand, { lat: 18, lon: -77, span: 13 }, [[uk, jamaica], [mohali, jamaica]], [jamaica]),
    atom(n),
    dust(n),
    iris(n),
  ]
}
