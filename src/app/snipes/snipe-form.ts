import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnipeService } from '../services/snipe.service';
import { StrategyService } from '../services/strategy.service';
import { SnipeInput } from '../models/snipe';
import { Strategy } from '../models/strategy';

@Component({
  selector: 'app-snipe-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './snipe-form.html',
  styleUrl: './snipe-form.scss',
})
export class SnipeForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(SnipeService);
  private strategyService = inject(StrategyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly id = signal<string | null>(null);
  readonly saving = signal(false);
  // the strategies are loaded so the user can pick which one owns the snipe
  readonly strategies = signal<Strategy[]>([]);

  // reactive form; the validators mirror the Zod rules on the server
  readonly form = this.fb.nonNullable.group({
    strategy: ['', [Validators.required]],
    tokenName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    tokenMint: ['', [Validators.required, Validators.minLength(32), Validators.maxLength(44)]],
    amountSol: [0.5, [Validators.required, Validators.min(0.01), Validators.max(100)]],
    status: ['open' as 'open' | 'closed', [Validators.required]],
    profitLossPct: [0, [Validators.required]],
  });

  ngOnInit(): void {
    // load the strategies for the dropdown
    this.strategyService.getAll().subscribe({
      next: (data) => this.strategies.set(data),
      error: () => this.snackBar.open('Could not load strategies', 'OK', { duration: 3000 }),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.service.getById(id).subscribe({
        next: (snipe) =>
          this.form.patchValue({
            // the API returns strategy populated as an object; the form needs its id
            strategy: snipe.strategy?._id ?? '',
            tokenName: snipe.tokenName,
            tokenMint: snipe.tokenMint,
            amountSol: snipe.amountSol,
            status: snipe.status,
            profitLossPct: snipe.profitLossPct,
          }),
        error: () => this.snackBar.open('Could not load snipe', 'OK', { duration: 3000 }),
      });
    }
  }

  get isEdit(): boolean {
    return this.id() !== null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const data = this.form.getRawValue() as SnipeInput;
    const id = this.id();
    const request = id ? this.service.update(id, data) : this.service.create(data);

    request.subscribe({
      next: () => {
        this.snackBar.open(id ? 'Snipe updated' : 'Snipe created', 'OK', { duration: 3000 });
        this.router.navigate(['/snipes']);
      },
      error: () => {
        this.snackBar.open('Save failed. Check the values and the API.', 'OK', { duration: 3000 });
        this.saving.set(false);
      },
    });
  }
}
