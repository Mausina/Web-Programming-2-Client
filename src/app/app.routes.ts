import { Routes } from '@angular/router';
import { StrategyList } from './strategies/strategy-list';
import { StrategyForm } from './strategies/strategy-form';
import { SnipeList } from './snipes/snipe-list';
import { SnipeForm } from './snipes/snipe-form';

export const routes: Routes = [
  { path: '', redirectTo: 'strategies', pathMatch: 'full' },
  { path: 'strategies', component: StrategyList },
  { path: 'strategies/new', component: StrategyForm },
  { path: 'strategies/:id/edit', component: StrategyForm },
  { path: 'snipes', component: SnipeList },
  { path: 'snipes/new', component: SnipeForm },
  { path: 'snipes/:id/edit', component: SnipeForm },
  { path: '**', redirectTo: 'strategies' },
];
