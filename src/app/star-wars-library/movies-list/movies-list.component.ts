import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Character, Movie, MovieSearchCriteria, Starship, Vehicle } from '../model';
import { SearchQuery } from '@ui';

interface MatchedMovie extends Movie {
  matchesSearchQuery: boolean;
}

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesListComponent {
  readonly movies: InputSignal<Movie[]> = input.required<Movie[]>();
  readonly searchQuery: InputSignal<SearchQuery | undefined> = input.required<SearchQuery | undefined>();
  readonly matchedMovies: Signal<MatchedMovie[]> = computed(() =>
    this.movies().map(movie => ({
      ...movie,
      matchesSearchQuery: this.isMovieMatchingSearchQuery(movie, this.searchQuery()),
    })),
  );

  private isMovieMatchingSearchQuery(movie: Movie, searchQuery?: SearchQuery): boolean {
    if (!searchQuery) return false;
    const searchTerm = searchQuery.searchTerm.toLowerCase();
    switch (searchQuery.fieldName) {
      case MovieSearchCriteria.character:
        return movie.characters.some((character: Character) => character.name.toLowerCase() === searchTerm);
      case MovieSearchCriteria.vehicle:
        return movie.vehicles.some((vehicle: Vehicle) => vehicle.name.toLowerCase() === searchTerm);
      case MovieSearchCriteria.starship:
        return movie.starships.some((starship: Starship) => starship.name.toLowerCase() === searchTerm);
      default:
        return false;
    }
  }
}
