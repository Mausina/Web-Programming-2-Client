import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnipeService } from '../services/snipe.service';
import { Snipe } from '../models/snipe';

@Component({
  selector: 'app-snipe-list',
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './snipe-list.html',
  styleUrl: './snipe-list.scss',
})
export class SnipeList implements OnInit {
  private service = inject(SnipeService);
  private snackBar = inject(MatSnackBar);

  readonly snipes = signal<Snipe[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly displayedColumns = [
    'tokenName',
    'strategy',
    'amountSol',
    'status',
    'profitLossPct',
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
        this.snipes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load snipes. Is the API running on port 3000?');
        this.loading.set(false);
      },
    });
  }

  remove(snipe: Snipe): void {
    this.service.delete(snipe._id).subscribe({
      next: () => {
        this.snackBar.open(`Deleted "${snipe.tokenName}"`, 'OK', { duration: 3000 });
        this.load();
      },
      error: () => this.snackBar.open('Delete failed', 'OK', { duration: 3000 }),
    });
  }
}
