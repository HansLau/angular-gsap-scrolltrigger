import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';

@Component({
  selector: 'app-collapsible-block',
  templateUrl: './collapsible-block.html',
  styleUrl: './collapsible-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleBlock {
  title = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();
  hash = input.required<string>();
  isExpanded = input.required<boolean>();
  
  toggle = output<void>();
  scrollToBlock = output<HTMLElement>();
  
  protected elementId = computed(() => `block-${this.hash()}`);
  
  protected onBlockClick(event: Event): void {
    this.toggle.emit();
    const element = (event.currentTarget as HTMLElement);
    this.scrollToBlock.emit(element);
  }
}
