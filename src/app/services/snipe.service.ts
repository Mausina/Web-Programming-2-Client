import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Snipe, SnipeInput } from '../models/snipe';

// the service is the single place that talks to the Express API for snipes
@Injectable({ providedIn: 'root' })
export class SnipeService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1/snipes';

  getAll(): Observable<Snipe[]> {
    return this.http.get<Snipe[]>(this.baseUrl);
  }

  getById(id: string): Observable<Snipe> {
    return this.http.get<Snipe>(`${this.baseUrl}/${id}`);
  }

  create(data: SnipeInput): Observable<Snipe> {
    return this.http.post<Snipe>(this.baseUrl, data);
  }

  update(id: string, data: SnipeInput): Observable<Snipe> {
    return this.http.put<Snipe>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
