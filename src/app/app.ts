import { Component, signal, inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Button } from './components/button/button';
import { CollapsibleBlock } from './components/collapsible-block/collapsible-block';
import { ArticleCardComponent } from './components/article-card/article-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, CollapsibleBlock, ArticleCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-gsap-scrolltrigger');
  private platformId = inject(PLATFORM_ID);
  
  // Accordion state: tracks which block is currently open (null = all closed)
  protected openBlockHash = signal<string | null>(null);
  
  constructor() {
    // GSAP initialization for client-side only
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        // GSAP will be initialized here when needed
      }
    });
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
