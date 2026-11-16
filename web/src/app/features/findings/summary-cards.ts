import { Component, computed, input, output } from '@angular/core';
import { Severity, SeverityCount } from '../../core/findings';
import { SeverityBadge } from '../../shared/severity-badge';

const ORDER: Severity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

@Component({
  selector: 'app-summary-cards',
  imports: [SeverityBadge],
  templateUrl: './summary-cards.html',
  styleUrl: './summary-cards.css',
})
export class SummaryCards {
  counts = input.required<SeverityCount[]>();
  active = input<string>('');
  pick = output<Severity>();

  // Garante as 5 severidades, mesmo que a API não devolva alguma (count 0)
  cards = computed(() =>
    ORDER.map((severity) => ({
      severity,
      count: this.counts().find((c) => c.severity === severity)?.count ?? 0,
    })),
  );
}