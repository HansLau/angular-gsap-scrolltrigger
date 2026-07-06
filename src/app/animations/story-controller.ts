import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { BackgroundTimeline } from "./background-timeline";
import { VideoTimeline } from "./video-timeline";

gsap.registerPlugin(ScrollTrigger);

export class StoryController {
  private introProgress = 0;
  private scrollMode = false;
  private seekTween?: gsap.core.Tween;

  /**
   * True once the video has started playing at least one frame.
   * We refuse to enter scroll mode until this is true so we never
   * hand off to scroll before the intro has had a chance to begin.
   */
  private hasStartedPlaying = false;

  /** The active ScrollTrigger. Replaced on reenterLoopMode. */
  trigger?: ScrollTrigger;

  constructor(
    private readonly timeline: BackgroundTimeline,
    private readonly videoTimeline: VideoTimeline,
    private readonly createTrigger: () => ScrollTrigger
  ) {
    // Mark hasStartedPlaying on the first `playing` event.
    // This fires reliably once the browser actually starts decoding frames,
    // regardless of whether play() was called programmatically or via autoplay.
    this.videoTimeline.videoElement.addEventListener(
      'playing',
      () => { this.hasStartedPlaying = true; },
      { once: true }
    );
  }

  startIntro() {
    const video = this.videoTimeline.videoElement;

    if (!video.paused) {
      // Already playing — nothing to do.
      return;
    }

    const tryPlay = () => {
      video.play().catch(() => {
        // play() was rejected (e.g. media not ready yet).
        // Retry once the browser says it can play through.
        video.addEventListener('canplay', tryPlay, { once: true });
      });
    };

    tryPlay();
  }

  enterScrollMode() {
    if (this.scrollMode) {
      return;
    }

    // Don't hand off until the video has actually started playing.
    // This prevents an immediate enter on page load with a restored scrollY,
    // or when the browser hasn't finished the first autoplay yet.
    if (!this.hasStartedPlaying) {
      const video = this.videoTimeline.videoElement;
      // Re-attempt once the video starts playing.
      video.addEventListener('playing', () => this.enterScrollMode(), { once: true });
      return;
    }

    this.scrollMode = true;
    this.timeline.pause();
    this.introProgress = this.timeline.getProgress();

    const video = this.videoTimeline.videoElement;

    const doSeek = () => {
      this.seekTween = gsap.to(video, {
        currentTime: video.duration,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          // Seek done — release the section pin.
          this.trigger?.kill();
          this.trigger = undefined;
          ScrollTrigger.refresh();
        },
      });
    };

    if (!Number.isFinite(video.duration) || video.duration === 0) {
      video.addEventListener('loadedmetadata', doSeek, { once: true });
    } else {
      doSeek();
    }
  }

  reenterLoopMode() {
    if (!this.scrollMode) {
      return;
    }

    this.seekTween?.kill();
    this.seekTween = undefined;

    this.trigger?.kill();

    this.scrollMode = false;
    this.introProgress = 0;
    // Reset so the next enterScrollMode waits for playing again.
    this.hasStartedPlaying = false;

    // Recreate the pin.
    this.trigger = this.createTrigger();
    ScrollTrigger.refresh();

    // Restart the intro from the beginning.
    const video = this.videoTimeline.videoElement;
    video.currentTime = 0;
    this.startIntro();
  }

  updateScroll(scrollProgress: number) {
    if (!this.scrollMode) {
      return;
    }

    const progress =
      this.introProgress +
      scrollProgress * (1 - this.introProgress);

    this.timeline.setProgress(progress);
  }
}
