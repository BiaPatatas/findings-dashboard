import { Component, computed, input } from '@angular/core';
import { Severity } from '../core/findings';

const CONFIG: Record<Severity, { icon: string; label: string }> = {
  CRITICAL: { icon: '⛔', label: 'Critical' },
  HIGH: { icon: '▲', label: 'High' },
  MEDIUM: { icon: '◆', label: 'Medium' },
  LOW: { icon: '●', label: 'Low' },
  INFO: { icon: 'ℹ', label: 'Info' },
};

@Component({
  selector: 'app-severity-badge',
  templateUrl: './severity-badge.html',
  styleUrl: './severity-badge.css',
})
export class SeverityBadge {
  severity = input.required<Severity>();
  cfg = computed(() => CONFIG[this.severity()]);
}