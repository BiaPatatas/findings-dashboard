import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'FALSE_POSITIVE';

export interface Finding {
  id: number;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  firstSeen: string;
  project: { name: string };
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SeverityCount {
  severity: Severity;
  count: number;
}

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class FindingsService {
  private http = inject(HttpClient);

  list(params: Record<string, string | number>) {
    return this.http.get<Page<Finding>>(`${API}/findings`, { params });
  }

  summary() {
    return this.http.get<SeverityCount[]>(`${API}/findings/summary`);
  }

  updateStatus(id: number, status: Status) {
    return this.http.patch<Finding>(
      `${API}/findings/${id}/status`,
      { status },
      { headers: { 'x-role': 'analyst' } },
    );
  }
}