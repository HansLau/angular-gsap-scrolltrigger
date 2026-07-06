import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { StoryController } from "../story-controller";

gsap.registerPlugin(ScrollTrigger);

export function createScrollTrigger(
  controller: StoryController,
  triggerElement: HTMLElement
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: triggerElement,
    start: "top top",
    end: "+=6000",
    pin: true,
    // No scrub: true — video currentTime is driven manually in onUpdate,
    // not by a GSAP tween. scrub would fight native play() during the intro.
    onUpdate(self) {
      controller.updateScroll(self.progress);
    },
  });
}
