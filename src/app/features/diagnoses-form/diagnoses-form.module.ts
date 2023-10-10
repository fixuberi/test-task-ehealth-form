import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '@core/core.module';

import { DiagnosesFormComponent } from './components/diagnoses-form/diagnoses-form.component';
import { DiagnosesFormRoutingModule } from './diagnoses-form-routing.module';
import { DiagnoseICPCService } from './services/diagnose-icpc.service';
import { ConditionsOutputJsonService } from './services/conditions-output-json.service';

@NgModule({
  imports: [
    CommonModule,
    DiagnosesFormRoutingModule,
    HttpClientModule,
    CoreModule,
    ReactiveFormsModule
  ],
  declarations: [DiagnosesFormComponent],
  providers: [
    DiagnoseICPCService,
    ConditionsOutputJsonService
  ]
})
export class DiagnosesFormModule { }
