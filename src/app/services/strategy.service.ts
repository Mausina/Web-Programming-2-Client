import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Strategy, StrategyInput } from '../models/strategy';

// the service is the single place that talks to the Express API
@Injectable({ providedIn: 'root' })
export class StrategyService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1/strategies';

  getAll(): Observable<Strategy[]> {
    return this.http.get<Strategy[]>(this.baseUrl);
  }

  getById(id: string): Observable<Strategy> {
    return this.http.get<Strategy>(`${this.baseUrl}/${id}`);
  }

  create(data: StrategyInput): Observable<Strategy> {
    return this.http.post<Strategy>(this.baseUrl, data);
  }

  update(id: string, data: StrategyInput): Observable<Strategy> {
    return this.http.put<Strategy>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
