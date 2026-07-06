import { BackgroundTimeline } from "./background-timeline";

export class VideoTimeline implements BackgroundTimeline {
  constructor(readonly videoElement: HTMLVideoElement) {}

  play() {
    return this.videoElement.play();
  }

  pause() {
    this.videoElement.pause();
  }

  getProgress() {
    const { duration } = this.videoElement;
    if (!Number.isFinite(duration) || duration === 0) {
      return 0;
    }
    return this.videoElement.currentTime / duration;
  }

  setProgress(progress: number) {
    const { duration } = this.videoElement;
    // Metadata may not be loaded yet; writing NaN would freeze the video.
    if (!Number.isFinite(duration) || duration === 0) {
      return;
    }
    this.videoElement.currentTime = progress * duration;
  }
}
