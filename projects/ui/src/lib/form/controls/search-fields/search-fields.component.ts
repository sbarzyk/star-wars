import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, Optional } from '@angular/core';
import { Field, SearchFieldConfiguration, SearchQuery } from './search-fields.model';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { minLengthValidator } from '../../validators';
import { EventKey, FormUpdateOn } from '../../model';
import { FormControlErrorComponent } from '../../errors';

@Component({
  selector: 'lib-search-fields',
  imports: [ReactiveFormsModule, FormControlErrorComponent],
  templateUrl: './search-fields.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchFieldsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SearchFieldsComponent),
      multi: true,
    },
  ],
})
export class SearchFieldsComponent implements OnInit, ControlValueAccessor, Validator {
  @Input({ required: true }) fieldConfigurations: SearchFieldConfiguration[] = [];
  @Input() formUpdateOn: FormUpdateOn = FormUpdateOn.blur;
  @Input() validators: ValidatorFn[] = [Validators.required, minLengthValidator(3)];

  fields: Field[] = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (searchQuery: SearchQuery) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  constructor(@Optional() private readonly formGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.fields = this.initFields(this.fieldConfigurations);
  }

  registerOnChange(fn: (searchQuery: SearchQuery) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(searchQuery: SearchQuery | null): void {
    if (searchQuery == null) {
      this.resetFields();
      return;
    }
    this.fields.forEach((field: Field) => {
      const isActiveField = field.name === searchQuery.fieldName;
      const searchTerm = isActiveField ? searchQuery.searchTerm : '';
      field.mandatory = isActiveField;
      field.formControl.setValue(searchTerm, { emitEvent: false });
      field.formControl.setValidators(isActiveField ? this.validators : []);
      field.formControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  validate(): ValidationErrors | null {
    if (this.isParentFormSubmitted()) {
      this.markAllAsTouched();
    }

    return this.getValidationErrors();
  }

  onBlur(): void {
    this.onTouched();
  }

  onInput(fieldName: string, event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    this.fields.forEach((field: Field) => {
      const isActiveField = field.name === fieldName;
      field.mandatory = isActiveField;
      if (isActiveField) {
        field.formControl.markAsUntouched();
        field.formControl.setValidators(this.validators);
      } else {
        field.formControl.reset('', { emitEvent: false });
        field.formControl.setValidators([]);
      }
      field.formControl.updateValueAndValidity({ emitEvent: false });
    });

    this.onChange({ fieldName, searchTerm: inputValue });
  }

  onKeyDown(event: KeyboardEvent): void {
    this.updateControlOnEnterKey(event);
  }

  private updateControlOnEnterKey(event: KeyboardEvent): void {
    if (event.key === EventKey.enter && this.formUpdateOn === FormUpdateOn.blur) {
      const inputElement = event.target as HTMLInputElement;
      inputElement.dispatchEvent(new Event('blur'));
    }
  }

  private initFields(fieldConfigurations: SearchFieldConfiguration[]): Field[] {
    return fieldConfigurations.map((config: SearchFieldConfiguration) => ({
      ...config,
      formControl: new FormControl<string>('', {
        nonNullable: true,
        validators: this.validators,
        updateOn: this.formUpdateOn,
      }),
      mandatory: true,
    }));
  }

  private resetFields(): void {
    this.fields.forEach((field: Field) => {
      field.formControl.reset('', { emitEvent: false });
      field.formControl.setValidators(this.validators);
      field.formControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private getValidationErrors(): ValidationErrors | null {
    const errors: ValidationErrors = {};
    this.fields.forEach((field: Field) => {
      if (field.formControl.invalid) {
        errors[field.name] = field.formControl.errors;
      }
    });
    return Object.keys(errors).length > 0 ? errors : null;
  }

  private isParentFormSubmitted(): boolean {
    return this.formGroupDirective?.submitted ?? false;
  }

  private markAllAsTouched(): void {
    this.fields.forEach((field: Field) => {
      field.formControl.markAsTouched();
      field.formControl.updateValueAndValidity({ emitEvent: false });
    });
  }
}
