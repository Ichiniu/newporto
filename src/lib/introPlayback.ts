export type IntroState = "loading" | "playing" | "leaving";

interface IntroOptions {
  video: HTMLVideoElement;
  source: string;
  playbackRate?: number;
  onState: (state: IntroState) => void;
  onProgress: (percent: number) => void;
  onComplete: () => void;
}

/** A single, disposable playback session. Progress measures the video, not page load. */
export function createIntroPlayback({ video, source, playbackRate = 2.0, onState, onProgress, onComplete }: IntroOptions) {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let disposed = false, leaving = false, attempt = 0;
  let exitTimer: ReturnType<typeof setTimeout> | undefined;
  let watchdog: ReturnType<typeof setInterval> | undefined;
  let lastTime = 0, lastProgressAt = performance.now();

  const applySpeed = () => {
    video.defaultPlaybackRate = playbackRate;
    video.playbackRate = playbackRate;
  };

  const finish = (immediate = false) => {
    if (disposed || leaving) return;
    leaving = true;
    attempt++;
    video.pause();
    clearInterval(watchdog);
    onState("leaving");
    exitTimer = setTimeout(() => { if (!disposed) onComplete(); }, immediate ? 0 : 350);
  };

  const play = () => {
    if (disposed || leaving || document.hidden) return;
    lastProgressAt = performance.now();
    const id = ++attempt;
    onState("loading");
    applySpeed();
    video.play().catch(() => {
      if (disposed || leaving || document.hidden || id !== attempt) return;
      finish();
    });
  };
  const onPlaying = () => {
    if (disposed || leaving || document.hidden) return;
    lastProgressAt = performance.now();
    applySpeed();
    onState("playing");
  };
  const onTime = () => {
    if (disposed || leaving) return;
    if (video.currentTime !== lastTime) {
      lastTime = video.currentTime;
      lastProgressAt = performance.now();
    }
    if (Number.isFinite(video.duration) && video.duration > 0) {
      onProgress(Math.min(100, Math.max(0, video.currentTime / video.duration * 100)));
    }
  };
  const onEnded = () => { onProgress(100); finish(); };
  const onError = () => finish();
  const onWaiting = () => { if (!leaving) onState("loading"); };
  const onVisibility = () => {
    if (document.hidden) { attempt++; video.pause(); }
    else play();
  };
  const onMotion = () => { if (motion.matches) finish(true); };
  const onLoadedMetadata = () => { applySpeed(); };
  const events = { playing: onPlaying, timeupdate: onTime, ended: onEnded, error: onError, waiting: onWaiting, loadedmetadata: onLoadedMetadata };
  for (const [name, handler] of Object.entries(events)) video.addEventListener(name, handler);
  document.addEventListener("visibilitychange", onVisibility);
  motion.addEventListener("change", onMotion);

  if (motion.matches) {
    // Do not even fetch the video for reduced-motion visitors.
    finish(true);
  } else {
    video.muted = true;
    applySpeed();
    video.src = source;
    video.load();
    applySpeed();
    play();
    watchdog = setInterval(() => {
      if (!document.hidden && performance.now() - lastProgressAt > 5000) finish();
    }, 1000);
  }

  return {
    skip: () => finish(motion.matches),
    dispose: () => {
      disposed = true;
      attempt++;
      clearTimeout(exitTimer);
      clearInterval(watchdog);
      for (const [name, handler] of Object.entries(events)) video.removeEventListener(name, handler);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      video.pause();
      video.removeAttribute("src");
      video.load();
    },
  };
}
