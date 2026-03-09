import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { GoalRepository } from './contexts/learning/domain/repositories/goal.repository';
import { GoalApiRepository } from './contexts/learning/infrastructure/repositories/goal-api.repository';
import { ResourceRepository } from './contexts/learning/domain/repositories/resource.repository';
import { ResourceApiRepository } from './contexts/learning/infrastructure/repositories/resource-api.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: GoalRepository, useClass: GoalApiRepository },
    { provide: ResourceRepository, useClass: ResourceApiRepository },
  ],
};
