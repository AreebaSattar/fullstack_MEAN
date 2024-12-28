import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { provideRouter } from '@angular/router';

import 'zone.js';

import {AppComponent} from './app/app.component';
import {routes} from './app/app.routes';
import {ApiService} from './app/services/api.service';
import {HttpClientModule} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],

};

bootstrapApplication(AppComponent, appConfig);
console.clear();
