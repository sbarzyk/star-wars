import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Character, Movie, MovieDto, Starship, StarWarsMoviesApiResponse } from '../model';

@Injectable({
  providedIn: 'root',
})
export class StarWarsApiService {
  constructor(private readonly httpClient: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.httpClient
      .get<StarWarsMoviesApiResponse>(`${environment.starWarsApiRootUrl}${environment.starWarsApiEndpointMovies}`)
      .pipe(
        map(response => response.results ?? []),
        map((films: MovieDto[]) => films.map((film: MovieDto) => this.addMovieData(film))),
        switchMap(movieObservables => forkJoin(movieObservables)),
        catchError(error => {
          console.error('Error fetching movies:', error);
          return of([]);
        }),
      );
  }

  private addMovieData(movie: MovieDto): Observable<Movie> {
    return forkJoin({
      characters: this.resolveUrls<Character>(movie.characters),
      vehicles: this.resolveUrls<Starship>(movie.vehicles),
      starships: this.resolveUrls<Starship>(movie.starships),
    }).pipe(
      map(resolved => ({
        title: movie.title,
        releaseDate: movie.releaseDate,
        director: movie.director,
        producer: movie.producer,
        characters: resolved.characters,
        vehicles: resolved.vehicles,
        starships: resolved.starships,
      })),
    );
  }

  private resolveUrls<T>(urls: string[]): Observable<T[]> {
    if (!urls || urls.length === 0) {
      return of([]);
    }
    const requests: Observable<T>[] = urls.map((url: string) => this.httpClient.get<T>(url));
    return forkJoin(requests);
  }
}
