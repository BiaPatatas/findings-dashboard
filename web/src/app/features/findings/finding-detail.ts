import { DatePipe } from '@angular/common';
import { Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Finding, Status } from '../../core/findings';
import { SeverityBadge } from '../../shared/severity-badge';

@Component({
  selector: 'app-finding-detail',
  imports: [SeverityBadge, DatePipe, FormsModule],
  templateUrl: './finding-detail.html',
  styleUrl: './finding-detail.css',
  host: { '(keydown.escape)': 'close.emit()' },
})
export class FindingDetail {
  finding = input.required<Finding>();
  saving = input(false);
  errorMsg = input<string | null>(null);

  close = output<void>();
  save = output<Status>();

  newStatus = signal<Status>('OPEN');
  heading = viewChild<ElementRef<HTMLElement>>('heading');

  statuses: { value: Status; label: string }[] = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'FALSE_POSITIVE', label: 'False positive' },
  ];

  constructor() {
    // Quando muda o finding mostrado: sincroniza o select e move o foco para o título
    effect(() => {
      this.newStatus.set(this.finding().status);
      this.heading()?.nativeElement.focus();
    });
  }
}