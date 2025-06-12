import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SearchQuery } from '@ui';
import { MoviesSearchFormComponent } from './movies-search-form/movies-search-form.component';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { StarWarsApiService } from './services/star-wars-api.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Movie } from './model';

@Component({
  selector: 'app-star-wars-library',
  imports: [MoviesSearchFormComponent, MoviesListComponent, AsyncPipe],
  templateUrl: './star-wars-library.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarWarsLibraryComponent implements OnInit {
  movies$?: Observable<Movie[]>;
  searchQuery?: SearchQuery;

  constructor(readonly starWarsApi: StarWarsApiService) {}

  ngOnInit(): void {
    this.movies$ = this.starWarsApi.getMovies();
  }

  onNewSearchQuery(searchQuery: SearchQuery): void {
    this.searchQuery = searchQuery;
  }
}
