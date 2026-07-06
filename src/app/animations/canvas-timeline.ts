import { BackgroundTimeline } from "./background-timeline";

export class CanvasTimeline
  implements BackgroundTimeline {

  private progress = 0;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly frames: HTMLImageElement[],
    private readonly canvas: HTMLCanvasElement
  ) {}

  play() {}

  pause() {}

  getProgress() {
    return this.progress;
  }

  setProgress(progress: number) {
    this.progress = progress;

    const frame =
      Math.round(
        progress *
        (this.frames.length - 1)
      );

    this.render(frame);
  }

  private render(frame: number) {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.ctx.drawImage(
      this.frames[frame],
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}