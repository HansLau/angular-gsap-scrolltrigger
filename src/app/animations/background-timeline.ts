export interface BackgroundTimeline {
    play(): void;
    pause(): void;

    getProgress(): number;
    setProgress(progress: number): void;
}