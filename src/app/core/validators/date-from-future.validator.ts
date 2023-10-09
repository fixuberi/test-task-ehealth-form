import { FormControl, ValidationErrors } from '@angular/forms';

export function dateFromFutureValidator(control: FormControl): ValidationErrors | null {
  const dateValue: Date = control.value;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  if (dateValue && dateValue < currentDate) {
    return { 'dateInPast': true };
  }

  return null;
}
