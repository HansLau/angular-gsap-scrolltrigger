import { Component, input, output, signal, ChangeDetectionStrategy, computed } from '@angular/core';

@Component({
  selector: 'app-collapsible-block',
  templateUrl: './collapsible-block.html',
  styleUrl: './collapsible-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.expanded]': 'isExpanded()',
    '[class.collapsed]': '!isExpanded()',
  }
})
export class CollapsibleBlock {
  title = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();
  hash = input.required<string>();
  
  scrollToBlock = output<HTMLElement>();
  
  protected isExpanded = signal(false);
  protected elementId = computed(() => `block-${this.hash()}`);
  
  protected toggleExpanded(): void {
    this.isExpanded.update(value => !value);
  }
  
  protected onBlockClick(event: MouseEvent): void {
    this.toggleExpanded();
    const element = (event.currentTarget as HTMLElement);
    this.scrollToBlock.emit(element);
  }
}
