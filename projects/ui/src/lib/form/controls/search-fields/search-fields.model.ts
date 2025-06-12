import { FormControl } from '@angular/forms';

export interface SearchFieldConfiguration {
  name: string;
  label: string;
}

export interface SearchQuery {
  fieldName: string;
  searchTerm: string;
}

export interface Field {
  name: string;
  label: string;
  formControl: FormControl<string>;
  mandatory: boolean;
}
