import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StarWarsLibraryComponent } from './star-wars-library/star-wars-library.component';

@Component({
  selector: 'app-root',
  imports: [StarWarsLibraryComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
