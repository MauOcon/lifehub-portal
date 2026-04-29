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
import { GoalDetailRepository } from './contexts/learning/domain/repositories/goal-detail.repository';
import { GoalDetailMockRepository } from './contexts/learning/infrastructure/repositories/goal-detail-mock.repository';
import { LearningPathRepository } from './contexts/learning/domain/repositories/learning-path.repository';
import { LearningPathMockRepository } from './contexts/learning/infrastructure/repositories/learning-path-mock.repository';
import { ResourceRepository } from './contexts/learning/domain/repositories/resource.repository';
import { ResourceApiRepository } from './contexts/learning/infrastructure/repositories/resource-api.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: GoalRepository, useClass: GoalApiRepository },
    { provide: GoalDetailRepository, useClass: GoalDetailMockRepository },
    { provide: LearningPathRepository, useClass: LearningPathMockRepository },
    { provide: ResourceRepository, useClass: ResourceApiRepository },
  ],
};
