import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { StoryController } from "../story-controller";


gsap.registerPlugin(ScrollTrigger);

export function createMasterTimeline(
  controller: StoryController
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=6000",
      pin: true,
      scrub: true,
    },
  });

  tl.to(
    {},
    {
      duration: 1,

      onUpdate() {
        controller.updateScroll(tl.progress());
      },
    }
  );

  return tl;
}