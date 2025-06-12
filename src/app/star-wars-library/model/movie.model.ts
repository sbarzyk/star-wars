export interface StarWarsMoviesApiResponse {
  results: MovieDto[];
}

export interface MovieDto {
  title: string;
  releaseDate: string;
  director: string;
  producer: string;
  characters: string[];
  vehicles: string[];
  starships: string[];
}

export interface Movie {
  title: string;
  director: string;
  producer: string;
  characters: Character[];
  vehicles: Vehicle[];
  starships: Starship[];
}

export interface Vehicle {
  name: string;
}

export interface Character {
  name: string;
}

export interface Starship {
  name: string;
}

export enum MovieSearchCriteria {
  vehicle = 'vehicle',
  character = 'character',
  starship = 'starship',
}
