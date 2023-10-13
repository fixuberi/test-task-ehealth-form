import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialModule } from '@shared/material.module';
import { DateWithDotSeparatorsAdapter } from '@shared/utils/date-adapter';

import { DiagnosesFormComponent } from './components/diagnoses-form/diagnoses-form.component';
import { DiagnosesFormRoutingModule } from './diagnoses-form-routing.module';
import { DiagnoseICPCService } from './services/diagnose-icpc.service';
import { ConditionsOutputJsonService } from './services/conditions-output-json.service';
import { DiagnosesWithNotesComponent } from './components/diagnoses-with-notes/diagnoses-with-notes.component';

@NgModule({
  imports: [
    CommonModule,
    DiagnosesFormRoutingModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [DiagnosesFormComponent, DiagnosesWithNotesComponent],
  providers: [
    DiagnoseICPCService,
    ConditionsOutputJsonService,
    { provide: DateAdapter, useClass: DateWithDotSeparatorsAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class DiagnosesFormModule {}
