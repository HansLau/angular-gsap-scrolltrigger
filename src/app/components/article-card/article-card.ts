import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.html',
  styleUrls: ['./article-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ArticleCardComponent {
  category = input.required<string>();
  title = input.required<string>();
  description = input.required<string>();
  author = input.required<string>();
  authorRole = input.required<string>();
  imageUrl = input.required<string>();
  link = input<string>('#');
}
