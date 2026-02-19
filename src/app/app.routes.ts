import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/lifehub', pathMatch: 'full' },
  {
    path: 'lifehub',
    loadComponent: () =>
      import('./layouts/lifehub-layout/lifehub-layout').then((m) => m.LifehubLayout),
    children: [
      {
        path: 'learning',
        loadComponent: () =>
          import('./contexts/learning/presentation/pages/goals/goals').then((m) => m.Goals),
      },
      /*  {
        path: 'recipes',
        loadComponent: () =>
          import('./contexts/recipes/presentation/pages/recipes').then((m) => m.Recipes),
      }, */
    ],
  },
  { path: '**', redirectTo: '/lifehub' },
];
