import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  switchMap,
  takeUntil,
  filter,
  map,
} from 'rxjs';

import { dateFromFutureValidator } from '@core/validators/date-from-future.validator';
import { realDiagnoseOrEmptyValidator } from '@core/validators/real-diagnose.validator';

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

  get addedConditions(): FormArray {
    return this.form.get('conditions') as FormArray;
  }

  get isDisplayAddDiagnose() {
    const conditions = this.form?.value['conditions'];
    const lastElementInConditions = conditions[conditions.length - 1];

    return (
      lastElementInConditions['diagnose'] !== null &&
      typeof lastElementInConditions['diagnose'] === 'object'
    );
  }

  ngOnInit() {
    this.setupForm();
    this.addConditionControls();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  addDiagnose() {
    this.addConditionControls();
  }

  generateOutput() {
    this.output = this.conditionsOutputJsonService.getConditionsOutput(
      this.formValue
    );
  }

  diagnoseDisplayFn(option: DiagnoseICPC | null): string {
    return option ? `${option.code} ${option.name}` : '';
  }

  private get formValue(): ConditionsForm {
    const form = this.form.value as ConditionsForm;

    return {
      date: form.date,
      conditions: form.conditions.filter((condition) => !!condition.diagnose),
    };
  }

  private setupForm() {
    this.form = this.fb.group({
      date: [null, [dateFromFutureValidator, Validators.required]],
      conditions: this.fb.array([]),
    });
  }

  private buildDiagnoseWithNoteControls(): FormGroup {
    return this.fb.group({
      diagnose: ['', [realDiagnoseOrEmptyValidator]],
      note: [''],
    });
  }

  private addConditionControls() {
    const controlsPair = this.buildDiagnoseWithNoteControls();
    this.addedConditions.push(controlsPair);

    const diagnoseControl = controlsPair.get('diagnose')!;
    this.setupAutocompletePullingOptions(diagnoseControl);
  }

  private setupAutocompletePullingOptions(control: AbstractControl) {
    control.valueChanges
      .pipe(
        filter((value) => typeof value === 'string'),
        map((query: string) => query.trim().toLowerCase()),
        filter((query) => query.length >= 3),
        debounceTime(300),
        switchMap((value) => this.diagnoseDataService.getDiagnosesICPC2(value)),
        takeUntil(this.destroyed$)
      )
      .subscribe((options) => {
        this.diagnoses$.next(options);
      });
  }
}
