// Shared between the DOM scroll timelines and the WebGL frame loop, which must not re-render React.
export const store = { cue: 0, engine: null, lenis: null }
