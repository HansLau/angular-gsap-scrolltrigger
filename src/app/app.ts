import { 
  Component, 
  signal, 
  inject, 
  PLATFORM_ID, 
  afterNextRender, 
  viewChild, 
  ElementRef 
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Button } from './components/button/button';
import { CollapsibleBlock } from './components/collapsible-block/collapsible-block';
import { ArticleCardComponent } from './components/article-card/article-card';
import { LandingComponent as HeroVideo } from './components/specific/hero-video/hero-video.component';
import { StoryController } from './animations/story-controller';
import { VideoTimeline } from './animations/video-timeline';
import { createScrollTrigger } from './animations/gsap/create-scroll-trigger';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, CollapsibleBlock, ArticleCardComponent, HeroVideo],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Top scroll band (px) reserved for the intro loop before scroll mode engages. */
  private static readonly TOP_MARGIN_PX = 10;

  protected readonly title = signal('angular-gsap-scrolltrigger');
  private platformId = inject(PLATFORM_ID);
  
  // Get reference to the hero video component's host element.
  // NOTE: `#heroVideoComponent` is on a component, so we must read ElementRef
  // explicitly, otherwise viewChild() returns the component instance.
  private heroVideoComponent = viewChild('heroVideoComponent', { read: ElementRef });
  private heroSection = viewChild<ElementRef>('heroSection');
  
  // Story controller for managing video playback based on scroll
  private story?: StoryController;
  
  // Accordion state: tracks which block is currently open (null = all closed)
  protected openBlockHash = signal<string | null>(null);
  
  constructor() {
    // GSAP initialization for client-side only
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.initializeVideoScrollControl();
      }
    });
  }
  
  private initializeVideoScrollControl(): void {
    const componentRef = this.heroVideoComponent();
    if (!componentRef) return;

    const sectionRef = this.heroSection();
    if (!sectionRef) return;

    const videoElement = componentRef.nativeElement.querySelector('video') as HTMLVideoElement;
    if (!videoElement) return;

    const sectionElement = sectionRef.nativeElement as HTMLElement;
    const videoTimeline = new VideoTimeline(videoElement);

    // Factory so the controller can recreate the trigger on reenterLoopMode.
    const makeTrigger = () => createScrollTrigger(this.story!, sectionElement);

    this.story = new StoryController(videoTimeline, videoTimeline, makeTrigger);

    // `autoplay` + `muted` on the <video> handles the intro on first load.
    // startIntro() only needs to ensure it's playing (e.g. after a re-entry).
    this.story.startIntro();

    // Create the initial pin on the hero section.
    this.story.trigger = makeTrigger();

    // Past TOP_MARGIN_PX → scroll mode. Back inside → loop mode.
    const handleScroll = (): void => {
      if (window.scrollY > App.TOP_MARGIN_PX) {
        this.story?.enterScrollMode();
      } else {
        this.story?.reenterLoopMode();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Do NOT call handleScroll() on init — scrollY is 0 on fresh load and
    // calling reenterLoopMode() before the video has played creates a
    // redundant trigger. Let the first actual scroll event drive the state.
  }
  
  protected toggleBlock(hash: string): void {
    // If clicking the currently open block, close it. Otherwise, open the new one.
    this.openBlockHash.update(current => current === hash ? null : hash);
  }
  
  protected scrollToBlock(element: HTMLElement): void {
    if (isPlatformBrowser(this.platformId)) {
      // This is your entrypoint for GSAP ScrollTrigger
      // You can import gsap here and use it:
      // import('gsap').then(({ gsap }) => {
      //   gsap.to(window, {
      //     duration: 1,
      //     scrollTo: { y: element, offsetY: 100 },
      //     ease: 'power2.inOut'
      //   });
      // });
      
      // For now, using native smooth scroll
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
