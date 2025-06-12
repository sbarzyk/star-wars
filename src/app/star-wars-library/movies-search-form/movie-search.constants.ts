import { SearchFieldConfiguration } from '@ui';
import { MovieSearchCriteria } from '../model';

export const MOVIE_SEARCH_FIELD_CONFIGURATIONS: SearchFieldConfiguration[] = [
  { name: MovieSearchCriteria.vehicle, label: 'Vehicle' },
  { name: MovieSearchCriteria.character, label: 'People' },
  { name: MovieSearchCriteria.starship, label: 'Starship' },
];
