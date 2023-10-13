import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  FormArray,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { Subject, debounceTime, takeUntil, filter, map, tap } from 'rxjs';

import { DiagnoseICPC } from '@features/diagnoses-form/models/diagnose-icpc.model';

import { realDiagnoseOrEmptyValidator } from '../../validators/real-diagnose.validator';
import { isDiagnoseObject } from '../../utils/diagnose.helpers';

@Component({
  selector: 'app-diagnoses-with-notes',
  templateUrl: './diagnoses-with-notes.component.html',
  styleUrls: ['./diagnoses-with-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DiagnosesWithNotesComponent),
      multi: true,
    },
  ],
})
export class DiagnosesWithNotesComponent
  implements OnInit, OnDestroy, OnChanges, ControlValueAccessor
{
  @Input() autocompleteTriggerCountOfChars = 3;
  @Input() label = 'Діагнози за ICPC-2';
  @Input() diagnosesOptions: DiagnoseICPC[] = [];

  @Output() autocompleteQuery = new EventEmitter<string>();

  form!: FormGroup;
  isLoadingOptions = false;
  private destroyed$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}


  get addedConditions() {
    return this.form.get('conditions') as FormArray;
  }

  get addedConditionsValue() {
    return this.form.getRawValue()['conditions'] || [];
  }

  get conditionsValueWithPickedDiagnoses() {
    return this.addedConditionsValue.filter(isDiagnoseObject);
  }

  get isDisplayAddDiagnose() {
    return this.addedConditionsValue.every(isDiagnoseObject);
  }

  ngOnInit() {
    this.form = this.fb.group({
      conditions: this.fb.array([]),
    });

    this.addConditionControls();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diagnosesOptions']) {
      this.isLoadingOptions = false;
    }
  }

  diagnoseDisplayFn(option: DiagnoseICPC | null): string {
    return option ? `${option.code} ${option.name}` : '';
  }

  addDiagnose() {
    this.addConditionControls();
  }

  writeValue(conditions: any[]): void {
    if (!conditions) return;

    this.addedConditions.clear();
    if (!conditions.length) {
      this.addConditionControls();
    } else {
      conditions.forEach((condition) => {
        const controlPair = this.addConditionControls();
        controlPair.patchValue(condition);
      });
    }
  }

  private onChange: (value: any) => void = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    const controls = this.addedConditions;

    for (let i = 0; i < controls.length; i++) {
      const control = controls.at(i);
      isDisabled ? control.disable(): control.enable()
    }
  }

  private addConditionControls(): FormGroup<any> {
    const controlsPair = this.buildDiagnoseWithNoteControls();
    this.addedConditions.controls.push(controlsPair);

    this.setupParrentFormNotificationOnChange(controlsPair);
    this.setupAutocompletePullingOptionsFor(controlsPair.get('diagnose')!);

    return controlsPair;
  }

  private buildDiagnoseWithNoteControls(): FormGroup {
    return this.fb.group({
      diagnose: ['', [realDiagnoseOrEmptyValidator]],
      note: [''],
    });
  }

  private setupAutocompletePullingOptionsFor(control: AbstractControl) {
    control.valueChanges
      .pipe(
        filter((value) => typeof value === 'string'),
        map((query: string) => query.trim().toLowerCase()),
        filter((query) => query.length >= this.autocompleteTriggerCountOfChars),
        debounceTime(300),
        tap(() => {
          this.isLoadingOptions = true;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((query) => this.autocompleteQuery.emit(query));
  }

  private setupParrentFormNotificationOnChange(formGroup: FormGroup<any>) {
    formGroup.valueChanges
      .pipe(filter(isDiagnoseObject), takeUntil(this.destroyed$))
      .subscribe(() => this.onChange(this.conditionsValueWithPickedDiagnoses));
  }
}
