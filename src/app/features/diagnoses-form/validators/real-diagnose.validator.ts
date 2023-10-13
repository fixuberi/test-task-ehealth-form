import { FormControl, ValidationErrors } from '@angular/forms';

export function realDiagnoseOrEmptyValidator(
  control: FormControl
): ValidationErrors | null {
  const diagnose: Object | string | null = control.value;

  if (typeof diagnose === 'string' && diagnose.length) {
    return { notRealDiagnose: true };
  }

  return null;
}
