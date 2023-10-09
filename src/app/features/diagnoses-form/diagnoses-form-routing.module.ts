import { NgModule } from '@angular/core';
import { DiagnosesFormComponent } from './components/diagnoses-form/diagnoses-form.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: DiagnosesFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosesFormRoutingModule {}
