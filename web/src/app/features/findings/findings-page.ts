import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject, distinctUntilChanged, catchError, combineLatest, debounceTime, map, of, startWith, switchMap,
} from 'rxjs';
import { Finding, FindingsService, Page, Severity, Status } from '../../core/findings';
import { FindingsTable } from './findings-table';
import { SummaryCards } from './summary-cards';
import { FindingDetail } from './finding-detail';

type ListState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: Page<Finding> };

@Component({
  selector: 'app-findings-page',
  imports: [ReactiveFormsModule, AsyncPipe, FindingsTable, SummaryCards, FindingDetail],
  templateUrl: './findings-page.html',
  styleUrl: './findings-page.css',
})
export class FindingsPage {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(FindingsService);

  filters = this.fb.nonNullable.group({ search: '', severity: '', status: '' });
  skeletonRows = [1, 2, 3, 4, 5, 6];

  // Emitir aqui força um novo pedido (botão "Tentar de novo")
  private reload$ = new BehaviorSubject<void>(undefined);

 state$ = combineLatest([
  this.route.queryParams.pipe(
    map(({ finding, ...rest }) => rest),                 // tira o "finding"
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  ),
  this.reload$,
]).pipe(
  switchMap(([params]) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== ''),
    );
    return this.api.list(clean).pipe(
      map((data): ListState => ({ status: 'ready', data })),
      catchError(() => of<ListState>({ status: 'error' })),
      startWith<ListState>({ status: 'loading' }),
    );
  }),
);

  summary$ = this.reload$.pipe(
  switchMap(() => this.api.summary().pipe(catchError(() => of(null)))),
);

  activeSeverity$ = this.route.queryParams.pipe(map((p) => p['severity'] ?? ''));

  constructor() {
    // URL -> formulário (só no arranque)
    const p = this.route.snapshot.queryParams;
    this.filters.patchValue(
      { search: p['search'] ?? '', severity: p['severity'] ?? '', status: p['status'] ?? '' },
      { emitEvent: false },
    );

    // Formulário -> URL
    this.filters.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((v) =>
        this.router.navigate([], {
          queryParams: { ...v, page: 1 },
          queryParamsHandling: 'merge',
        }),
      );
  }

  goToPage(page: number) {
    window.scrollTo({ top: 0 });
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
  }

  totalPages(total: number, pageSize: number) {
    return Math.max(1, Math.ceil(total / pageSize));
  }

  pickSeverity(severity: Severity) {
    const current = this.route.snapshot.queryParams['severity'];
    this.filters.patchValue({ severity: current === severity ? '' : severity });
  }

  retry() {
    this.reload$.next();
  }

  clearFilters() {
    this.filters.reset({ search: '', severity: '', status: '' }, { emitEvent: false });
    // null remove o parâmetro do URL
    this.router.navigate([], {
      queryParams: { search: null, severity: null, status: null, page: null },
      queryParamsHandling: 'merge',
    });
  }

  saving = signal(false);
saveError = signal<string | null>(null);

// Finding selecionado (guardado para mostrar no painel)
selected = signal<Finding | null>(null);

openDetail(f: Finding) {
  console.log('openDetail chamado', f);
  this.saveError.set(null);
  this.selected.set(f);
  this.router.navigate([], { queryParams: { finding: f.id }, queryParamsHandling: 'merge' });
}

closeDetail() {
  this.selected.set(null);
  this.router.navigate([], { queryParams: { finding: null }, queryParamsHandling: 'merge' });
}

saveStatus(status: Status) {
  const f = this.selected();
  if (!f) return;
  this.saving.set(true);
  this.saveError.set(null);

  this.api.updateStatus(f.id, status).subscribe({
    next: () => {
      this.saving.set(false);
      this.closeDetail();
      this.reload$.next();                 // recarrega a lista
      this.summary$ = this.api.summary().pipe(catchError(() => of(null))); // e os cartões
    },
    error: (err) => {
      this.saving.set(false);
      this.saveError.set(
        err.status === 403
          ? 'Não tens permissão para alterar o estado.'
          : 'Não foi possível guardar. Tenta novamente.',
      );
    },
  });
}
}