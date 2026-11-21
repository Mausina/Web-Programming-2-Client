import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StrategyService } from '../services/strategy.service';
import { Strategy } from '../models/strategy';

@Component({
  selector: 'app-strategy-list',
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './strategy-list.html',
  styleUrl: './strategy-list.scss',
})
export class StrategyList implements OnInit {
  private service = inject(StrategyService);
  private snackBar = inject(MatSnackBar);

  readonly strategies = signal<Strategy[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly displayedColumns = [
    'name',
    'buyAmountSol',
    'takeProfitPct',
    'stopLossPct',
    'isActive',
    'isPublic',
    'actions',
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.service.getAll().subscribe({
      next: (data) => {
        this.strategies.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load strategies. Is the API running on port 3000?');
        this.loading.set(false);
      },
    });
  }

  remove(strategy: Strategy): void {
    this.service.delete(strategy._id).subscribe({
      next: () => {
        this.snackBar.open(`Deleted "${strategy.name}"`, 'OK', { duration: 3000 });
        this.load();
      },
      error: () => this.snackBar.open('Delete failed', 'OK', { duration: 3000 }),
    });
  }
}
