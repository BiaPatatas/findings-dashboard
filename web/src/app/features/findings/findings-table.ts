import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Finding } from '../../core/findings';
import { SeverityBadge } from '../../shared/severity-badge';

@Component({
  selector: 'app-findings-table',
  imports: [SeverityBadge, DatePipe],
  templateUrl: './findings-table.html',
  styleUrl: './findings-table.css',
})
export class FindingsTable {
  items = input.required<Finding[]>();
  selectedId = input<number | null>(null);
  select = output<Finding>();
}