// One camera move per scene: `a` is the frame the morph lands on, `b` is where it drifts as you scroll.
// pos moves the cloud, rot is cloud rotation in radians, cam is camera distance, back dims the far side.

const face = (lat, lon) => [(lat * Math.PI) / 180, (-lon * Math.PI) / 180, 0]

export const shots = [
  {
    a: { pos: [0, 0.92, 0], rot: [0, -0.1, 0], cam: 11, back: 0 },
    b: { pos: [0, 1, 0], rot: [0.08, 0.2, 0], cam: 9.8, back: 0 },
  },
  {
    a: { pos: [1.65, 0, 0], rot: face(14, 70), cam: 7.2, back: 0.94 },
    b: { pos: [0.5, 0, 0], rot: face(27, 80), cam: 3.9, back: 0.97 },
  },
  {
    a: { pos: [-2.4, 0, 0], rot: [0.12, 0.42, 0], cam: 10.4, back: 0.1 },
    b: { pos: [-2.3, 0, 0], rot: [-0.06, 0.08, 0.04], cam: 9.4, back: 0.1 },
  },
  {
    a: { pos: [2.3, 0, 0], rot: [0.28, -0.36, 0], cam: 10.2, back: 0.2 },
    b: { pos: [2.2, 0, 0], rot: [0.02, -0.06, 0], cam: 9.2, back: 0.2 },
  },
  {
    a: { pos: [-1.6, 0, 0], rot: face(30, 40), cam: 7, back: 0.94 },
    b: { pos: [-0.62, 0, 0], rot: face(50, 5), cam: 4.3, back: 0.97 },
  },
  {
    a: { pos: [2.5, 0, 0], rot: [0.16, -0.5, 0.06], cam: 11, back: 0.15 },
    b: { pos: [2.4, 0, 0], rot: [-0.04, -0.1, 0], cam: 10, back: 0.15 },
  },
  {
    a: { pos: [-1.6, 0, 0], rot: face(28, -40), cam: 7, back: 0.94 },
    b: { pos: [-0.6, 0, 0], rot: face(18, -77), cam: 4.2, back: 0.97 },
  },
  {
    a: { pos: [2.4, 0, 0], rot: [0.38, -0.5, 0], cam: 10, back: 0.15 },
    b: { pos: [2.35, 0, 0], rot: [0.08, -0.1, 0.5], cam: 9, back: 0.15 },
  },
  {
    a: { pos: [0, 0, 0], rot: [0, 0, 0], cam: 9, back: 0 },
    b: { pos: [0, 2.4, 0], rot: [0.12, 0, 0], cam: 7, back: 0 },
  },
  {
    a: { pos: [0, 0, 0], rot: [0, 0, 0], cam: 9, back: 0 },
    b: { pos: [0, 0, 0], rot: [0, 0, 0.3], cam: 8.3, back: 0 },
  },
]

// Portrait screens stack the cloud above the text, so it pulls back and lifts instead of sliding aside.
export function portrait(frame, index, aspect) {
  if (index === 0 || index >= 8) {
    return { ...frame, pos: [0, frame.pos[1] * 0.6, 0], cam: frame.cam * 1.75 }
  }
  if (frame.cam < 5) return { ...frame, pos: [0, 0.42, 0], cam: frame.cam * 1.2 }
  const cam = frame.cam * Math.min(2, Math.max(1.2, 0.92 / aspect))
  return { ...frame, pos: [0, cam * 0.145, 0], cam }
}
