import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { SearchFieldsComponent, SearchFieldConfiguration, SearchQuery, FormUpdateOn } from '@ui';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MOVIE_SEARCH_FIELD_CONFIGURATIONS } from './movie-search.constants';

@Component({
  selector: 'app-movies-search-form',
  imports: [SearchFieldsComponent, ReactiveFormsModule],
  templateUrl: './movies-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesSearchFormComponent {
  @Output() searchQuery = new EventEmitter<SearchQuery>();

  readonly formUpdateOn = FormUpdateOn.blur;
  readonly movieSearchFieldConfigurations: SearchFieldConfiguration[] = MOVIE_SEARCH_FIELD_CONFIGURATIONS;

  readonly form = new FormGroup<{ searchQuery: FormControl<SearchQuery | null> }>({
    searchQuery: new FormControl<SearchQuery | null>(null, { updateOn: this.formUpdateOn }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.controls.searchQuery.updateValueAndValidity();
      return;
    }
    if (this.form.value.searchQuery != null) {
      this.searchQuery.emit(this.form.value.searchQuery);
    }
  }
}
