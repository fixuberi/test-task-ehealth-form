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
  tap,
  switchMap,
  takeUntil,
  filter,
  finalize,
  map,
} from 'rxjs';

import { dateFromFutureValidator } from '@core/validators/date-from-future.validator';
import { realDiagnoseOrEmptyValidator as realDiagnoseOrEmptyStringValidator } from '@core/validators/real-diagnose.validator';

import { DiagnoseICPC } from '../../models/diagnose-icpc.model';
import { DiagnoseICPCService } from '../../services/diagnose-icpc.service';

@Component({
  selector: 'app-diagnoses-form',
  templateUrl: './diagnoses-form.component.html',
  styleUrls: ['./diagnoses-form.component.scss'],
})
export class DiagnosesFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  output: any;

  diagnoses$: BehaviorSubject<DiagnoseICPC[]> = new BehaviorSubject<
    DiagnoseICPC[]
  >([]);
  isLoading$ = new BehaviorSubject<boolean>(false);

  private destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private diagnoseDataService: DiagnoseICPCService
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
    this.form = this.fb.group({
      date: [null, [dateFromFutureValidator, Validators.required]],
      conditions: this.fb.array([]),
    });

    this.addConditionControls();
  }

  addDiagnose() {
    this.addConditionControls();
  }

  generateOutput() {}

  private addConditionControls() {
    const controlsPair = this.fb.group({
      diagnose: ['', [realDiagnoseOrEmptyStringValidator]],
      note: [''],
    });
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
        tap(() => this.isLoading$.next(true)),
        switchMap((value) => this.diagnoseDataService.getDiagnosesICPC2(value)),
        takeUntil(this.destroyed$),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe((options) => {
        this.diagnoses$.next(options);
      });
  }

  diagnoseDisplayFn(option: DiagnoseICPC | null): string {
    return option ? `${option.code} ${option.name}` : '';
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
