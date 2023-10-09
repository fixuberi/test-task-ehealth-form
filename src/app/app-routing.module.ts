import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  {
    path: 'form',
    loadChildren: () =>
      import('./features/diagnoses-form/diagnoses-form.module').then(
        (m) => m.DiagnosesFormModule
      ),
  },
  { path: '**', redirectTo: '/form' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
