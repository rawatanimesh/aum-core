import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalAppInitService } from './services/global-app-init.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    // Triggers the service constructor which registers all global toolbar actions
    inject(GlobalAppInitService);
  }
}
