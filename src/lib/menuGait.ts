/** Foot coordinates on the floor, relative to the moving pelvis. */
export function footPose(cycle: number, side: number, stride: number) {
  const phase = ((cycle + (side > 0 ? 0.5 : 0)) % 1 + 1) % 1;
  const stance = 0.6;
  const swing = Math.max(0, (phase - stance) / (1 - stance));
  // The swing starts/ends at the stance velocity, with zero acceleration.
  // During stance, -phase * stride cancels the body's forward movement.
  const ease = swing ** 3 * (10 - 15 * swing + 6 * swing ** 2);
  return {
    forward: (phase < stance ? stance / 2 - phase :
      -stance / 2 - (1 - stance) * swing + ease) * stride,
    lift: Math.sin(Math.PI * swing) ** 2,
  };
}

/** Raised limbs recede toward the same vanishing point, regardless of heading. */
export function projectLimb(x: number, y: number, z: number, width: number, height: number) {
  const depth = 600 / (600 + z);
  return {
    x: width / 2 + (x - width / 2) * depth,
    y: height * 0.18 + (y - height * 0.18) * depth - z * 0.68,
    depth,
  };
}

export function walkerScale(width: number, height: number, size: number) {
  return Math.max(0.45, Math.min(width / 1100, height / 700, 1.4)) * size;
}
