/** Resolve CSS tokens once when preparing canvas/WebGL assets. */
export function readPalette() {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string) => css.getPropertyValue(name).trim();
  return {
    sage: token("--color-primary"),
    pistachio: token("--color-surface-soft"),
    olive: token("--color-primary-hover"),
    ink: token("--color-text"),
    paper: token("--color-bg"),
    background: token("--color-bg"),
  };
}
