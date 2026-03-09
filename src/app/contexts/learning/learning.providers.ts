import { Provider } from '@angular/core';
import { GoalRepository } from './domain/repositories/goal.repository';
import { GoalApiRepository } from './infrastructure/repositories/goal-api.repository';

export const learningProviders: Provider[] = [
  { provide: GoalRepository, useClass: GoalApiRepository },
];
