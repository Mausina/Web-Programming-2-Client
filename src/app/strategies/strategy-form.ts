import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StrategyService } from '../services/strategy.service';
import { StrategyInput } from '../models/strategy';

@Component({
  selector: 'app-strategy-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './strategy-form.html',
  styleUrl: './strategy-form.scss',
})
export class StrategyForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(StrategyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly id = signal<string | null>(null);
  readonly saving = signal(false);

  // reactive form; the validators mirror the Zod rules on the server
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    buyAmountSol: [0.5, [Validators.required, Validators.min(0.01), Validators.max(100)]],
    takeProfitPct: [100, [Validators.required, Validators.min(1), Validators.max(10000)]],
    stopLossPct: [30, [Validators.required, Validators.min(1), Validators.max(100)]],
    maxHoldMinutes: [15, [Validators.required, Validators.min(1), Validators.max(1440)]],
    isActive: [true],
    isPublic: [false],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.service.getById(id).subscribe({
        next: (strategy) => this.form.patchValue(strategy),
        error: () => this.snackBar.open('Could not load strategy', 'OK', { duration: 3000 }),
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
    const data = this.form.getRawValue() as StrategyInput;
    const id = this.id();
    const request = id ? this.service.update(id, data) : this.service.create(data);

    request.subscribe({
      next: () => {
        this.snackBar.open(id ? 'Strategy updated' : 'Strategy created', 'OK', { duration: 3000 });
        this.router.navigate(['/strategies']);
      },
      error: () => {
        this.snackBar.open('Save failed. Check the values and the API.', 'OK', { duration: 3000 });
        this.saving.set(false);
      },
    });
  }
}
