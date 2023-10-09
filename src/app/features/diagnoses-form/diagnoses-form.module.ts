import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosesFormComponent } from './components/diagnoses-form/diagnoses-form.component';
import { DiagnosesFormRoutingModule } from './diagnoses-form-routing.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    DiagnosesFormRoutingModule,
    CoreModule
  ],
  declarations: [DiagnosesFormComponent]
})
export class DiagnosesFormModule { }
