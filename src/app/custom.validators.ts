import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {

  static regex(regex: RegExp, error: ValidationErrors): ValidatorFn | null {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null;
      }

      let valid = regex.test(control.value);

      return valid ? null : error;
    };
  }

}
