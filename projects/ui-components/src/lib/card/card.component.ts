import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hop-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses()">
      @if (title || hasHeaderContent()) {
      <header class="hop-card__header">
        @if (title) {
        <h3 class="hop-card__title">{{ title }}</h3>
        } @if (subtitle) {
        <p class="hop-card__subtitle">{{ subtitle }}</p>
        }

        <div class="hop-card__header-actions">
          <ng-content select="[slot=header-actions]"></ng-content>
        </div>
      </header>
      }

      <div class="hop-card__body">
        <ng-content></ng-content>
      </div>

      @if (hasFooterContent()) {
      <footer class="hop-card__footer">
        <ng-content select="[slot=footer]"></ng-content>
      </footer>
      } @if (loading) {
      <div class="hop-card__loading">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
      </div>
      }
    </div>
  `,
  styleUrls: ['./card.component.scss'],
})
export class HopCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() variant: 'default' | 'outlined' | 'elevated' | 'ghost' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() hoverable = false;
  @Input() clickable = false;

  cardClasses = computed(() => {
    const classes = [
      'hop-card',
      `hop-card--${this.variant}`,
      `hop-card--${this.size}`,
    ];

    if (this.loading) classes.push('hop-card--loading');
    if (this.hoverable) classes.push('hop-card--hoverable');
    if (this.clickable) classes.push('hop-card--clickable');

    return classes.join(' ');
  });

  hasHeaderContent(): boolean {
    // This would need to be implemented with ViewChild or similar
    // For now, return false as a placeholder
    return false;
  }

  hasFooterContent(): boolean {
    // This would need to be implemented with ViewChild or similar
    // For now, return false as a placeholder
    return false;
  }
}
