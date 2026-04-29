import { Provider } from '@angular/core';
import { GoalRepository } from './domain/repositories/goal.repository';
import { GoalApiRepository } from './infrastructure/repositories/goal-api.repository';
import { GoalDetailRepository } from './domain/repositories/goal-detail.repository';
import { GoalDetailMockRepository } from './infrastructure/repositories/goal-detail-mock.repository';

export const learningProviders: Provider[] = [
  { provide: GoalRepository, useClass: GoalApiRepository },
  { provide: GoalDetailRepository, useClass: GoalDetailMockRepository },
];
