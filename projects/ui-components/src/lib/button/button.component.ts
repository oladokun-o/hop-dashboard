import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'hop-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
      [attr.aria-label]="ariaLabel"
    >
      @if (loading()) {
      <span class="hop-button__spinner" aria-hidden="true"></span>
      } @if (icon && !loading()) {
      <span
        class="hop-button__icon"
        [innerHTML]="icon"
        aria-hidden="true"
      ></span>
      } @if (hasContent()) {
      <span class="hop-button__text">
        <ng-content></ng-content>
      </span>
      } @if (badge) {
      <span class="hop-button__badge">{{ badge }}</span>
      }
    </button>
  `,
  styleUrls: ['./button.component.scss'],
})
export class HopButtonComponent implements OnChanges {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() badge?: string | number;
  @Input() ariaLabel?: string;
  @Input() fullWidth = false;
  @Input() disabledState = false;

  @Output() click = new EventEmitter<Event>();

  // Signals for reactive state
  disabled = signal(false);
  loading = signal(false);

  // Computed class string
  buttonClasses = computed(() => {
    const classes = [
      'hop-button',
      `hop-button--${this.variant}`,
      `hop-button--${this.size}`,
    ];

    if (this.fullWidth) classes.push('hop-button--full-width');
    if (this.disabled()) classes.push('hop-button--disabled');
    if (this.loading()) classes.push('hop-button--loading');
    if (this.icon && !this.hasContent()) classes.push('hop-button--icon-only');

    return classes.join(' ');
  });

  @Input()
  set isDisabled(value: boolean) {
    this.disabled.set(value);
  }

  @Input()
  set isLoading(value: boolean) {
    this.loading.set(value);
  }

  handleClick(event: Event) {
    if (!this.disabled() && !this.loading()) {
      this.click.emit(event);
    }
  }

  hasContent(): boolean {
    return true; // Angular content projection will handle this
  }

  ngOnChanges() {
    // Ensure disabledState input updates the disabled signal
    this.disabled.set(this.disabledState);
  }
}
