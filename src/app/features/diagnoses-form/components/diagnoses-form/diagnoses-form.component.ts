import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  BehaviorSubject,
  Subject,
  takeUntil,
  take,
  tap,
} from 'rxjs';

import { dateFromFutureValidator } from 'src/app/shared/validators/date-from-future.validator';

import { DiagnoseICPC } from '@features/diagnoses-form/models/diagnose-icpc.model';
import { DiagnoseICPCService } from '@features/diagnoses-form/services/diagnose-icpc.service';
import { ConditionsOutput } from '@features/diagnoses-form/models/conditions-output.model';
import { ConditionsOutputJsonService } from '@features/diagnoses-form/services/conditions-output-json.service';
import { ConditionsForm } from '@features/diagnoses-form/models/conditions-form.model';

@Component({
  selector: 'app-diagnoses-form',
  templateUrl: './diagnoses-form.component.html',
  styleUrls: ['./diagnoses-form.component.scss'],
})
export class DiagnosesFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  output?: ConditionsOutput;

  diagnoses$: BehaviorSubject<DiagnoseICPC[]> = new BehaviorSubject<
    DiagnoseICPC[]
  >([]);

  private destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private diagnoseDataService: DiagnoseICPCService,
    private conditionsOutputJsonService: ConditionsOutputJsonService
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  generateOutput() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.output = this.conditionsOutputJsonService.getConditionsOutput(
      this.formValue
    );
  }

  private get formValue(): ConditionsForm {
    return this.form.value as ConditionsForm;
  }

  private setupForm() {
    this.form = this.fb.group({
      date: [null, [dateFromFutureValidator, Validators.required]],
      conditions: [[]],
    });
  }

  private cancelPullingDiagnoses = new Subject<void>()
  pullDiagnosesByQuery(querry: string) {
    this.cancelPullingDiagnoses.next();

    this.diagnoseDataService.getDiagnosesICPC2(querry).pipe(
      takeUntil(this.cancelPullingDiagnoses.asObservable()),
      take(1),
      tap(options => this.diagnoses$.next(options))
    ).subscribe()
  }
}
