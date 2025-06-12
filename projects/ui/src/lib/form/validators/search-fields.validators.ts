import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minLengthValidator: (length: number) => ValidatorFn = (length: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;

    if (value == null || value.length === 0) {
      return null;
    }

    if (value.length < length) {
      return { minLength: length }
    }

    return null;
  }
}
