import { Component, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "hero-video",
  templateUrl: "./hero-video.component.html",
  styleUrl: "./hero-video.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  // Component renders the fullscreen video.
  // All playback control is handled by the parent via StoryController.
}